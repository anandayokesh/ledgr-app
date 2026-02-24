export const Dirham = ({ className = "", style = {} }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="1em"
        height="1em"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        style={{ display: 'inline-block', verticalAlign: 'baseline', ...style }}
    >
        <path d="M8 3v18h5a9 9 0 0 0 0-18H8z" />
        <line x1="3" y1="9.5" x2="14" y2="9.5" />
        <line x1="3" y1="14.5" x2="14" y2="14.5" />
    </svg>
)
