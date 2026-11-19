export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <main id="p-article" className="pg on" data-t="Article">
      <section className="ph" style={{ paddingBottom: 40 }}>
        <div className="wrap">
          <div className="art">
            <p>Article : {slug} (contenu réel à l&apos;étape suivante)</p>
          </div>
        </div>
      </section>
    </main>
  );
}
