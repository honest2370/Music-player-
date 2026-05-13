import { useRef, useCallback, useEffect } from 'react';

export function useGestures(elementRef, handlers = {}) {
  const touchStart = useRef({ x: 0, y: 0, time: 0 });
  const touchEnd = useRef({ x: 0, y: 0 });
  const isTracking = useRef(false);

  const handleTouchStart = useCallback((e) => {
    const touch = e.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY, time: Date.now() };
    touchEnd.current = { x: touch.clientX, y: touch.clientY };
    isTracking.current = true;
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (!isTracking.current) return;
    const touch = e.touches[0];
    touchEnd.current = { x: touch.clientX, y: touch.clientY };

    const dx = touchEnd.current.x - touchStart.current.x;
    const dy = touchEnd.current.y - touchStart.current.y;

    if (handlers.onSwipeMove) {
      handlers.onSwipeMove({ dx, dy, x: touch.clientX, y: touch.clientY });
    }
  }, [handlers]);

  const handleTouchEnd = useCallback(() => {
    if (!isTracking.current) return;
    isTracking.current = false;

    const dx = touchEnd.current.x - touchStart.current.x;
    const dy = touchEnd.current.y - touchStart.current.y;
    const dt = Date.now() - touchStart.current.time;
    const vx = Math.abs(dx / dt);
    const vy = Math.abs(dy / dt);

    const minSwipe = 50;
    const minVelocity = 0.3;

    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > minSwipe) {
      if (dx > 0 && (vx > minVelocity || Math.abs(dx) > 100)) {
        handlers.onSwipeRight?.({ dx, dy, velocity: vx });
      } else if (dx < 0 && (vx > minVelocity || Math.abs(dx) > 100)) {
        handlers.onSwipeLeft?.({ dx, dy, velocity: vx });
      }
    } else if (Math.abs(dy) > minSwipe) {
      if (dy > 0 && (vy > minVelocity || Math.abs(dy) > 100)) {
        handlers.onSwipeDown?.({ dx, dy, velocity: vy });
      } else if (dy < 0 && (vy > minVelocity || Math.abs(dy) > 100)) {
        handlers.onSwipeUp?.({ dx, dy, velocity: vy });
      }
    }

    if (Math.abs(dx) < 10 && Math.abs(dy) < 10 && dt < 300) {
      handlers.onTap?.();
    }

    if (Math.abs(dx) < 10 && Math.abs(dy) < 10 && dt > 500) {
      handlers.onLongPress?.();
    }
  }, [handlers]);

  useEffect(() => {
    const el = elementRef?.current || document;
    
    el.addEventListener('touchstart', handleTouchStart, { passive: true });
    el.addEventListener('touchmove', handleTouchMove, { passive: true });
    el.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchmove', handleTouchMove);
      el.removeEventListener('touchend', handleTouchEnd);
    };
  }, [elementRef, handleTouchStart, handleTouchMove, handleTouchEnd]);
}
