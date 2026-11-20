type IconProps = { width?: number; height?: number };

export function FacebookIcon({ width = 18, height = 18 }: IconProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M13.5 21v-7.5h2.5l.4-3H13.5V8.5c0-.9.25-1.5 1.56-1.5H16.5V4.3c-.27-.04-1.2-.11-2.28-.11-2.26 0-3.8 1.38-3.8 3.9V10.5H8v3h2.42V21h3.08Z" />
    </svg>
  );
}

export function InstagramIcon({ width = 18, height = 18 }: IconProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function TiktokIcon({ width = 18, height = 18 }: IconProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16.5 3c.4 2.1 1.8 3.5 4 3.7v2.9c-1.4 0-2.7-.4-3.9-1.2v6.5c0 3.3-2.3 5.6-5.4 5.6-3 0-5.4-2.3-5.4-5.4 0-3.2 2.7-5.6 5.9-5.3v3c-1.4-.3-2.7.6-2.7 2.1 0 1.3 1.1 2.3 2.4 2.3 1.5 0 2.6-1.1 2.6-2.8V3h2.5Z" />
    </svg>
  );
}

export function WhatsappIcon({ width = 18, height = 18 }: IconProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3Zm0 1.8a7.2 7.2 0 0 1 6.2 10.8l-.2.4.6 2.3-2.3-.6-.4.2A7.2 7.2 0 1 1 12 4.8Zm-3.3 3.3c-.2 0-.5.1-.6.4-.2.3-.8.8-.8 2s.9 2.3 1 2.4c.1.2 1.7 2.7 4.3 3.6 2.1.8 2.5.6 3 .6.4 0 1.4-.6 1.6-1.1.2-.5.2-1 .1-1.1-.1-.1-.2-.2-.5-.3-.3-.2-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1-.2.3-.6.8-.7.9-.1.2-.3.2-.5.1-.3-.1-1.1-.4-2.1-1.3-.8-.7-1.3-1.5-1.5-1.8-.1-.3 0-.4.1-.6l.4-.5c.1-.1.1-.3.1-.4-.1-.1-.5-1.3-.7-1.8-.2-.4-.4-.4-.5-.4h-.5Z" />
    </svg>
  );
}

export function LinkedinIcon({ width = 18, height = 18 }: IconProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6.9 8.7H3.7V20h3.2V8.7ZM5.3 3.5a1.9 1.9 0 1 0 0 3.8 1.9 1.9 0 0 0 0-3.8ZM20.3 20h-3.2v-5.9c0-1.4-.5-2.3-1.7-2.3-1 0-1.5.6-1.8 1.3-.1.2-.1.6-.1.9V20h-3.2s.04-9.5 0-10.5h3.2v1.5c.4-.7 1.2-1.6 2.9-1.6 2.1 0 3.9 1.4 3.9 4.4V20Z" />
    </svg>
  );
}
