import { describe, expect, it, vi } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import QuoteForm from "@/components/QuoteForm";
import { QUOTE_SOURCES, isPhone, quoteMailto, readQuote, sendQuote, validateQuote, WEB3FORMS_URL, type QuoteData } from "@/lib/quoteSchema";

const valid = (): QuoteData => ({
  nom: "Martin", prenom: "Léa", email: "lea@example.fr", telephone: "06 12 34 56 78", adresse1: "", adresse2: "",
  ville: "Lyon", region: "", codePostal: "69003", pays: "France", service: "Dératisation", source: "Fiche Google", message: "Des souris dans la cuisine.", consent: true,
});

describe("validateQuote", () => {
  it("accepts a complete request", () => expect(validateQuote(valid())).toEqual({}));

  it("lists every required field when empty", () => {
    const empty = readQuote(new FormData());
    expect(Object.keys(validateQuote(empty)).sort()).toEqual(["consent", "email", "message", "nom", "prenom", "telephone"]);
  });

  it("rejects invalid emails and phones", () => {
    for (const email of ["lea", "lea@", "lea@example", "lea @example.fr"]) expect(validateQuote({ ...valid(), email }).email, email).toBeTruthy();
    for (const telephone of ["123", "06 12 34 56", "abcdefghij", "+33 6 12"]) expect(validateQuote({ ...valid(), telephone }).telephone, telephone).toBeTruthy();
    for (const t of ["0612345678", "+33 6 12 34 56 78", "0033612345678", "06.12.34.56.78", "+41 22 123 45 67"]) expect(isPhone(t), t).toBe(true);
  });

  it("accepts only the listed sources, or none", () => {
    for (const source of ["", ...QUOTE_SOURCES]) expect(validateQuote({ ...valid(), source }).source, source).toBeUndefined();
    expect(validateQuote({ ...valid(), source: "Facebook" }).source).toBeTruthy();
  });

  it("caps field lengths", () => expect(validateQuote({ ...valid(), message: "x".repeat(3001) }).message).toBeTruthy());
});

describe("sendQuote", () => {
  it("posts JSON with the key and reports Web3Forms' answer", async () => {
    const fetchFn = vi.fn(async () => new Response(JSON.stringify({ success: true }), { status: 200 }));
    expect(await sendQuote(valid(), "KEY", fetchFn as typeof fetch)).toBe(true);
    const [url, init] = fetchFn.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe(WEB3FORMS_URL);
    expect(JSON.parse(String(init.body))).toMatchObject({ access_key: "KEY", email: "lea@example.fr", service: "Dératisation", source: "Fiche Google" });
  });

  it("never reports a fake success", async () => {
    const answers = [new Response("{}", { status: 500 }), new Response(JSON.stringify({ success: false }), { status: 200 })];
    for (const r of answers) expect(await sendQuote(valid(), "KEY", (async () => r) as unknown as typeof fetch)).toBe(false);
    expect(await sendQuote(valid(), "KEY", (async () => { throw new Error("offline"); }) as unknown as typeof fetch)).toBe(false);
  });
});

describe("QuoteForm", () => {
  it("renders the old form's fields at #mon-devis with a honeypot and France by default", () => {
    const html = renderToStaticMarkup(createElement(QuoteForm, { accessKey: "" }));
    expect(html).toContain('id="mon-devis"');
    for (const n of ["nom", "prenom", "email", "telephone", "adresse1", "adresse2", "ville", "region", "codePostal", "pays", "service", "source", "message", "consent", "botcheck"])
      expect(html, n).toContain(`name="${n}"`);
    expect(html).toContain('value="France"');
  });

  it("mailto fallback carries the request", () => {
    const href = quoteMailto(valid(), "contact@hanuisibles3d.fr");
    expect(href.startsWith("mailto:contact@hanuisibles3d.fr?subject=")).toBe(true);
    expect(decodeURIComponent(href)).toContain("Des souris dans la cuisine.");
    expect(decodeURIComponent(href)).toContain("Nous a connus par : Fiche Google");
  });
});
