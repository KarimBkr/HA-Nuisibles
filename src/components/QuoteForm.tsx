"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { CircleAlert, CircleCheck, Loader2, Mail, Phone, Send } from "lucide-react";
import Link from "next/link";
import { site, telHref } from "@/config/site";
import { SERVICES } from "@/config/services";
import { EVENTS, track } from "@/lib/analytics";
import { quoteMailto, readQuote, sendQuote, validateQuote, type QuoteErrors, type QuoteField } from "@/lib/quoteSchema";

type Status = { state: "idle" | "sending" | "success" | "error" } | { state: "nokey"; mailto: string };

const input = "mt-1 block w-full min-h-11 rounded-card border border-line bg-white px-3 py-2 text-ink aria-[invalid=true]:border-accent";

// Quote request (anchor #mon-devis): fields of the old form, sent to Web3Forms; without a key, a prefilled e-mail and the phone.
export default function QuoteForm({ accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_KEY || "" }: { accessKey?: string }) {
  const [errors, setErrors] = useState<QuoteErrors>({});
  const [status, setStatus] = useState<Status>({ state: "idle" });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status.state === "sending") return;
    const form = e.currentTarget;
    const data = readQuote(new FormData(form));
    const found = validateQuote(data);
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) return form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
    if (!accessKey) return setStatus({ state: "nokey", mailto: quoteMailto(data, site.email) });
    setStatus({ state: "sending" });
    const ok = await sendQuote(data, accessKey);
    if (ok) {
      form.reset();
      track(EVENTS.quote, { service: data.service || "non précisé" });
    }
    setStatus({ state: ok ? "success" : "error" });
  }

  const field = (name: QuoteField, label: string, el: ReactNode, required = false) => (
    <div>
      <label htmlFor={`q-${name}`} className="text-sm font-semibold text-ink">
        {label} {required && <span className="text-accent" aria-hidden>*</span>}
      </label>
      {el}
      {errors[name] && <p id={`q-${name}-err`} className="mt-1 text-sm font-medium text-accent">{errors[name]}</p>}
    </div>
  );
  const text = (name: QuoteField, label: string, opts: { type?: string; required?: boolean; autoComplete?: string; defaultValue?: string } = {}) =>
    field(
      name,
      label,
      <input
        id={`q-${name}`}
        name={name}
        type={opts.type ?? "text"}
        autoComplete={opts.autoComplete}
        defaultValue={opts.defaultValue}
        aria-required={opts.required || undefined}
        aria-invalid={!!errors[name]}
        aria-describedby={errors[name] ? `q-${name}-err` : undefined}
        className={input}
      />,
      opts.required,
    );

  // Once sent, the form gives way to the confirmation: no empty form left to submit twice by accident.
  if (status.state === "success")
    return (
      <div id="mon-devis" className="scroll-mt-28 rounded-card border border-line bg-white p-6 shadow-soft md:p-8">
        <p data-quote-success role="status" tabIndex={-1} ref={(el) => el?.focus()} className="flex items-start gap-2 rounded-card bg-brand-light p-4 font-medium text-brand-dark outline-none">
          <CircleCheck aria-hidden size={20} className="mt-0.5 shrink-0" /> Merci, votre demande a bien été envoyée. Nous vous recontactons sous 24h.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a href={telHref} className="btn bg-accent text-white hover:opacity-90">
            <Phone aria-hidden size={18} /> {site.phone.display}
          </a>
          <button type="button" onClick={() => setStatus({ state: "idle" })} className="btn border-2 border-brand text-brand-dark hover:bg-brand-light">
            Envoyer une autre demande
          </button>
        </div>
      </div>
    );

  return (
    <form
      id="mon-devis"
      noValidate
      onSubmit={onSubmit}
      // Clear a field's error as soon as it is edited, not only on the next submit.
      onInput={(e) => {
        const name = (e.target as HTMLInputElement).name as QuoteField;
        if (errors[name]) setErrors(({ [name]: _, ...rest }) => rest);
      }}
      className="scroll-mt-28 rounded-card border border-line bg-white p-6 shadow-soft md:p-8" aria-labelledby="devis-titre">
      <h2 id="devis-titre" className="text-2xl font-bold text-brand-dark">Demandez votre devis gratuit</h2>
      <p className="mt-2 text-muted">Remplissez le formulaire : nous vous recontactons sous 24h. Les champs marqués * sont obligatoires.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {text("nom", "Nom", { required: true, autoComplete: "family-name" })}
        {text("prenom", "Prénom", { required: true, autoComplete: "given-name" })}
        {text("telephone", "Téléphone", { type: "tel", required: true, autoComplete: "tel" })}
        {text("email", "Email", { type: "email", required: true, autoComplete: "email" })}
        {text("codePostal", "Code postal", { autoComplete: "postal-code" })}
        {text("ville", "Ville", { autoComplete: "address-level2" })}
        <div className="sm:col-span-2">
          {field(
            "service",
            "Service demandé",
            <select id="q-service" name="service" defaultValue="" className={input}>
              <option value="">Sélectionner un service</option>
              {SERVICES.map((s) => <option key={s.key}>{s.label}</option>)}
              <option>Autres</option>
            </select>,
          )}
        </div>
        <div className="sm:col-span-2">
          {field(
            "message",
            "Message",
            <textarea
              id="q-message"
              name="message"
              rows={5}
              aria-required
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? "q-message-err" : undefined}
              className={input}
            />,
            true,
          )}
        </div>
        {/* Rarely needed to quote: folded so the mobile form stays short; folded inputs still submit. */}
        <details className="sm:col-span-2">
          <summary className="inline-flex min-h-11 cursor-pointer items-center font-semibold text-brand-dark">Adresse complète (facultatif)</summary>
          <div className="mt-2 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">{text("adresse1", "Adresse ligne 1", { autoComplete: "address-line1" })}</div>
            <div className="sm:col-span-2">{text("adresse2", "Adresse ligne 2", { autoComplete: "address-line2" })}</div>
            {text("region", "Région", { autoComplete: "address-level1" })}
            {text("pays", "Pays", { autoComplete: "country-name", defaultValue: "France" })}
          </div>
        </details>
      </div>
      {/* Honeypot: hidden from people, bots fill it and Web3Forms drops the message. */}
      <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <div className="mt-5">
        <label className="flex items-start gap-3 text-sm text-ink">
          <input
            name="consent"
            type="checkbox"
            aria-invalid={!!errors.consent}
            aria-describedby={errors.consent ? "q-consent-err" : undefined}
            className="mt-0.5 size-5 shrink-0 accent-brand"
          />
          <span>
            J&apos;accepte que mes données soient utilisées pour traiter ma demande (voir la{" "}
            <Link href="/confidentalite/" className="underline">politique de confidentialité</Link>). <span className="text-accent" aria-hidden>*</span>
          </span>
        </label>
        {errors.consent && <p id="q-consent-err" className="mt-1 text-sm font-medium text-accent">{errors.consent}</p>}
      </div>
      <button type="submit" disabled={status.state === "sending"} className="btn mt-6 w-full bg-accent text-white hover:opacity-90 disabled:opacity-60 sm:w-auto">
        {status.state === "sending" ? <Loader2 aria-hidden size={18} className="animate-spin" /> : <Send aria-hidden size={18} />}
        {status.state === "sending" ? "Envoi en cours…" : status.state === "error" ? "Réessayer" : "Soumettre"}
      </button>
      <div role="status" aria-live="polite" className="mt-4">
        {status.state === "error" && (
          <p data-quote-error className="flex items-start gap-2 rounded-card bg-surface p-4 font-medium text-ink">
            <CircleAlert aria-hidden size={20} className="mt-0.5 shrink-0 text-accent" />
            <span>
              L&apos;envoi n&apos;a pas abouti. Vos informations sont conservées : réessayez, ou appelez-nous au{" "}
              <a href={telHref} className="underline">{site.phone.display}</a>.
            </span>
          </p>
        )}
        {status.state === "nokey" && (
          <div data-quote-fallback className="rounded-card bg-surface p-4 text-ink">
            <p className="font-medium">L&apos;envoi en ligne n&apos;est pas encore activé. Envoyez-nous votre demande par e-mail ou appelez-nous :</p>
            <div className="mt-3 flex flex-wrap gap-3">
              <a href={status.mailto} className="btn border-2 border-brand text-brand-dark hover:bg-brand-light">
                <Mail aria-hidden size={18} /> Envoyer par e-mail
              </a>
              <a href={telHref} className="btn bg-accent text-white hover:opacity-90">
                <Phone aria-hidden size={18} /> {site.phone.display}
              </a>
            </div>
          </div>
        )}
      </div>
    </form>
  );
}
