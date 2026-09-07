import React, { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [cursorText, setCursorText] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        setIsTouchDevice(true);
        return;
      }
    }

    let animationFrameId: number;
    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;

    const onMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest('[data-cursor]');
      if (interactive) {
        const text = interactive.getAttribute('data-cursor');
        setCursorText(text || '');
        setIsHovered(true);
      } else {
        const button = target.closest('a, button, input, select, textarea');
        if (button) {
          setCursorText('');
          setIsHovered(true);
        } else {
          setIsHovered(false);
          setCursorText('');
        }
      }
    };

    // Smooth lerp movement loop for custom cursor
    const render = () => {
      currentX += (targetX - currentX) * 0.18;
      currentY += (targetY - currentY) * 0.18;
      setPosition({ x: currentX, y: currentY });
      animationFrameId = requestAnimationFrame(render);
    };

    window.addEventListener('mousemove', onMouseMove);
    render();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  if (isTouchDevice) return null;

  return (
    <div
      className="fixed pointer-events-none z-[9999] top-0 left-0"
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
      }}
    >
      <div
        className={`-translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center transition-all duration-300 ${
          isHovered
            ? cursorText
              ? 'px-4 py-2 bg-slate-900/90 text-[#00e676] text-xs font-bold tracking-wider uppercase backdrop-blur-md shadow-[0_0_20px_rgba(0,230,118,0.5)] border border-[#00e676]/40'
              : 'w-10 h-10 bg-[#00e676]/20 border-2 border-[#00e676] shadow-[0_0_20px_rgba(0,230,118,0.6)] scale-110'
            : 'w-4 h-4 bg-[#00e676] shadow-[0_0_12px_rgba(0,230,118,0.9)]'
        }`}
      >
        {cursorText && (
          <span className="whitespace-nowrap flex items-center gap-1">
            {cursorText}
          </span>
        )}
      </div>
    </div>
  );
}
