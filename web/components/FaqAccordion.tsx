import { FAQS } from "@/lib/data";

export default function FaqAccordion() {
  return (
    <div className="acc">
      {FAQS.map((f) => (
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
