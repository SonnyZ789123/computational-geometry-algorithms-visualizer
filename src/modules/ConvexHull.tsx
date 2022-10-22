import React, { useRef, useEffect, useState } from 'react';
import {
  clearCanvas,
  drawDot,
  generateRandomVertices,
  readyCanvas,
  drawDirectedEdge,
  clearAndRedrawBuffer,
} from '../lib/canvas';
import { DrawBuffer, Vertex } from '../types';
import { relativeOrientation } from '../lib/algorithms/helpers';
import { delay } from '../lib/visualization';

import PageWrapper from './_common/PageWrapper';
import Canvas from './_common/Canvas';
import Controls from './_common/Controls';
import colors from '../global/styles/colors';

function ConvexHull(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [delayAmount, setDelayAmount] = useState(2000); // in ms
  const [amount, setAmount] = useState(5);

  const [vertices, setVertices] = useState<Vertex[]>([]);
  const [drawBuffer, setDrawBuffer] = useState<DrawBuffer>({
    vertices: [],
    edges: [],
    directedEdges: [],
  });

  const bruteForceConvexHull = async () => {
    const ctx = readyCanvas(canvasRef);
    if (!ctx) return;

    // local drawBuffer
    const localDrawBuffer: DrawBuffer = {
      vertices: [...drawBuffer.vertices],
      edges: [...drawBuffer.edges],
      directedEdges: [...drawBuffer.directedEdges],
    };

    for (let i = 0; i < vertices.length; i += 1) {
      for (let j = 0; j < vertices.length; j += 1) {
        if (j === i) {
          continue;
        }

        let valid = true;
        const e1 = { from: vertices[i], to: vertices[j] };
        drawDirectedEdge(ctx, e1, colors.white);
        localDrawBuffer.directedEdges.push({
          value: e1,
          color: colors.white,
        });
        await delay(delayAmount);

        for (let k = 0; k < vertices.length; k += 1) {
          if (k === i || k === j) {
            continue;
          }

          const e2 = { from: vertices[i], to: vertices[k] };

          // Testing if it lies on the left of the processed edge
          if (relativeOrientation(e1, e2) >= 0) {
            valid = false;
            drawDirectedEdge(ctx, e2, colors.red);
            // Do not add to drawBuffer
            await delay(delayAmount);
            break;
          } else {
            drawDirectedEdge(ctx, e2, colors.secondary);
            // Do not add to drawBuffer
            await delay(delayAmount);
          }
          clearAndRedrawBuffer(ctx, localDrawBuffer);
        }

        localDrawBuffer.directedEdges.pop();
        // If valid, keep drawing that edge in different color
        if (valid) {
          localDrawBuffer.directedEdges.push({
            value: e1,
            color: colors.yellow,
          });
        }

        // Pop the just processed edge from the drawBuffer so we don't draw it anymore
        clearAndRedrawBuffer(ctx, localDrawBuffer);
      }
    }

    setDrawBuffer(localDrawBuffer);
  };

  const randomize = () => {
    const ctx = readyCanvas(canvasRef);
    if (!ctx) return;

    clearCanvas(ctx);
    const temp = generateRandomVertices(amount);
    temp.forEach((v) => {
      drawDot(ctx, v, colors.secondary);
    });
    setVertices(temp); // Should we put in the drawBuffer?
    setDrawBuffer({
      ...drawBuffer,
      vertices: [...temp.map((v) => ({ value: v, color: colors.secondary }))],
    });
  };

  useEffect(() => {
    randomize();
  }, []);

  return (
    <PageWrapper>
      <Canvas canvasRef={canvasRef} />
      <Controls
        delay={delayAmount}
        setDelay={setDelayAmount}
        amount={amount}
        setAmount={setAmount}
        randomize={randomize}
        start={bruteForceConvexHull}
      />
    </PageWrapper>
  );
}

export default ConvexHull;
