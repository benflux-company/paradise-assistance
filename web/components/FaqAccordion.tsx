import type { FaqView } from "@/lib/queries";

export default function FaqAccordion({ faqs }: { faqs: FaqView[] }) {
  return (
    <div className="acc">
      {faqs.map((f) => (
        <details key={f.question}>
          <summary className="sf">
            {f.question} <span className="pl" aria-hidden="true"></span>
          </summary>
          <div className="ans">{f.answer}</div>
        </details>
      ))}
    </div>
  );
}
