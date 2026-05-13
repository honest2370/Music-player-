import React, { useRef, useEffect, useCallback } from 'react';
import { usePlayer } from '../context/PlayerContext';

export default function Visualizer({ type = 'wave', width = 350, height = 200, style = {} }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const { analyserRef, state } = usePlayer();

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas || !analyser) {
      animRef.current = requestAnimationFrame(draw);
      return;
    }

    const ctx = canvas.getContext('2d');
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const render = () => {
      animRef.current = requestAnimationFrame(render);
      
      if (type === 'wave' || type === 'fluid') {
        analyser.getByteTimeDomainData(dataArray);
      } else {
        analyser.getByteFrequencyData(dataArray);
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      switch (type) {
        case 'wave':
          drawWave(ctx, dataArray, bufferLength, canvas);
          break;
        case 'bars':
          drawBars(ctx, dataArray, bufferLength, canvas);
          break;
        case 'fluid':
          drawFluid(ctx, dataArray, bufferLength, canvas);
          break;
        case 'circular':
          drawCircular(ctx, dataArray, bufferLength, canvas);
          break;
        case 'particles':
          drawParticles(ctx, dataArray, bufferLength, canvas);
          break;
        default:
          drawWave(ctx, dataArray, bufferLength, canvas);
      }
    };

    render();
  }, [type, analyserRef]);

  useEffect(() => {
    draw();
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      width={width * 2}
      height={height * 2}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        borderRadius: '12px',
        ...style
      }}
    />
  );
}

function drawWave(ctx, data, len, canvas) {
  const w = canvas.width;
  const h = canvas.height;

  const gradient = ctx.createLinearGradient(0, 0, w, 0);
  gradient.addColorStop(0, '#00f0ff');
  gradient.addColorStop(0.5, '#7b2ff7');
  gradient.addColorStop(1, '#ff006e');

  ctx.lineWidth = 3;
  ctx.strokeStyle = gradient;
  ctx.shadowColor = '#00f0ff';
  ctx.shadowBlur = 15;
  ctx.beginPath();

  const sliceWidth = w / len;
  let x = 0;

  for (let i = 0; i < len; i++) {
    const v = data[i] / 128.0;
    const y = (v * h) / 2;

    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
    x += sliceWidth;
  }

  ctx.lineTo(w, h / 2);
  ctx.stroke();

  ctx.shadowBlur = 30;
  ctx.globalAlpha = 0.3;
  ctx.stroke();
  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;
}

function drawBars(ctx, data, len, canvas) {
  const w = canvas.width;
  const h = canvas.height;
  const barCount = 64;
  const barWidth = (w / barCount) - 2;

  for (let i = 0; i < barCount; i++) {
    const dataIndex = Math.floor(i * len / barCount);
    const barHeight = (data[dataIndex] / 255) * h;
    const x = i * (barWidth + 2);

    const hue = (i / barCount) * 180 + 180;
    const gradient = ctx.createLinearGradient(x, h, x, h - barHeight);
    gradient.addColorStop(0, `hsla(${hue}, 100%, 60%, 0.8)`);
    gradient.addColorStop(1, `hsla(${hue}, 100%, 80%, 0.4)`);

    ctx.fillStyle = gradient;
    ctx.shadowColor = `hsl(${hue}, 100%, 60%)`;
    ctx.shadowBlur = 10;
    
    ctx.beginPath();
    ctx.roundRect(x, h - barHeight, barWidth, barHeight, [4, 4, 0, 0]);
    ctx.fill();
  }
  ctx.shadowBlur = 0;
}

function drawFluid(ctx, data, len, canvas) {
  const w = canvas.width;
  const h = canvas.height;
  const time = Date.now() * 0.001;

  for (let layer = 0; layer < 3; layer++) {
    const gradient = ctx.createLinearGradient(0, 0, w, h);
    const colors = [
      ['rgba(0,240,255,0.3)', 'rgba(123,47,247,0.1)'],
      ['rgba(123,47,247,0.25)', 'rgba(255,0,110,0.1)'],
      ['rgba(255,0,110,0.2)', 'rgba(0,240,255,0.05)']
    ];
    gradient.addColorStop(0, colors[layer][0]);
    gradient.addColorStop(1, colors[layer][1]);

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(0, h);

    for (let x = 0; x <= w; x += 5) {
      const dataIndex = Math.floor((x / w) * len);
      const amplitude = (data[dataIndex] / 255) * (h * 0.4);
      const y = h / 2 + Math.sin(x * 0.01 + time * (layer + 1) * 0.5) * amplitude * 0.5
        + Math.sin(x * 0.02 + time * 0.3) * 20 * (layer + 1);
      ctx.lineTo(x, y);
    }

    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fill();
  }
}

function drawCircular(ctx, data, len, canvas) {
  const w = canvas.width;
  const h = canvas.height;
  const cx = w / 2;
  const cy = h / 2;
  const radius = Math.min(w, h) * 0.25;
  const barCount = 128;

  for (let i = 0; i < barCount; i++) {
    const angle = (i / barCount) * Math.PI * 2 - Math.PI / 2;
    const dataIndex = Math.floor(i * len / barCount);
    const barHeight = (data[dataIndex] / 255) * radius;

    const x1 = cx + Math.cos(angle) * radius;
    const y1 = cy + Math.sin(angle) * radius;
    const x2 = cx + Math.cos(angle) * (radius + barHeight);
    const y2 = cy + Math.sin(angle) * (radius + barHeight);

    const hue = (i / barCount) * 360;
    ctx.strokeStyle = `hsl(${hue}, 100%, 60%)`;
    ctx.lineWidth = 2;
    ctx.shadowColor = `hsl(${hue}, 100%, 60%)`;
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
  ctx.shadowBlur = 0;
}

function drawParticles(ctx, data, len, canvas) {
  const w = canvas.width;
  const h = canvas.height;
  const time = Date.now() * 0.002;
  const particleCount = 100;

  for (let i = 0; i < particleCount; i++) {
    const dataIndex = Math.floor(i * len / particleCount);
    const amplitude = data[dataIndex] / 255;
    
    const x = (Math.sin(i * 0.5 + time) * 0.5 + 0.5) * w;
    const y = (Math.cos(i * 0.3 + time * 0.7) * 0.5 + 0.5) * h;
    const size = amplitude * 8 + 1;

    const hue = (i / particleCount) * 180 + 180;
    ctx.fillStyle = `hsla(${hue}, 100%, 70%, ${amplitude * 0.8})`;
    ctx.shadowColor = `hsl(${hue}, 100%, 60%)`;
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.shadowBlur = 0;
}
