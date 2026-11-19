import { SERVICES, pad } from "@/lib/data";

export default function ServicesList() {
  return (
    <section style={{ padding: "40px 0 80px" }}>
      <div className="wrap" id="svlist">
        {SERVICES.map((s, k) => (
          <article className={`sv${k % 2 ? " rv" : ""}`} key={s.title}>
            <div className="tx">
              <div className="k" data-up>
                {pad(k + 1)} &mdash; {s.subtitle}
              </div>
              <h2 className="sf" data-up>
                {s.title}
              </h2>
              <p data-up>{s.longDesc}</p>
              <ul data-up>
                {s.items.map((item) => (
                  <li key={item}>
                    {item}
                    <i></i>
                  </li>
                ))}
              </ul>
            </div>
            <div className="im par">
              <img src={`/img/${s.image}.jpg`} alt="" loading="lazy" />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
