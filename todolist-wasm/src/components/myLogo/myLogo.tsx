'use client';
import React, { useEffect, useMemo } from 'react';
import type { MyLogoProps } from './';

const canvasBaseName = `${process.env.NAME}-canvas-logo`;

export default function MyLogo({
  width = 300,
  keycode,
  className: classNameProps,
  ...props
}: MyLogoProps) {
  useEffect(() => {
    const canvas = document.getElementById(
      `${canvasBaseName}-${keycode}`
    ) as HTMLCanvasElement | null;

    const ctx = canvas?.getContext('2d');
    if (ctx) {
      draw(ctx);
    }
  }, []);

  const draw = (ctx: CanvasRenderingContext2D) => {
    const baseLength = width / 8;
    const linearGradient = ctx.createLinearGradient(
      baseLength * 2,
      baseLength * 2,
      baseLength * 2,
      0
    );
    linearGradient.addColorStop(0, '#bb02e3');
    linearGradient.addColorStop(1, '#07f4fd');
    ctx.fillStyle = linearGradient;

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(baseLength * 3, baseLength * 4);
    ctx.lineTo(baseLength, 0);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(baseLength * 2, 0);
    ctx.lineTo(baseLength * 4, baseLength * 4);
    ctx.lineTo(baseLength * 6, 0);
    ctx.lineTo(baseLength * 4, baseLength * 2);
    ctx.lineTo(baseLength * 2, 0);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(baseLength * 7, 0);
    ctx.lineTo(baseLength * 5, baseLength * 4);
    ctx.lineTo(baseLength * 8, 0);
    ctx.lineTo(baseLength * 7, 0);
    ctx.fill();
  };

  return (
    <button
      className={`${classNameProps ?? ''} w-[${width}px] h-[${width / 2}px]`}
      {...props}
    >
      <canvas
        id={`${canvasBaseName}-${keycode}`}
        width={width}
        height={width / 2}
      />
    </button>
  );
}
