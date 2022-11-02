import { drawDirectedEdge, clearAndRedrawBuffer } from '../canvas';
import { polarAngle, relativeOrientation, turnOrientation } from './_helpers';

import { AlgorithmData, Algorithm, DrawBuffer } from '../../types';
import colors from '../../global/styles/colors';

// Define some uniform colors
const CURRENT = colors.white;
const OTHER = colors.lightGrey;
const SUCCESS = colors.lightGreen;
const FAIL = colors.red;
const CONVEX = colors.yellow;

/**
 * Draw the convex hull of a list of vertices in a brute force manner.
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas context that will be drawn on
 * @param {DrawVuffer} drawBuffer - The drawBuffer that contains already drawn elements
 * @param {{ vertices: readonly Vertex[] }} data - The data object that contains the elements for processing
 * @returns {DrawBuffer} The local drawBuffer
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

      drawDirectedEdge(ctx, e1, CURRENT);
      localDrawBuffer.directedEdges.push({
        value: e1,
        color: CURRENT,
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
          drawDirectedEdge(ctx, e2, FAIL);
          // Do not add to drawBuffer
          yield;

          break;
        } else {
          drawDirectedEdge(ctx, e2, SUCCESS);
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
          color: CONVEX,
        });
      }

      // Pop the just processed edge from the drawBuffer so we don't draw it anymore
      clearAndRedrawBuffer(ctx, localDrawBuffer);
    }
  }

  return localDrawBuffer;
}

/**
 * Draw the convex hull of a list of vertices with Andrew's Algorithm.
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas context that will be drawn on
 * @param {DrawVuffer} drawBuffer - The drawBuffer that contains already drawn elements
 * @param {{ vertices: readonly Vertex[] }} data - The data object that contains the elements for processing
 * @returns {DrawBuffer} The local drawBuffer
 */
export function* andrewConvexHull(
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

  const sortedVertices = [...vertices]; // copy the vertices
  const n = sortedVertices.length;

  // Sort based on x value
  sortedVertices.sort((v1, v2) => (v1.x < v2.x ? -1 : 1));

  // UPPER HULL
  const upper = [sortedVertices[0], sortedVertices[1]];
  drawDirectedEdge(
    ctx,
    { from: sortedVertices[0], to: sortedVertices[1] },
    CONVEX
  );
  localDrawBuffer.directedEdges.push({
    value: { from: sortedVertices[0], to: sortedVertices[1] },
    color: CONVEX,
  });
  yield;
  for (let i = 2; i < n; i += 1) {
    upper.push(sortedVertices[i]);

    let upperLength = upper.length;
    let v1 = upper[upperLength - 3];
    let v2 = upper[upperLength - 2];
    let v3 = upper[upperLength - 1];

    drawDirectedEdge(ctx, { from: v2, to: v3 }, OTHER);
    localDrawBuffer.directedEdges.push({
      value: { from: v2, to: v3 },
      color: OTHER,
    });
    yield;

    // While the next edge makes a left turn, delete the second last vertex.
    // So the upper contains only vertices that continually make right turns.
    while (
      upperLength > 2 &&
      turnOrientation({ from: v1, to: v2 }, { from: v2, to: v3 }) < 0
    ) {
      drawDirectedEdge(ctx, { from: v1, to: v3 }, FAIL);
      upper.splice(upperLength - 2, 1); // Delete the middle vertex
      upperLength -= 1;
      yield;

      // Pop that edge that was faulty part of the convex hull
      localDrawBuffer.directedEdges.pop();

      v1 = upper[upperLength - 3];
      v2 = upper[upperLength - 2];
      v3 = upper[upperLength - 1];
    }

    // Pop the "other" edge which we maybe backtracked from
    localDrawBuffer.directedEdges.pop();
    // Push the actual edge that is maybe part of the convex hull
    localDrawBuffer.directedEdges.push({
      value: { from: v2, to: v3 },
      color: CONVEX,
    });
    clearAndRedrawBuffer(ctx, localDrawBuffer);
  }

  // LOWER HULL
  // The same but now we start from highest x-values
  const lower = [sortedVertices[n - 1], sortedVertices[n - 2]];
  drawDirectedEdge(
    ctx,
    { from: sortedVertices[n - 1], to: sortedVertices[n - 2] },
    CONVEX
  );
  localDrawBuffer.directedEdges.push({
    value: { from: sortedVertices[n - 1], to: sortedVertices[n - 2] },
    color: CONVEX,
  });
  yield;
  for (let i = n - 3; i >= 0; i -= 1) {
    lower.push(sortedVertices[i]);

    let lowerLength = lower.length;
    let v1 = lower[lowerLength - 3];
    let v2 = lower[lowerLength - 2];
    let v3 = lower[lowerLength - 1];

    drawDirectedEdge(ctx, { from: v2, to: v3 }, OTHER);
    localDrawBuffer.directedEdges.push({
      value: { from: v2, to: v3 },
      color: OTHER,
    });
    yield;

    while (
      lowerLength > 2 &&
      turnOrientation({ from: v1, to: v2 }, { from: v2, to: v3 }) < 0
    ) {
      drawDirectedEdge(ctx, { from: v1, to: v3 }, FAIL);
      lower.splice(lowerLength - 2, 1);
      lowerLength -= 1;
      yield;

      localDrawBuffer.directedEdges.pop();

      v1 = lower[lowerLength - 3];
      v2 = lower[lowerLength - 2];
      v3 = lower[lowerLength - 1];
    }

    localDrawBuffer.directedEdges.pop();
    localDrawBuffer.directedEdges.push({
      value: { from: v2, to: v3 },
      color: CONVEX,
    });
    clearAndRedrawBuffer(ctx, localDrawBuffer);
  }

  // At the end we actually need to concat upper and lower (lower without first
  // and last vertex)

  return localDrawBuffer;
}

/**
 * Draw the convex hull of a list of vertices with Graham's Scan.
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas context that will be drawn on
 * @param {DrawVuffer} drawBuffer - The drawBuffer that contains already drawn elements
 * @param {{ vertices: readonly Vertex[] }} data - The data object that contains the elements for processing
 * @returns {DrawBuffer} The local drawBuffer
 */
export function* grahamConvexHull(
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

  // Find the vertex with the lowest y coordinate
  const { value: v0, index: minYIndex } = vertices.reduce(
    (prev, next, index) =>
      next.y < prev.value.y ? { value: next, index } : prev,
    { value: vertices[0], index: 0 }
  );

  const sortedVertices = [...vertices]; // copy the vertices
  sortedVertices.splice(minYIndex, 1); // Remove the base vertex with the lowes y-coordinate
  const n = sortedVertices.length;

  console.log('-----------------------------');
  console.log(sortedVertices);
  // Sort based on polar angle
  sortedVertices.sort((v1, v2) =>
    polarAngle(v0, v1) < polarAngle(v0, v2) ? -1 : 1
  );

  const convexHull = [v0, sortedVertices[0]];
  drawDirectedEdge(ctx, { from: v0, to: sortedVertices[0] }, CONVEX);
  localDrawBuffer.directedEdges.push({
    value: { from: v0, to: sortedVertices[0] },
    color: CONVEX,
  });
  yield;
  for (let i = 1; i < n; i += 1) {
    convexHull.push(sortedVertices[i]);

    let upperLength = convexHull.length;
    let v1 = convexHull[upperLength - 3];
    let v2 = convexHull[upperLength - 2];
    let v3 = convexHull[upperLength - 1];

    drawDirectedEdge(ctx, { from: v2, to: v3 }, OTHER);
    localDrawBuffer.directedEdges.push({
      value: { from: v2, to: v3 },
      color: OTHER,
    });
    yield;

    // While the next edge makes a right turn, delete the second last vertex.
    // So the upper contains only vertices that continually make left turns.
    while (
      upperLength > 2 &&
      turnOrientation({ from: v1, to: v2 }, { from: v2, to: v3 }) > 0
    ) {
      drawDirectedEdge(ctx, { from: v1, to: v3 }, FAIL);
      convexHull.splice(upperLength - 2, 1); // Delete the middle vertex
      upperLength -= 1;
      yield;

      // Pop that edge that was faulty part of the convex hull
      localDrawBuffer.directedEdges.pop();

      v1 = convexHull[upperLength - 3];
      v2 = convexHull[upperLength - 2];
      v3 = convexHull[upperLength - 1];
    }

    // Pop the "other" edge which we maybe backtracked from
    localDrawBuffer.directedEdges.pop();
    // Push the actual edge that is maybe part of the convex hull
    localDrawBuffer.directedEdges.push({
      value: { from: v2, to: v3 },
      color: CONVEX,
    });
    clearAndRedrawBuffer(ctx, localDrawBuffer);
  }

  // Draw a last edge to connect the last one with the base vertex
  drawDirectedEdge(
    ctx,
    { from: convexHull[convexHull.length - 1], to: v0 },
    CONVEX
  );
  localDrawBuffer.directedEdges.push({
    value: { from: convexHull[convexHull.length - 1], to: v0 },
    color: CONVEX,
  });
  yield;

  return localDrawBuffer;
}
