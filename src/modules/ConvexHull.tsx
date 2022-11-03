import React, { useRef, useState, useMemo, useCallback } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import {
  clearAndRedrawBuffer,
  generateRandomVertices,
  readyCanvas,
} from '../lib/canvas';
import {
  andrewConvexHull,
  bruteForceConvexHull,
  grahamConvexHull,
  jarvisConvexHull,
} from '../lib/algorithms/convexHull';

import { AlgorithmGenerator, DrawBuffer, Vertex } from '../types';
import colors from '../global/styles/colors';
import { convexHull as convexHullIds } from '../global/routes/paths';

import PageWrapper from './_common/PageWrapper';
import Canvas from './_common/Canvas';
import Controls from './_common/Controls';

const useAlgorithmRouter = () => {
  const { id } = useParams(); // The choice of algorithm

  const algorithmRouter = useMemo<{
    title: string;
    algorithm: AlgorithmGenerator;
  }>(() => {
    const { BRUTE_FORCE, ANDREW, GRAHAM, JARVIS } = convexHullIds;
    switch (id) {
      case BRUTE_FORCE:
        return {
          title: 'Brute Force Convex Hull',
          algorithm: bruteForceConvexHull,
        };
      case ANDREW:
        return { title: "Andrew's Algorithm", algorithm: andrewConvexHull };
      case GRAHAM:
        return { title: "Graham's Scan", algorithm: grahamConvexHull };
      case JARVIS:
        return { title: "Jarvis' March", algorithm: jarvisConvexHull };
      default:
        return undefined as unknown as {
          title: string;
          algorithm: AlgorithmGenerator;
        }; // Dummy return type
    }
  }, [id]);

  return algorithmRouter;
};

function ConvexHull(): JSX.Element {
  /// /// Basic initialization
  // Reference to the HTML canvas element on which we draw
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Draw buffer which saves the drawn elements
  const [drawBuffer, setDrawBuffer] = useState<DrawBuffer>({
    vertices: [],
    edges: [],
    directedEdges: [],
  });

  // Router which inspects the id in the url path and selects the corresponding algorithm
  const algorithmRouter = useAlgorithmRouter();
  /// ///

  const [vertices, setVertices] = useState<Vertex[]>([]);

  const randomize = useCallback((amount: number) => {
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
  }, []);

  return !algorithmRouter.algorithm ? (
    <Navigate to='/not-found' />
  ) : (
    <PageWrapper>
      <Canvas canvasRef={canvasRef} />
      <Controls
        algorithmTitle={algorithmRouter.title}
        randomize={randomize}
        genAlgorithm={algorithmRouter.algorithm}
        canvasElement={canvasRef.current}
        drawBuffer={drawBuffer}
        data={{ vertices }}
      />
    </PageWrapper>
  );
}

// Because we pass a reference down
export default React.forwardRef(ConvexHull);
