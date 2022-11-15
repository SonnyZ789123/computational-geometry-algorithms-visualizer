import React, { useRef, useState, useMemo, useCallback } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import {
  clearAndRedrawBuffer,
  generateRandomEdges,
  readyCanvas,
} from '../lib/canvas';
import {
  lineSegmentIntersectionBruteForce,
  lineSegmentIntersectionPlaneSweep,
} from '../lib/algorithms/lineSegmentIntersection';

import { AlgorithmGenerator, DrawBuffer, Edge } from '../types';
import colors from '../global/styles/colors';
import { lineSegmentIntersection as lineSegmentIntersectionIds } from '../global/routes/paths';

import PageWrapper from './_common/PageWrapper';
import Canvas from './_common/Canvas';
import Controls from './_common/Controls';

const useAlgorithmRouter = () => {
  const { id } = useParams(); // The choice of algorithm

  const algorithmRouter = useMemo<{
    title: string;
    algorithm: AlgorithmGenerator;
  }>(() => {
    const { BRUTE_FORCE, PLANE_SWEEP } = lineSegmentIntersectionIds;
    switch (id) {
      case BRUTE_FORCE:
        return {
          title: 'Brute Force Line Segment Intersection',
          algorithm: lineSegmentIntersectionBruteForce,
        };
      case PLANE_SWEEP:
        return {
          title: 'Plane Sweep Algorithm',
          algorithm: lineSegmentIntersectionPlaneSweep,
        };
      default:
        return undefined as unknown as {
          title: string;
          algorithm: AlgorithmGenerator;
        }; // Dummy return type
    }
  }, [id]);

  return algorithmRouter;
};

function LineSegmentIntersection(): JSX.Element {
  /// /// Basic initialization
  // Reference to the HTML canvas element on which we draw
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Draw buffer which saves the drawn elements
  const [drawBuffer, setDrawBuffer] = useState<DrawBuffer>({
    vertices: [],
    edges: [],
    directedEdges: [],
    text: [],
  });

  // Router which inspects the id in the url path and selects the corresponding algorithm
  const algorithmRouter = useAlgorithmRouter();
  /// ///

  const [edges, setEdges] = useState<Edge[]>([]); // Edges

  const randomize = useCallback((amount: number) => {
    const ctx = readyCanvas(canvasRef.current);
    if (!ctx) return;

    const localEdges = generateRandomEdges(amount);
    const localDrawBuffer = {
      vertices: [],
      edges: [
        ...localEdges.map((v) => ({ value: v, color: colors.secondary })),
      ],
      directedEdges: [],
      text: [],
    };
    clearAndRedrawBuffer(ctx, localDrawBuffer);
    setEdges(localEdges);
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
        data={{ edges }}
      />
    </PageWrapper>
  );
}

// Because we pass a reference down
export default React.forwardRef(LineSegmentIntersection);
