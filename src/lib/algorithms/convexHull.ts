/* eslint-disable no-restricted-syntax */
import { Edge, Vertex } from '../../types';
import { relativeOrientation } from './helpers';

/**
 *
 * @param {Set<Vertex>} vertices - A set P of points in the plane
 *
 * @returns {Vertex[]} A list containing the vertices of the convex hull in clockwise order
 */
export function bruteForceConvexHull(vertices: Set<Vertex>): Vertex[] {
  const convexHullSet = new Set<Edge>();

  let valid;
  for (const v1 of vertices) {
    for (const v2 of vertices) {
      valid = true;
      if (v1 === v2) {
        continue;
      }

      // Do all the vertices lie on the left?
      for (const v3 of vertices) {
        if (v3 === v1 || v3 === v2) {
          continue;
        }
        if (
          relativeOrientation({ from: v1, to: v2 }, { from: v1, to: v3 }) >= 0 // testing if it lies on the left of the line
        ) {
          valid = false;
          break;
        }
      }

      // If valid, add to set
      if (valid) {
        convexHullSet.add([v1, v2]);
        break;
      }
    }
  }

  // Order the set in clockwise order
  const [first, ...temp] = Array.from(convexHullSet);
  const convexHull: Vertex[] = [first[0]];

  for (let i = 0, currentEdge = first; i < temp.length; i += 1) {
    // Find the index of the following edge
    const newEdgeIndex = temp.findIndex(
      (edge) =>
        (edge[0].x === currentEdge[1].x && edge[0].y === currentEdge[1].y) ||
        (edge[1].x === currentEdge[1].x && edge[1].y === currentEdge[1].y)
    );

    // Reorder the edge so the next vertex is at index 1
    currentEdge =
      temp[newEdgeIndex][0].x === currentEdge[1].x &&
      temp[newEdgeIndex][0].y === currentEdge[1].y
        ? [temp[newEdgeIndex][0], temp[newEdgeIndex][1]]
        : [temp[newEdgeIndex][1], temp[newEdgeIndex][0]];

    // Add the vertex to the list
    convexHull.push(currentEdge[0]);

    // Delete the edge from the set
    temp.splice(newEdgeIndex, 1);
  }

  return convexHull;
}

/**
 *
 * @param {Set<Vertex>} vertices - A set P of points in the plane
 *
 * @returns {Vertex[]} A list containing the vertices of the convex hull in clockwise order
 */
// export function AndrewConvexHull(vertices: Set<Vertex>): Vertex[] {}

/**
 *
 * @param {Set<Vertex>} vertices - A set P of points in the plane
 *
 * @returns {Vertex[]} A list containing the vertices of the convex hull in clockwise order
 */
// export function GrahamsScanConvexHull(vertices: Set<Vertex>): Vertex[] {}

/**
 *
 * @param {Set<Vertex>} vertices - A set P of points in the plane
 *
 * @returns {Vertex[]} A list containing the vertices of the convex hull in clockwise order
 */
// export function JarvinsMarchConvexHull(vertices: Set<Vertex>): Vertex[] {}
