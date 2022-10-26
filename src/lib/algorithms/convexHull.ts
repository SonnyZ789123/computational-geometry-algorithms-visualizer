import { drawDirectedEdge, clearAndRedrawBuffer } from '../canvas';
import { relativeOrientation } from './helpers';

import { AlgorithmData, Algorithm, DrawBuffer } from '../../types';
import colors from '../../global/styles/colors';

/**
 * Draw the convex hull of a list of vertices in a brute force manner.
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas context that will be drawn on
 * @param {DrawVuffer} drawBuffer - The drawBuffer that contains already drawn elements
 * @param {{ vertices: readonly Vertex[] }} data - The data object that contains the elements for processing
 * @returns The local drawBuffer
 */
export function* bruteForceConvexHull(
  ctx: CanvasRenderingContext2D,
  drawBuffer: DrawBuffer,
  { vertices }: AlgorithmData
): Algorithm {
  // AlgoritmData is possibly undefined
  if (!vertices) {
    throw new Error('Vertices is undefined');
  }

  // Force a clean context
  clearAndRedrawBuffer(ctx, drawBuffer);

  // Make a local drawBuffer
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
      yield;

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
          yield;

          break;
        } else {
          drawDirectedEdge(ctx, e2, colors.secondary);
          // Do not add to drawBuffer
          yield;
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

  return localDrawBuffer;
}
