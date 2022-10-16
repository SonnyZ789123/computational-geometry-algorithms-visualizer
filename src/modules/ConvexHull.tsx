import React, { useRef, useEffect, useState } from 'react';
import {
  clearCanvas,
  drawDot,
  generateRandomVertices,
  readyCanvas,
} from '../lib/canvas';

import PageWrapper from './_common/PageWrapper';
import Canvas from './_common/Canvas';
import Controls from './_common/Controls';
import { Vertex } from '../types';

function ConvexHull(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [speed, setSpeed] = useState(1);
  const [amount, setAmount] = useState(10);

  const [vertices, setVertices] = useState<Vertex[]>([]);

  const randomize = () => {
    const ctx = readyCanvas(canvasRef);
    if (ctx) {
      clearCanvas(ctx);
      setVertices(generateRandomVertices(amount));
      vertices.forEach((v) => {
        drawDot(ctx, v);
      });
    }
  };

  useEffect(() => {
    const ctx = readyCanvas(canvasRef);
    if (ctx) {
      setVertices(generateRandomVertices(amount));
      vertices.forEach((v) => {
        drawDot(ctx, v);
      });
    }
  }, []);

  return (
    <PageWrapper>
      <Canvas canvasRef={canvasRef} />
      <Controls
        speed={speed}
        setSpeed={setSpeed}
        amount={amount}
        setAmount={setAmount}
        randomize={randomize}
      />
    </PageWrapper>
  );
}

export default ConvexHull;
