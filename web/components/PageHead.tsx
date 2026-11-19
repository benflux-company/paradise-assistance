export default function PageHead({
  current,
  titleLines,
  description,
}: {
  current: string;
  titleLines: [React.ReactNode, React.ReactNode];
  description: string;
}) {
  return (
    <section className="ph">
      <div className="wrap">
        <div className="bc lab" data-hi>
          <span>Accueil</span>
          <i></i>
          <span className="navy">{current}</span>
        </div>
        <div className="row">
          <h1 className="sf" data-split>
            <span className="ln">
              <span>{titleLines[0]}</span>
            </span>
            <span className="ln">
              <span>
                <em>{titleLines[1]}</em>
              </span>
            </span>
          </h1>
          <p data-hi>{description}</p>
        </div>
      </div>
    </section>
  );
}
