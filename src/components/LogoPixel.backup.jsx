import { useId } from 'react';

/** Focal logomark: a solid square turned 38°, with a pixel-checker lens and a small flash at the top right. */
export default function LogoMark({ size = 34, color = '#0b0f1a', lens = '#ffffff' }) {
  const id = useId().replace(/:/g, '');
  return (
    <svg className="logo-mark-svg" width={size} height={size} viewBox="0 0 40 40" aria-hidden="true" focusable="false">
      <defs>
        <pattern id={id} width="4.4" height="4.4" patternUnits="userSpaceOnUse">
          <rect width="4.4" height="4.4" fill={lens} />
          <rect width="2.2" height="2.2" fill={color} />
          <rect x="2.2" y="2.2" width="2.2" height="2.2" fill={color} />
        </pattern>
      </defs>
      <g transform="rotate(38 20 20)">
        <rect x="7" y="7" width="26" height="26" fill={color} />
        <circle cx="20" cy="20" r="7.6" fill={`url(#${id})`} stroke={lens} strokeWidth="1.6" />
        <rect x="26.6" y="9.4" width="4" height="4" fill={lens} />
      </g>
    </svg>
  );
}
