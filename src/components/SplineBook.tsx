import { useEffect, useRef } from 'react';

interface SplineBookProps {
  className?: string;
}

const RENDER_SIZE = 1080;

/**
 * Interactive 3D Spline model.
 *
 * `<spline-viewer>` renders its internal WebGL canvas at a fixed 1080×1080 and
 * will NOT shrink that canvas down to a smaller host (a width:100% host just
 * overflows and clips). So we give the viewer a real 1080×1080 box (`.spline-book-scaler`)
 * and CSS-scale that box to fit the responsive wrapper.
 *
 * IMPORTANT — why the scale is applied in CSS, not JS:
 * The viewer's canvas only looks right when the scaler is actually scaled down.
 * If the scale is ever missing (e.g. a JS timing race on a slower device), the
 * 1080 box overflows the wrapper, gets clipped to its top-left corner, and the
 * model appears tiny / blank. Doing it in CSS via container-query units makes it
 * correct from first paint on every device, with no dependency on JS timing.
 * The ResizeObserver below is kept only as a fallback for older browsers.
 */
export default function SplineBook({ className = '' }: SplineBookProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scalerRef = useRef<HTMLDivElement>(null);
  const scriptLoaded = useRef(false);

  // Load the Spline viewer script once
  useEffect(() => {
    if (scriptLoaded.current) return;
    if (document.querySelector('script[data-spline-viewer]')) {
      scriptLoaded.current = true;
      return;
    }
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://unpkg.com/@splinetool/viewer@1.12.95/build/spline-viewer.js';
    script.setAttribute('data-spline-viewer', 'true');
    document.head.appendChild(script);
    scriptLoaded.current = true;
  }, []);

  // Fallback scale via JS (covers browsers without cqw/calc-in-transform).
  // CSS already handles the scale, so this just mirrors the same value inline.
  useEffect(() => {
    const container = containerRef.current;
    const scaler = scalerRef.current;
    if (!container || !scaler) return;

    const updateScale = () => {
      const w = container.offsetWidth;
      if (w > 0) scaler.style.transform = `scale(${w / RENDER_SIZE})`;
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(container);
    window.addEventListener('load', updateScale);
    return () => {
      observer.disconnect();
      window.removeEventListener('load', updateScale);
    };
  }, []);

  // Hide Spline watermark / logo
  useEffect(() => {
    const interval = setInterval(() => {
      const viewer = containerRef.current?.querySelector('spline-viewer');
      if (!viewer?.shadowRoot) return;
      const sr = viewer.shadowRoot;

      // Target all known Spline watermark selectors
      const selectors = [
        '#logo',
        'a[href*="spline.design"]',
        'a[href*="spline"]',
        '[class*="logo"]',
        '[id*="logo"]',
        'div[style*="position: absolute"][style*="bottom"]',
      ];

      let found = false;
      selectors.forEach(sel => {
        sr.querySelectorAll(sel).forEach((el: Element) => {
          (el as HTMLElement).style.display = 'none';
          (el as HTMLElement).style.visibility = 'hidden';
          (el as HTMLElement).style.opacity = '0';
          (el as HTMLElement).style.pointerEvents = 'none';
          found = true;
        });
      });

      // Also inject a style tag to hide any watermark that loads later
      if (!sr.querySelector('#hide-spline-logo')) {
        const style = document.createElement('style');
        style.id = 'hide-spline-logo';
        style.textContent = `
          #logo, a[href*="spline"], [class*="logo"], [id*="logo"] {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            pointer-events: none !important;
            width: 0 !important;
            height: 0 !important;
            overflow: hidden !important;
          }
        `;
        sr.appendChild(style);
        found = true;
      }

      if (found) clearInterval(interval);
    }, 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div ref={containerRef} className={`spline-book-wrapper ${className}`}>
      <div ref={scalerRef} className="spline-book-scaler">
        {/* @ts-expect-error — spline-viewer is a custom web component */}
        <spline-viewer
          url="https://prod.spline.design/TmvmcQNGJejh1hip/scene.splinecode?v=1717020944"
          loading-anim-type="spinner-small-light"
        />
      </div>
      <style>{`
        .spline-book-wrapper {
          position: relative;
          width: 100%;
          aspect-ratio: 1 / 1;
          overflow: hidden;
          border-radius: 0.75rem;
          container-type: inline-size;
        }
        .spline-book-scaler {
          width: ${RENDER_SIZE}px;
          height: ${RENDER_SIZE}px;
          transform-origin: top left;
          /* 100cqw = the wrapper's width (container query unit), so this is
             wrapperWidth / 1080 — the exact fit scale, in pure CSS. */
          transform: scale(calc(100cqw / ${RENDER_SIZE}px));
        }
        .spline-book-scaler spline-viewer {
          width: ${RENDER_SIZE}px;
          height: ${RENDER_SIZE}px;
          display: block;
        }
      `}</style>
    </div>
  );
}
