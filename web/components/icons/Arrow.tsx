export default function Arrow({ width = 16, height = 16 }: { width?: number; height?: number }) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  );
}
