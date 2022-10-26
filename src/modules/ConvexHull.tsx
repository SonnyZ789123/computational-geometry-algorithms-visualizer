import React, { useRef, useState, useMemo, useCallback } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import {
  clearAndRedrawBuffer,
  generateRandomVertices,
  readyCanvas,
} from '../lib/canvas';
import { bruteForceConvexHull } from '../lib/algorithms/convexHull';

import { AlgorithmGenerator, DrawBuffer, Vertex } from '../types';
import colors from '../global/styles/colors';
import { convexHull as convexHullIds } from '../global/routes/paths';

import PageWrapper from './_common/PageWrapper';
import Canvas from './_common/Canvas';
import Controls from './_common/Controls';

const useAlgorithmRouter = () => {
  const { id } = useParams(); // The choice of algorithm

  const algorithmRouter = useMemo<AlgorithmGenerator>(() => {
    // TODO implement other algorithms
    const { BRUTE_FORCE, ANDREW, GRAHAM, JARVIS } = convexHullIds;
    switch (id) {
      case BRUTE_FORCE:
        return bruteForceConvexHull;
      case ANDREW:
        return undefined as unknown as AlgorithmGenerator;
      case GRAHAM:
        return undefined as unknown as AlgorithmGenerator;
      case JARVIS:
        return undefined as unknown as AlgorithmGenerator;
      default:
        return undefined as unknown as AlgorithmGenerator; // Dummy return type
    }
  }, [id]);

  return algorithmRouter;
};

function ConvexHull(): JSX.Element {
  const algorithmRouter = useAlgorithmRouter();

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [vertices, setVertices] = useState<Vertex[]>([]);
  const [drawBuffer, setDrawBuffer] = useState<DrawBuffer>({
    vertices: [],
    edges: [],
    directedEdges: [],
  });

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

  return !algorithmRouter ? (
    <Navigate to='/not-found' />
  ) : (
    <PageWrapper>
      <Canvas canvasRef={canvasRef} />
      <Controls
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
export default React.forwardRef(ConvexHull);
