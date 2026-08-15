import type { SVGProps } from "react";

/**
 * Small dependency-free icon set (no external font/CDN), built from plain
 * SVG primitives so the app has zero third-party runtime requirements.
 */
type IconProps = SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function IconSun(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="4.5" />
      <line x1="12" y1="1.5" x2="12" y2="3.5" />
      <line x1="12" y1="20.5" x2="12" y2="22.5" />
      <line x1="4.2" y1="4.2" x2="5.6" y2="5.6" />
      <line x1="18.4" y1="18.4" x2="19.8" y2="19.8" />
      <line x1="1.5" y1="12" x2="3.5" y2="12" />
      <line x1="20.5" y1="12" x2="22.5" y2="12" />
      <line x1="4.2" y1="19.8" x2="5.6" y2="18.4" />
      <line x1="18.4" y1="5.6" x2="19.8" y2="4.2" />
    </svg>
  );
}

export function IconMoon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z" />
    </svg>
  );
}

export function IconSystem(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="4" width="18" height="12" rx="1.5" />
      <line x1="8" y1="20" x2="16" y2="20" />
      <line x1="12" y1="16" x2="12" y2="20" />
    </svg>
  );
}

export function IconMenu(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

export function IconClose(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <line x1="5" y1="5" x2="19" y2="19" />
      <line x1="19" y1="5" x2="5" y2="19" />
    </svg>
  );
}

export function IconSearch(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <line x1="20" y1="20" x2="15.3" y2="15.3" />
    </svg>
  );
}

export function IconBookmark({ filled, ...props }: IconProps & { filled?: boolean }) {
  return (
    <svg {...base} {...props} fill={filled ? "currentColor" : "none"}>
      <path d="M6 3.5h12a1 1 0 011 1V21l-7-3.8L5 21V4.5a1 1 0 011-1z" />
    </svg>
  );
}

export function IconPlay(props: IconProps) {
  return (
    <svg {...base} {...props} fill="currentColor">
      <polygon points="6 3.5 20 12 6 20.5" />
    </svg>
  );
}

export function IconPause(props: IconProps) {
  return (
    <svg {...base} {...props} fill="currentColor">
      <rect x="6" y="4" width="4" height="16" rx="1" />
      <rect x="14" y="4" width="4" height="16" rx="1" />
    </svg>
  );
}

export function IconChevronLeft(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <polyline points="15 4 7 12 15 20" />
    </svg>
  );
}

export function IconChevronRight(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <polyline points="9 4 17 12 9 20" />
    </svg>
  );
}

export function IconCopy(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="9" y="9" width="11" height="11" rx="1.5" />
      <path d="M5.5 15H4.5A1.5 1.5 0 013 13.5v-9A1.5 1.5 0 014.5 3h9A1.5 1.5 0 0115 4.5v1" />
    </svg>
  );
}

export function IconCheck(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <polyline points="20 6.5 9.5 17 4 11.5" />
    </svg>
  );
}

export function IconBook(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 5.5C4 4.7 4.7 4 5.5 4H12v16H5.5A1.5 1.5 0 014 18.5v-13z" />
      <path d="M20 5.5c0-.8-.7-1.5-1.5-1.5H12v16h6.5a1.5 1.5 0 001.5-1.5v-13z" />
    </svg>
  );
}

export function IconLayers(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <polygon points="12 3 21 8 12 13 3 8 12 3" />
      <polyline points="3 13 12 18 21 13" />
      <polyline points="3 18 12 23 21 18" />
    </svg>
  );
}

export function IconAlert(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3.5 21.5 20h-19L12 3.5z" />
      <line x1="12" y1="10" x2="12" y2="14.5" />
      <line x1="12" y1="17" x2="12" y2="17.01" />
    </svg>
  );
}

export function IconGithub(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 00-1.3-3.2 4.2 4.2 0 00-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 00-6.2 0C6.6 2.7 5.5 3 5.5 3a4.2 4.2 0 00-.1 3.2A4.6 4.6 0 004 9.5c0 4.6 2.7 5.7 5.5 6-.4.4-.4.9-.5 1.5V21" />
    </svg>
  );
}

export function IconLinkedin(props: IconProps) {
  return (
    <svg {...base} {...props} fill="currentColor" stroke="none">
      <rect x="3" y="9" width="4" height="12" />
      <circle cx="5" cy="4.5" r="2.2" />
      <path d="M10 9h4v2c.7-1.2 2-2.3 4-2.3 3.3 0 4 2 4 5.2V21h-4v-6c0-1.4 0-3.2-2-3.2s-2.3 1.6-2.3 3.1V21h-4V9z" />
    </svg>
  );
}
