// Quote form: fields of the old site's form, validation and submission to Web3Forms.
// shortcut: hand-written validation instead of React Hook Form + Zod (keeps the page JS light); upgrade if forms multiply.

export const QUOTE_FIELDS = [
  "nom", "prenom", "email", "telephone", "adresse1", "adresse2", "ville", "region", "codePostal", "pays", "service", "source", "message",
] as const;
// « Comment nous avez-vous connus ? » answers; also sent as the `source` property of the « Devis envoyé » event.
export const QUOTE_SOURCES = ["Fiche Google", "Recherche Google", "Bouche-à-oreille", "Autre"] as const;
export type QuoteField = (typeof QUOTE_FIELDS)[number] | "consent";
export type QuoteData = Record<(typeof QUOTE_FIELDS)[number], string> & { consent: boolean; botcheck?: string };
export type QuoteErrors = Partial<Record<QuoteField, string>>;

const REQUIRED: QuoteField[] = ["nom", "prenom", "email", "telephone", "message"];
const MAX = { message: 3000, default: 200 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// French numbers (06…, +33 6…, 0033 6…) or any international number in + format.
const PHONE_RE = /^(?:(?:\+|00)33|0)[1-9]\d{8}$|^\+[1-9]\d{7,14}$/;

export const isPhone = (v: string) => PHONE_RE.test(v.replace(/[\s.\-()]/g, ""));

/** Reads a submitted form into QuoteData (missing fields become ""). */
export function readQuote(form: FormData): QuoteData {
  const get = (k: string) => String(form.get(k) ?? "").trim();
  const data = Object.fromEntries(QUOTE_FIELDS.map((k) => [k, get(k)])) as Record<(typeof QUOTE_FIELDS)[number], string>;
  return { ...data, consent: form.get("consent") === "on", botcheck: get("botcheck") };
}

export function validateQuote(d: QuoteData): QuoteErrors {
  const errors: QuoteErrors = {};
  for (const k of QUOTE_FIELDS) {
    if (d[k].length > (k === "message" ? MAX.message : MAX.default)) errors[k] = "Ce champ est trop long.";
  }
  for (const k of REQUIRED) if (!d[k as keyof QuoteData]) errors[k] = "Ce champ est obligatoire.";
  if (d.email && !EMAIL_RE.test(d.email)) errors.email = "Adresse e-mail invalide (exemple : nom@domaine.fr).";
  if (d.telephone && !isPhone(d.telephone)) errors.telephone = "Numéro de téléphone invalide (exemple : 06 12 34 56 78).";
  if (d.codePostal && !/^[A-Za-z0-9 -]{3,10}$/.test(d.codePostal)) errors.codePostal = "Code postal invalide.";
  if (d.source && !(QUOTE_SOURCES as readonly string[]).includes(d.source)) errors.source = "Choix invalide.";
  if (!d.consent) errors.consent = "Merci d'accepter l'utilisation de vos données pour traiter votre demande.";
  return errors;
}

export const WEB3FORMS_URL = "https://api.web3forms.com/submit";

/** Sends a validated request; true only when Web3Forms confirms it (never a fake success). */
export async function sendQuote(d: QuoteData, accessKey: string, fetchFn: typeof fetch = fetch): Promise<boolean> {
  try {
    const res = await fetchFn(WEB3FORMS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: accessKey,
        subject: `Demande de devis – ${d.service || "service non précisé"} – ${d.prenom} ${d.nom}`,
        from_name: "Site HA Nuisibles",
        replyto: d.email,
        botcheck: d.botcheck || "",
        ...Object.fromEntries(QUOTE_FIELDS.map((k) => [k, d[k]])),
      }),
    });
    const json = await res.json().catch(() => ({}));
    return res.ok && json.success === true;
  } catch {
    return false;
  }
}

/** mailto: link carrying the request, used while no Web3Forms key is configured. */
export function quoteMailto(d: QuoteData, to: string): string {
  const lines = [
    `Nom : ${d.prenom} ${d.nom}`, `E-mail : ${d.email}`, `Téléphone : ${d.telephone}`,
    `Adresse : ${[d.adresse1, d.adresse2, d.codePostal, d.ville, d.region, d.pays].filter(Boolean).join(", ")}`,
    `Service : ${d.service || "non précisé"}`, `Nous a connus par : ${d.source || "non précisé"}`, "", d.message,
  ];
  return `mailto:${to}?subject=${encodeURIComponent("Demande de devis")}&body=${encodeURIComponent(lines.join("\n"))}`;
}
