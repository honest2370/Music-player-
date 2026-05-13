import { useState, useEffect, useCallback, useRef } from 'react';

export function useMotionControl(enabled = false) {
  const [motionData, setMotionData] = useState({ alpha: 0, beta: 0, gamma: 0 });
  const [gesture, setGesture] = useState(null);
  const lastGesture = useRef(Date.now());
  const previousBeta = useRef(0);
  const previousGamma = useRef(0);

  const requestPermission = useCallback(async () => {
    if (typeof DeviceMotionEvent !== 'undefined' &&
        typeof DeviceMotionEvent.requestPermission === 'function') {
      try {
        const perm = await DeviceMotionEvent.requestPermission();
        return perm === 'granted';
      } catch {
        return false;
      }
    }
    return true;
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const handleOrientation = (e) => {
      const { alpha, beta, gamma } = e;
      setMotionData({ alpha: alpha || 0, beta: beta || 0, gamma: gamma || 0 });

      const now = Date.now();
      if (now - lastGesture.current < 800) return;

      const betaDelta = (beta || 0) - previousBeta.current;
      const gammaDelta = (gamma || 0) - previousGamma.current;

      if (Math.abs(betaDelta) > 30) {
        setGesture(betaDelta > 0 ? 'tilt-forward' : 'tilt-back');
        lastGesture.current = now;
      } else if (Math.abs(gammaDelta) > 25) {
        setGesture(gammaDelta > 0 ? 'tilt-right' : 'tilt-left');
        lastGesture.current = now;
      }

      previousBeta.current = beta || 0;
      previousGamma.current = gamma || 0;
    };

    const handleMotion = (e) => {
      const acc = e.accelerationIncludingGravity;
      if (!acc) return;

      const now = Date.now();
      if (now - lastGesture.current < 800) return;

      const totalAcc = Math.sqrt(acc.x ** 2 + acc.y ** 2 + acc.z ** 2);
      if (totalAcc > 25) {
        setGesture('shake');
        lastGesture.current = now;
      }
    };

    window.addEventListener('deviceorientation', handleOrientation);
    window.addEventListener('devicemotion', handleMotion);

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
      window.removeEventListener('devicemotion', handleMotion);
    };
  }, [enabled]);

  useEffect(() => {
    if (gesture) {
      const timer = setTimeout(() => setGesture(null), 500);
      return () => clearTimeout(timer);
    }
  }, [gesture]);

  return { motionData, gesture, requestPermission };
}
