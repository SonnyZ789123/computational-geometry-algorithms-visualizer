import { DirectedLine, Line, Vertex, Edge } from '../../types';

/**
 * Calculates the cross product.
 *
 * @param {Vertex} v1 - The first vertex
 * @param {Vertex} v2 - The second vertex
 * @returns {number} - The crossproduct v1 X v2
 */
export function crossProduct(v1: Vertex, v2: Vertex): number {
  return v1.x * v2.y - v2.x * v1.y;
}

/**
 * Calculates the length of a edge.
 *
 * @param {Edge} l - The edge
 * @returns {number} - The length of the edge
 */
export function lengthEdge(l: Edge): number {
  const [{ x: x1, y: y1 }, { x: x2, y: y2 }] = l;

  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

/**
 * Calculates the middle of the edge.
 *
 * @param {Edge} e - The edge
 * @returns {Vertex} - The vertex on the middle of the edge
 */
export function middleEdge(e: Edge): Vertex {
  const [{ x: x1, y: y1 }, { x: x2, y: y2 }] = e;

  const x = x2 > x1 ? (x2 - x1) / 2 + x1 : (x1 - x2) / 2 + x2;
  const y = y2 > y1 ? (y2 - y1) / 2 + y1 : (y1 - y2) / 2 + y2;

  return { x, y };
}

/**
 * Calculates the turn a target line makes, relative to the base line.
 *
 * @param {DirectedLine} baseLine - The base line for the orientation
 * @param {DirectedLine} targetLine - The target line that get's compared to the base line
 * @returns {number} - 0 if they extend eachother, > 0 if the target line makes a clockwise turn, < 0 if the target line makes a counter clockwise turn.
 */
export function relativeOrientation(
  baseLine: DirectedLine,
  targetLine: DirectedLine
): number {
  if (
    baseLine.from.x !== targetLine.from.x ||
    baseLine.from.y !== targetLine.from.y
  ) {
    throw new Error(
      "The baseline's and the target line's starting vertex must be equal."
    );
  }

  const { x: x0, y: y0 } = baseLine.from;
  const { x: x1, y: y1 } = baseLine.to;
  const { x: x2, y: y2 } = targetLine.to;

  return x1 * y2 - y1 * x2 + (y1 - y2) * x0 + (x2 - x1) * y0;
}

/**
 * Calculates the turn a line makes, relative to the base line which it's extends. They need to have the same starting vertex.
 *
 * @param {DirectedLine} baseLine - The base line for the orientation
 * @param {DirectedLine} nextLine - The next line that get's compared to the base line
 * @returns {number} - 0 if they extend eachother, > 0 if the next line makes a counter-clockwise turn, < 0 if the next line makes a clockwise turn.
 */
export function turnOrientation(
  baseLine: DirectedLine,
  nextLine: DirectedLine
): number {
  if (baseLine.to.x !== nextLine.from.x || baseLine.to.y !== nextLine.from.y) {
    throw new Error(
      "The baseline's end vertex and the next line's starting vertex must be equal."
    );
  }

  return relativeOrientation(baseLine, {
    from: { ...baseLine.from },
    to: { ...nextLine.to },
  });
}

/**
 * @deprecated Needs to be updated to look like intersectEdgesPoint but for lines.
 *
 * Determines if 2 given lines intersect, but does not calculate the point.
 *
 * @param {Line} line1 - The first line
 * @param {Line} line2 - The second line
 * @returns {boolean} - True if the 2 lines intersect, otherwise false
 */
export function intersectLines(line1: Line, line2: Line): boolean {
  const [{ x: x1, y: y1 }, { x: x2, y: y2 }] = line1;
  const [{ x: x3, y: y3 }, { x: x4, y: y4 }] = line2;

  // can the lines even intersect?
  if (
    Math.max(x1, x2) < Math.min(x3, x4) ||
    Math.max(x3, x4) < Math.min(x1, x2) ||
    Math.max(y1, y2) < Math.min(y3, y4) ||
    Math.max(y3, y4) < Math.min(y1, y2)
  ) {
    return false;
  }

  const orientation1 = crossProduct(
    { x: x3 - x1, y: y3 - y1 },
    { x: x2 - x1, y: y2 - y1 }
  );
  const orientation2 = crossProduct(
    { x: x4 - x1, y: y4 - y1 },
    { x: x2 - x1, y: y2 - y1 }
  );

  // If the 2 lines are coincident, both orientations will be 0
  return (
    (orientation1 >= 0 && orientation2 <= 0) ||
    (orientation1 <= 0 && orientation2 >= 0)
  );
}

/**
 * Calculate the intersect point of 2 intersecting lines segments (edge).
 * Precondition: the lines intersect -> first check with intersectLines.
 * line intercept math by Paul Bourke http://paulbourke.net/geometry/pointlineplane/.
 *
 * @param {Line} edge1 - The first line
 * @param {Line} edge2 - The second line
 * @returns {{ intersect: boolean; p: Vertex }} - An object with intersect key indicating if they intersect or not and p the point
 */
export function intersectEdgesPoint(
  edge1: Edge,
  edge2: Edge
): { intersect: boolean; p: Vertex } {
  const [{ x: x1, y: y1 }, { x: x2, y: y2 }] = edge1;
  const [{ x: x3, y: y3 }, { x: x4, y: y4 }] = edge2;
  const p: Vertex = {
    x: 0,
    y: 0,
  };

  // can the lines even intersect?
  if (
    Math.max(x1, x2) < Math.min(x3, x4) ||
    Math.max(x3, x4) < Math.min(x1, x2) ||
    Math.max(y1, y2) < Math.min(y3, y4) ||
    Math.max(y3, y4) < Math.min(y1, y2)
  ) {
    return { intersect: false, p };
  }

  // see http://paulbourke.net/geometry/pointlineplane/
  const denominator = crossProduct(
    { x: x2 - x1, y: y2 - y1 },
    { x: x4 - x3, y: y4 - y3 }
  );
  const numerator1 = crossProduct(
    { x: x4 - x3, y: y4 - y3 },
    { x: x1 - x3, y: y1 - y3 }
  );
  const numerator2 = crossProduct(
    { x: x2 - x1, y: y2 - y1 },
    { x: x1 - x3, y: y1 - y3 }
  );

  const ua = numerator1 / denominator;
  const ub = numerator2 / denominator;

  // They don't intersect, edges are not long enough
  if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
    return { intersect: false, p };
  }

  // The lines are coincident -> just return the middle of a line segment
  if (numerator1 === 0 && numerator2 === 0 && denominator === 0) {
    return { intersect: true, p: middleEdge(edge1) };
  }

  p.x = x1 + ua * (x2 - x1);
  p.y = y1 + ua * (y2 - y1);

  return {
    intersect: true,
    p,
  };
}

/**
 * Calculates the polarAngle relative of a base vertex.
 * You can see the base vertex as the zero coordinate.
 *
 * @param {Vertex} base - The base vertex, the zero coordinate
 * @param {Vertex} target - The target vertex
 * @returns {number} - The polar angle between 0 and PI
 */
export function polarAngle(base: Vertex, target: Vertex) {
  const x = target.x - base.x;
  const y = target.y - base.y;

  // The target vertex lies under the base vertex
  if (y < 0) {
    // The target vertex lies directly under the base vertex
    if (x === 0) {
      return Math.PI / 2 + Math.PI;
    }

    // Third kwadrant
    if (x < 0) {
      return Math.PI + Math.atan(-y / -x);
    }

    // Fourth kwadrant
    return 2 * Math.PI - Math.atan(-y / x);
  }

  // The target vertex lies directly above the base vertex
  if (x === 0) {
    return Math.PI / 2;
  }

  // Second kwadrant
  if (x < 0) {
    return Math.PI - Math.atan(y / -x);
  }

  // First kwadrant
  return Math.atan(y / x);
}
