import { useEffect, useRef } from 'react';

interface SplineBookProps {
  className?: string;
}

const RENDER_SIZE = 1080;

/**
 * Interactive 3D Spline model.
 * Internally renders at 1080×1080 for crisp quality,
 * then CSS-scaled down to fit whatever size the parent provides (e.g. 450px).
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

  // Dynamically scale the 1080px canvas to fit the container
  useEffect(() => {
    const container = containerRef.current;
    const scaler = scalerRef.current;
    if (!container || !scaler) return;

    const updateScale = () => {
      const containerWidth = container.offsetWidth;
      const scale = containerWidth / RENDER_SIZE;
      scaler.style.transform = `scale(${scale})`;
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(container);
    return () => observer.disconnect();
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
        }
        .spline-book-scaler {
          width: ${RENDER_SIZE}px;
          height: ${RENDER_SIZE}px;
          transform-origin: top left;
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
