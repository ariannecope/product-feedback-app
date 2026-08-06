export function PlusIcon(props) {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden="true" {...props}>
      <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function LightbulbIcon(props) {
  return (
    <svg viewBox="0 0 20 20" width="18" height="18" fill="none" aria-hidden="true" {...props}>
      <path
        d="M10 2a5.5 5.5 0 0 0-3 10.1V14a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-1.9A5.5 5.5 0 0 0 10 2Z"
        fill="currentColor"
      />
      <rect x="8" y="16.5" width="4" height="1.5" rx="0.75" fill="currentColor" />
    </svg>
  );
}

export function ChevronLeftIcon(props) {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden="true" {...props}>
      <path
        d="M10 3 5 8l5 5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ChevronDownIcon(props) {
  return (
    <svg viewBox="0 0 16 16" width="12" height="12" fill="none" aria-hidden="true" {...props}>
      <path
        d="M3 6l5 5 5-5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
