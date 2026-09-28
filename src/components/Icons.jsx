export function Mark({ small = false }) {
  return (
    <svg
      className={`infinity-mark${small ? " small" : ""}`}
      viewBox="0 0 64 38"
      aria-hidden="true"
    >
      <path d="M3 19C8 7 18 7 26 19s18 12 23 0c5-12 14-12 18 0" />
      <path d="M3 19c5 12 15 12 23 0S44 7 49 19c5 12 14 12 18 0" />
    </svg>
  );
}

export function Icon({ type }) {
  const i = {
    arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
    close: <><path d="m6 6 12 12M18 6 6 18" /></>,
  };
  return (
    <svg
      className="ui-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {i[type]}
    </svg>
  );
}
