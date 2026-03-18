import {type ReactNode, useEffect, useRef, useState, useCallback} from 'react';
import {useColorMode} from '@docusaurus/theme-common';
import Heading from '@theme/Heading';

const PHONE_DISPLAY = '(307) 274-4983';
const PHONE_TEL = 'tel:3072744983';

/* ── Canvas phone renderer ──────────────────────────────────────────────── */

function PhoneCanvas({onClick}: {onClick: () => void}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const {colorMode} = useColorMode();

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const text = PHONE_DISPLAY;
    const fontSize = 14;
    const fontStr = `600 ${fontSize}px system-ui, -apple-system, sans-serif`;

    ctx.font = fontStr;
    const textWidth = ctx.measureText(text).width;
    const px = 4;
    const py = 4;
    const w = textWidth + px * 2;
    const h = fontSize + py * 2;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.scale(dpr, dpr);

    ctx.font = fontStr;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.fillStyle = colorMode === 'dark' ? '#25c2a0' : '#2e8555';
    ctx.fillText(text, w / 2, h / 2);
  }, [colorMode]);

  useEffect(() => {
    draw();
    window.addEventListener('resize', draw);
    return () => window.removeEventListener('resize', draw);
  }, [draw]);

  return (
    <button
      type="button"
      className="navbar-phone-btn"
      onClick={onClick}
      aria-label={`Call Sales at ${PHONE_DISPLAY}`}>
      {/* Screen-reader / crawler text — visually hidden */}
      <span className="navbar-phone-sr">{PHONE_DISPLAY}</span>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="navbar-phone-icon"
        aria-hidden="true">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.62 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.4a16 16 0 0 0 6.29 6.29l.98-.98a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
      <canvas ref={canvasRef} className="navbar-phone-canvas" aria-hidden="true" />
    </button>
  );
}

/* ── Phone modal ────────────────────────────────────────────────────────── */

function PhoneModal({open, onClose}: {open: boolean; onClose: () => void}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(PHONE_DISPLAY);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = PHONE_DISPLAY;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  const handleBackdrop = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="phone-modal-backdrop" onClick={handleBackdrop}>
      <div className="phone-modal" role="dialog" aria-modal="true" aria-label="Call Sales">
        <button
          type="button"
          className="phone-modal-close"
          onClick={onClose}
          aria-label="Close">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="phone-modal-icon-wrap">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="phone-modal-icon">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.62 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.4a16 16 0 0 0 6.29 6.29l.98-.98a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
        </div>

        <Heading as="h3" className="phone-modal-title">
          Call Sales
        </Heading>
        <p className="phone-modal-desc">
          Tap the button below to dial us directly, or copy the number.
        </p>

        <a
          href={PHONE_TEL}
          className="phone-modal-call-btn"
          aria-label={`Call ${PHONE_DISPLAY}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.62 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.4a16 16 0 0 0 6.29 6.29l.98-.98a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          Call Now
        </a>

        <div className="phone-modal-number-row">
          <code className="phone-modal-number">{PHONE_DISPLAY}</code>
          <button
            type="button"
            className={`phone-modal-copy-btn${copied ? ' phone-modal-copy-btn-done' : ''}`}
            onClick={handleCopy}>
            {copied ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                <rect x="9" y="9" width="13" height="13" rx="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            )}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Navbar item export ──────────────────────────────────────────────────── */

export default function PhoneNavbarItem(): ReactNode {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <>
      <PhoneCanvas onClick={() => setModalOpen(true)} />
      <PhoneModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
