import React, { useRef, useEffect, useState, useMemo } from 'react';
import {
  clearAndRedrawBuffer,
  generateRandomVertices,
  readyCanvas,
} from '../lib/canvas';
import { bruteForceConvexHull } from '../lib/algorithms/convexHull';

import { AlgorithmGenerator, DrawBuffer, Vertex } from '../types';
import colors from '../global/styles/colors';

import PageWrapper from './_common/PageWrapper';
import Canvas from './_common/Canvas';
import Controls from './_common/Controls';

function ConvexHull(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [amount, setAmount] = useState(5);

  const [vertices, setVertices] = useState<Vertex[]>([]);
  const [drawBuffer, setDrawBuffer] = useState<DrawBuffer>({
    vertices: [],
    edges: [],
    directedEdges: [],
  });

  // Returns a Generator function based on the path that will be called to generate a Iterator
  const algorithmRouter = useMemo<AlgorithmGenerator<{ vertices: Vertex[] }>>(
    () => bruteForceConvexHull,
    [canvasRef.current]
  ); // We need here also the page router

  const randomize = () => {
    const ctx = readyCanvas(canvasRef.current);
    if (!ctx) return;

    const localVertices = generateRandomVertices(amount);
    const localDrawBuffer = {
      vertices: [
        ...localVertices.map((v) => ({ value: v, color: colors.secondary })),
      ],
      edges: [],
      directedEdges: [],
    };
    clearAndRedrawBuffer(ctx, localDrawBuffer);
    setVertices(localVertices);
    setDrawBuffer(localDrawBuffer);
  };

  useEffect(() => {
    randomize();
  }, []);

  return (
    <PageWrapper>
      <Canvas canvasRef={canvasRef} />
      <Controls
        amount={amount}
        setAmount={setAmount}
        randomize={randomize}
        // eslint-disable-next-line react/jsx-no-bind
        genAlgorithm={algorithmRouter}
        canvasElement={canvasRef.current}
        drawBuffer={drawBuffer}
        data={{ vertices }}
      />
    </PageWrapper>
  );
}

// Because we pass a reference down
// export default ConvexHull;
export default React.forwardRef(ConvexHull);
