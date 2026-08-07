import "./EmptyState.css";

// Simple placeholder illustration — not a recreation of the Figma character
// art, swap in the real exported asset when available.
function PlaceholderIllustration() {
  return (
    <svg viewBox="0 0 100 100" width="100" height="100" aria-hidden="true">
      <circle cx="46" cy="46" r="28" fill="none" stroke="#c7cbe8" strokeWidth="4" />
      <line x1="66" y1="66" x2="86" y2="86" stroke="#c7cbe8" strokeWidth="5" strokeLinecap="round" />
      <circle cx="46" cy="46" r="16" fill="#eef0fb" />
    </svg>
  );
}

function EmptyState({ heading, subtitle, cta }) {
  return (
    <div className="empty-state">
      <PlaceholderIllustration />
      <h2 className="empty-state__heading">{heading}</h2>
      {subtitle && <p className="empty-state__subtitle">{subtitle}</p>}
      {cta && <div className="empty-state__cta">{cta}</div>}
    </div>
  );
}

export default EmptyState;
