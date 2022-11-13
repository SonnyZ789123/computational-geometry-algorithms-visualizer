import { intersectEdgesPoint } from './_helpers';
import { clearAndRedrawBuffer, drawDot, drawEdge } from '../canvas';

import { AlgorithmData, Algorithm, DrawBuffer } from '../../types';
import colors from '../../global/styles/colors';

// Define some uniform colors
const CURRENT = colors.white;
const OTHER = colors.secondary;
const SUCCESS = colors.yellow; // yellow because not enough contrast with underlying lines
const FAIL = colors.danger;
const TEXT = colors.greyLight;

/**
 * Draw the intersecting line segment points in a brute force manner.
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas context that will be drawn on
 * @param {DrawVuffer} drawBuffer - The drawBuffer that contains already drawn elements
 * @param {{ vertices: readonly Vertex[] }} data - The data object that contains the elements for processing
 * @returns {DrawBuffer} - The local drawBuffer
 */
export function* lineSegmentIntersectionBruteForce(
  ctx: CanvasRenderingContext2D,
  drawBuffer: DrawBuffer,
  { edges }: AlgorithmData
): Algorithm {
  // AlgoritmData is possibly undefined
  if (!edges) {
    throw new Error('Edges is undefined');
  }

  // Force a clean context
  clearAndRedrawBuffer(ctx, drawBuffer);

  // Make a local drawBuffer
  const localDrawBuffer: DrawBuffer = {
    vertices: [...drawBuffer.vertices],
    edges: [...drawBuffer.edges],
    directedEdges: [...drawBuffer.directedEdges],
    text: [...drawBuffer.text],
  };

  for (let i = 0; i < edges.length; i += 1) {
    // Start with i + 1 because we don't want to count double (direction is not important)
    // Because we start with i + 1, checking if i === j is unnecessary
    for (let j = i + 1; j < edges.length; j += 1) {
      const e1 = edges[i];
      const e2 = edges[j];

      drawEdge(ctx, e1, CURRENT);
      drawEdge(ctx, e2, CURRENT);
      yield 'Current lines to evaluate';

      const { intersect, p } = intersectEdgesPoint(e1, e2);

      if (intersect) {
        drawDot(ctx, p, SUCCESS);
        localDrawBuffer.vertices.push({ value: p, color: SUCCESS });
        yield 'They intersect';
      } else {
        drawEdge(ctx, e1, FAIL);
        drawEdge(ctx, e2, FAIL);
        yield "They don't intersect";
      }

      clearAndRedrawBuffer(ctx, localDrawBuffer);
    }
  }

  yield 'Done!';

  return localDrawBuffer;
}
