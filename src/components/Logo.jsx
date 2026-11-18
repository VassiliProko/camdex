/** Focal logomark (lens version). The source image has a white background, so it is blended with multiply and
 *  scaled up slightly to trim its margin. `size` is a pixel number or any CSS length (for example "1.2em").
 *  The earlier pixel-lens mark is kept in LogoPixel.backup.jsx. */
export default function LogoMark({ size = 34 }) {
  const s = typeof size === 'number' ? `${size}px` : size;
  return (
    <span className="logo-mark-img" style={{ width: s, height: s }} aria-hidden="true">
      <img src={`${import.meta.env.BASE_URL}logomark-lens.webp`} alt="" style={{ width: '110%', height: '110%', left: '-5%', top: '-5%' }} />
    </span>
  );
}

/** Full camdex logo (pill wordmark with the viewfinder bump). The source image is on white, so it is blended with
 *  multiply and its empty margin is cropped by the wrapper. Height is set with the --lh CSS variable. */
export function LogoFull({ className = '' }) {
  return (
    <span className={`logo-full ${className}`} role="img" aria-label="camdex">
      <img src={`${import.meta.env.BASE_URL}logo-camdex.webp`} alt="" />
    </span>
  );
}
