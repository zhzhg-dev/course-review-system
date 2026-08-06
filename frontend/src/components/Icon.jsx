// Shared SVG icon component
// Each icon is selected by name and reused across buttons, forms, cards, and navigation
function Icon({ name }) {
  const paths = {
    book: (
      <>
        <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v18H6.5A2.5 2.5 0 0 0 4 23V5.5Z" />
        <path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H13v18h4.5A2.5 2.5 0 0 1 20 23V5.5Z" />
      </>
    ),
    chat: <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z" />,
    courses: (
      <>
        <path d="M5 4h12a2 2 0 0 1 2 2v14H7a2 2 0 0 1-2-2V4Z" />
        <path d="M7 18h12" />
        <path d="M8 7h7" />
      </>
    ),
    map: (
      <>
        <path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Z" />
        <path d="M9 3v15" />
        <path d="M15 6v15" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </>
    ),
    settings: (
      <>
        <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
        <path d="M19.4 15a1.8 1.8 0 0 0 .36 1.98l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.8 1.8 0 0 0-1.98-.36 1.8 1.8 0 0 0-1.1 1.66V21a2 2 0 1 1-4 0v-.09A1.8 1.8 0 0 0 8.75 19.25a1.8 1.8 0 0 0-1.98.36l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.8 1.8 0 0 0 4.3 15a1.8 1.8 0 0 0-1.66-1.1H2.5a2 2 0 1 1 0-4h.14A1.8 1.8 0 0 0 4.3 8.75a1.8 1.8 0 0 0-.36-1.98l-.06-.06A2 2 0 1 1 6.7 3.88l.06.06a1.8 1.8 0 0 0 1.98.36A1.8 1.8 0 0 0 9.85 2.64V2.5a2 2 0 1 1 4 0v.14a1.8 1.8 0 0 0 1.1 1.66 1.8 1.8 0 0 0 1.98-.36l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.8 1.8 0 0 0-.36 1.98 1.8 1.8 0 0 0 1.66 1.1h.14a2 2 0 1 1 0 4h-.14A1.8 1.8 0 0 0 19.4 15Z" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </>
    ),
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </>
    ),
    lock: (
      <>
        <rect x="5" y="10" width="14" height="10" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      </>
    ),
    eye: (
      <>
        <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
    arrowLeft: (
      <>
        <path d="M15 6 9 12l6 6" />
        <path d="M10 12h10" />
      </>
    ),
    plus: (
      <>
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </>
    ),
    star: <path d="m12 2 3.1 6.3 6.9 1-5 4.8 1.2 6.8-6.2-3.3-6.2 3.3L7 14.1 2 9.3l6.9-1L12 2Z" />,
    location: (
      <>
        <path d="M12 21s7-5.2 7-12a7 7 0 1 0-14 0c0 6.8 7 12 7 12Z" />
        <circle cx="12" cy="9" r="2.5" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    thumbs: (
      <>
        <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
        <path d="M7 11 11 2a3 3 0 0 1 3 3v4h5a2 2 0 0 1 2 2l-1 8a3 3 0 0 1-3 3H7V11Z" />
      </>
    ),
    reply: (
      <>
        <path d="M9 17 4 12l5-5" />
        <path d="M4 12h11a5 5 0 0 1 5 5v1" />
      </>
    ),
    camera: (
      <>
        <path d="M4 8h4l2-3h4l2 3h4v11H4V8Z" />
        <circle cx="12" cy="13.5" r="3" />
      </>
    )
  };

  return (
    <span className="icon" aria-hidden="true">
      <svg viewBox="0 0 24 24">{paths[name]}</svg>
    </span>
  );
}
export default Icon
