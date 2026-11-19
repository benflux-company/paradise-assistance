// Shown by Next.js whenever a route's data isn't ready yet — every page
// fetches from Postgres on each request (force-dynamic), so without this the
// browser shows nothing new until the fetch resolves. This covers cases the
// custom curtain transition in Chrome.tsx doesn't: back/forward navigation,
// a slow first load, or a direct link click that bypasses the click
// interceptor (new tab, middle-click).
export default function Loading() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--white)",
      }}
    >
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: "50%",
          border: "2px solid var(--line)",
          borderTopColor: "var(--navy)",
          animation: "pa-loading-spin 0.8s linear infinite",
        }}
      />
      <style>{`@keyframes pa-loading-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
