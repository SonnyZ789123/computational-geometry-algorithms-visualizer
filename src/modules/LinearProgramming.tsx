import React, { useRef, useState, useMemo, useCallback } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import {
  clearAndRedrawBuffer,
  generateRandomVertices,
  readyCanvas,
} from '../lib/canvas';

import { AlgorithmGenerator, DrawBuffer, Vertex } from '../types';
import colors from '../global/styles/colors';
import { linearProgramming as linearProgrammingIds } from '../global/routes/paths';

import PageWrapper from './_common/PageWrapper';
import Canvas from './_common/Canvas';
import Controls from './_common/Controls';

const useAlgorithmRouter = () => {
  const { id } = useParams(); // The choice of algorithm

  const algorithmRouter = useMemo<{
    title: string;
    algorithm: AlgorithmGenerator;
  }>(() => {
    const { HALF_PLANE, ENCLOSING_DISC } = linearProgrammingIds;
    switch (id) {
      case HALF_PLANE:
        return {
          title: 'Half-Plane Intersection',
          algorithm: undefined as unknown as AlgorithmGenerator,
        };
      case ENCLOSING_DISC:
        return {
          title: 'Smallest Enclosing Disc',
          algorithm: undefined as unknown as AlgorithmGenerator,
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

function LinearProgramming(): JSX.Element {
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

  const [vertices, setVertices] = useState<Vertex[]>([]); // Directed Edges

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
      text: [],
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
        dataType='Edge'
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
export default React.forwardRef(LinearProgramming);
