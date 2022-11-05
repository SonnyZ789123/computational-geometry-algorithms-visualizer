import { drawDirectedEdge, clearAndRedrawBuffer, drawText } from '../canvas';
import { polarAngle, relativeOrientation, turnOrientation } from './_helpers';

import { AlgorithmData, Algorithm, DrawBuffer, Vertex } from '../../types';
import colors from '../../global/styles/colors';

// Define some uniform colors
const CURRENT = colors.white;
const OTHER = colors.secondary;
const SUCCESS = colors.success;
const FAIL = colors.danger;
const CONVEX = colors.yellow;
const TEXT = colors.greyLight;

/**
 * Draw the convex hull of a list of vertices in a brute force manner.
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas context that will be drawn on
 * @param {DrawVuffer} drawBuffer - The drawBuffer that contains already drawn elements
 * @param {{ vertices: readonly Vertex[] }} data - The data object that contains the elements for processing
 * @returns {DrawBuffer} - The local drawBuffer
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
    text: [...drawBuffer.text],
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
      yield 'Current edge to evaluate';

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
          yield 'Edge lies on the right: fail';

          break;
        } else {
          drawDirectedEdge(ctx, e2, SUCCESS);
          // Do not add to drawBuffer
          yield 'Edge lies on the left: ok';
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
        // Pop the just processed edge from the drawBuffer so we don't draw it anymore
        clearAndRedrawBuffer(ctx, localDrawBuffer);
        yield 'All other edges lie on the left: part of convex hull';
      } else {
        // Pop the just processed edge from the drawBuffer so we don't draw it anymore
        clearAndRedrawBuffer(ctx, localDrawBuffer);
      }
    }
  }

  yield 'Done!';

  return localDrawBuffer;
}

/**
 * Draw the convex hull of a list of vertices with Andrew's Algorithm.
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas context that will be drawn on
 * @param {DrawVuffer} drawBuffer - The drawBuffer that contains already drawn elements
 * @param {{ vertices: readonly Vertex[] }} data - The data object that contains the elements for processing
 * @returns {DrawBuffer} - The local drawBuffer
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
    text: [...drawBuffer.text],
  };

  const sortedVertices = [...vertices]; // copy the vertices
  const n = sortedVertices.length;

  // Sort based on x value
  sortedVertices.sort((v1, v2) => (v1.x < v2.x ? -1 : 1));
  sortedVertices.forEach((v, i) => {
    drawText(ctx, v, i.toString(), TEXT);
    localDrawBuffer.text.push({
      value: { position: v, text: i.toString() },
      color: TEXT,
    });
  });
  yield 'Sort vertices based on x-value';

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
  yield `Upper Hull: 0 -> ${n - 1}`;

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
    yield 'Current edge to evaluate';

    // While the next edge makes a left turn, delete the second last vertex.
    // So the upper contains only vertices that continually make right turns.
    while (
      upperLength > 2 &&
      turnOrientation({ from: v1, to: v2 }, { from: v2, to: v3 }) < 0
    ) {
      drawDirectedEdge(ctx, { from: v1, to: v3 }, FAIL);
      upper.splice(upperLength - 2, 1); // Delete the middle vertex
      upperLength -= 1;
      yield 'Makes left turn, delete previous edge';

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
    yield 'No left turns';
  }
  yield 'Upper Hull finished';

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
  yield `Upper Hull: ${n - 1} -> 0`;

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
    yield 'Current edge to evaluate';

    while (
      lowerLength > 2 &&
      turnOrientation({ from: v1, to: v2 }, { from: v2, to: v3 }) < 0
    ) {
      drawDirectedEdge(ctx, { from: v1, to: v3 }, FAIL);
      lower.splice(lowerLength - 2, 1);
      lowerLength -= 1;
      yield 'Makes left turn, delete previous edge';

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
    yield 'No left turns';
  }
  yield 'Lower Hull finished';

  // At the end we actually need to concat upper and lower (lower without first
  // and last vertex)

  yield 'Done!';

  return localDrawBuffer;
}

/**
 * Draw the convex hull of a list of vertices with Graham's Scan.
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas context that will be drawn on
 * @param {DrawVuffer} drawBuffer - The drawBuffer that contains already drawn elements
 * @param {{ vertices: readonly Vertex[] }} data - The data object that contains the elements for processing
 * @returns {DrawBuffer} - The local drawBuffer
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
    text: [...drawBuffer.text],
  };

  // Find the vertex with the lowest y coordinate
  const { value: v0, index: minYIndex } = vertices.reduce(
    (prev, next, index) =>
      next.y < prev.value.y ? { value: next, index } : prev,
    { value: vertices[0], index: 0 }
  );
  drawText(ctx, v0, 'Base', TEXT);
  localDrawBuffer.text.push({
    value: { position: v0, text: 'Base' },
    color: TEXT,
  });
  yield 'Find vertex with lowest y-value';

  const sortedVertices = [...vertices]; // copy the vertices
  sortedVertices.splice(minYIndex, 1); // Remove the base vertex with the lowes y-coordinate
  const n = sortedVertices.length;

  // Sort based on polar angle
  sortedVertices.sort((v1, v2) =>
    polarAngle(v0, v1) < polarAngle(v0, v2) ? -1 : 1
  );
  sortedVertices.forEach((v, i) => {
    drawText(ctx, v, i.toString(), TEXT);
    localDrawBuffer.text.push({
      value: { position: v, text: i.toString() },
      color: TEXT,
    });
  });
  yield 'Sort based on polar angle';

  const convexHull = [v0, sortedVertices[0]];
  drawDirectedEdge(ctx, { from: v0, to: sortedVertices[0] }, CONVEX);
  localDrawBuffer.directedEdges.push({
    value: { from: v0, to: sortedVertices[0] },
    color: CONVEX,
  });
  yield 'Initialise loop';
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
    yield 'Currently edge to evaluate';

    // While the next edge makes a left turn, delete the second last vertex.
    // So the upper contains only vertices that continually make right turns.
    while (
      upperLength > 2 &&
      turnOrientation({ from: v1, to: v2 }, { from: v2, to: v3 }) < 0
    ) {
      drawDirectedEdge(ctx, { from: v1, to: v3 }, FAIL);
      convexHull.splice(upperLength - 2, 1); // Delete the middle vertex
      upperLength -= 1;
      yield 'Makes left turn, delete previous edge';

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
    yield 'No left turns';
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
  yield 'Done!';

  return localDrawBuffer;
}

/**
 * Draw the convex hull of a list of vertices with Jarvis' March.
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas context that will be drawn on
 * @param {DrawVuffer} drawBuffer - The drawBuffer that contains already drawn elements
 * @param {{ vertices: readonly Vertex[] }} data - The data object that contains the elements for processing
 * @returns {DrawBuffer} - The local drawBuffer
 */
export function* jarvisConvexHull(
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
    text: [...drawBuffer.text],
  };

  // Find the vertex with the lowest y coordinate
  const { value: v0, index: minYIndex } = vertices.reduce(
    (prev, next, index) =>
      next.y < prev.value.y ? { value: next, index } : prev,
    { value: vertices[0], index: 0 }
  );
  drawText(ctx, v0, 'Start', TEXT);
  yield 'Find vertex with lowest y-value';

  // Find the vertex with the highst y coordinate
  const maxY = vertices.reduce(
    (prev, next) => (next.y > prev.y ? next : prev),
    vertices[0]
  );

  // Keep track of the current base
  let base = v0;
  let rest = [...vertices]; // copy the vertices
  rest.splice(minYIndex, 1); // Remove the base vertex with the lowest y-coordinate
  const n = rest.length;

  // Define local function so it doesn't get recreated over and over again
  const sortPolarAngle = (_base: Vertex, list: Vertex[], multiplier = 1) => {
    list.sort((v1, v2) =>
      polarAngle(_base, { x: multiplier * v1.x, y: multiplier * v1.y }) <
      polarAngle(_base, { x: multiplier * v2.x, y: multiplier * v2.y })
        ? -1
        : 1
    );
  };

  // For loop can max go over all the vertices, this is worst case
  // Goes till it reaches the highest vertex
  for (let i = 0; i < n; i += 1) {
    sortPolarAngle(base, rest);
    rest.forEach((v, index) => drawText(ctx, v, index.toString(), TEXT));
    drawText(ctx, rest[0], '0', CONVEX);
    yield 'Sort based on polar angle';

    drawDirectedEdge(ctx, { from: base, to: rest[0] }, CONVEX);
    localDrawBuffer.directedEdges.push({
      value: { from: base, to: rest[0] },
      color: CONVEX,
    });
    yield 'Connect edge from base to lowest polar angle';

    const temp = base;
    [base] = rest;
    rest = [...rest.slice(1), temp];

    clearAndRedrawBuffer(ctx, localDrawBuffer);
    drawText(ctx, base, 'Base', TEXT);
    yield 'Define new base';

    if (base === maxY) {
      yield 'Reached highest y-value, rotate polar angle calculations 180 deg';
      break;
    }
  }

  for (let i = 0; i < n; i += 1) {
    // We need to multiply the x and y of target - base vertex with -1
    // -result = target - base => result = -target - -base
    sortPolarAngle({ x: -base.x, y: -base.y }, rest, -1);
    rest.forEach((v, index) => drawText(ctx, v, index.toString(), TEXT));
    drawText(ctx, rest[0], '0', CONVEX);
    yield 'Sort based on polar angle';

    drawDirectedEdge(ctx, { from: base, to: rest[0] }, CONVEX);
    localDrawBuffer.directedEdges.push({
      value: { from: base, to: rest[0] },
      color: CONVEX,
    });
    yield 'Connect edge from base to lowest polar angle';

    const temp = base;
    [base] = rest;
    rest = [...rest.slice(1), temp];

    clearAndRedrawBuffer(ctx, localDrawBuffer);
    drawText(ctx, base, 'Base', TEXT);
    yield 'Define new base';

    if (base === v0) {
      break;
    }
  }

  yield 'Done!';

  return localDrawBuffer;
}
