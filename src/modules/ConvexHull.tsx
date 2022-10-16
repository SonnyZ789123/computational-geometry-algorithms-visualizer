import React, { useRef, useEffect } from 'react';
import { drawDot, drawEdge, clearCanvas } from '../lib/canvas';

import PageWrapper from './_common/PageWrapper';
import Canvas from './_common/Canvas';
import Controls from './_common/Controls';

function ConvexHull(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        drawDot(ctx, { x: 250, y: 250 });
        drawEdge(ctx, { x: 250, y: 250 }, { x: 300, y: 300 });
        clearCanvas(ctx);
      }
    }
  }, []);

  return (
    <PageWrapper>
      <Canvas canvasRef={canvasRef} />
      <Controls />
    </PageWrapper>
  );
}

export default ConvexHull;
