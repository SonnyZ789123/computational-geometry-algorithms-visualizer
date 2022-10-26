import React, { useRef, useState, useMemo, useCallback } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import {
  clearAndRedrawBuffer,
  generateRandomVertices,
  readyCanvas,
} from '../lib/canvas';

import { AlgorithmGenerator, DrawBuffer, Vertex } from '../types';
import colors from '../global/styles/colors';
import { polygonTriangulation as polygonTriangulationIds } from '../global/routes/paths';

import PageWrapper from './_common/PageWrapper';
import Canvas from './_common/Canvas';
import Controls from './_common/Controls';

const useAlgorithmRouter = () => {
  const { id } = useParams(); // The choice of algorithm

  const algorithmRouter = useMemo<AlgorithmGenerator>(() => {
    const { POLYGON_TRIANGULATION } = polygonTriangulationIds;
    switch (id) {
      case POLYGON_TRIANGULATION:
        return undefined as unknown as AlgorithmGenerator;
      default:
        return undefined as unknown as AlgorithmGenerator; // Dummy return type
    }
  }, [id]);

  return algorithmRouter;
};

function PolygonTriangulation(): JSX.Element {
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

  const [vertices, setVertices] = useState<Vertex[]>([]); // Edges that form a simple polygon

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
        genAlgorithm={algorithmRouter}
        canvasElement={canvasRef.current}
        drawBuffer={drawBuffer}
        data={{ vertices }}
      />
    </PageWrapper>
  );
}

// Because we pass a reference down
export default React.forwardRef(PolygonTriangulation);
