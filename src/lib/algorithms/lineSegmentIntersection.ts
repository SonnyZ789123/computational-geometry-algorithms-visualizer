import {
  intersectEdgesPoint,
  middleEdge,
  relativeOrientation,
} from './_helpers';
import {
  CANVAS_WIDTH,
  clearAndRedrawBuffer,
  drawDot,
  drawEdge,
} from '../canvas';

import {
  AlgorithmData,
  Algorithm,
  DrawBuffer,
  Vertex,
  Edge,
  NamedEdge,
  NamedVertex,
} from '../../types';
import colors from '../../global/styles/colors';

// Define some uniform colors
const CURRENT = colors.white;
const OTHER = colors.secondary;
const SUCCESS = colors.greenLight;
const FAIL = colors.danger;
const EDGE_TEXT = colors.brownLight;
const VERTEX_TEXT = colors.brownDark;
const INTERSECT = colors.yellowLight; // yellow because not enough contrast with underlying lines
const SWEEP = colors.blueLight;

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
        drawDot(ctx, p, INTERSECT);
        localDrawBuffer.vertices.push({ value: p, color: INTERSECT });
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

type Event = {
  type: 'intersection' | 'upper' | 'lower';
  vertex: NamedVertex;
  edge: NamedEdge | [NamedEdge, NamedEdge]; // With type intersection it needs to eb [Edge, Edge]
};

// Temporary solution to balanced binary search tree.
function addEdgeToState(
  state: NamedEdge[],
  vertex: NamedVertex,
  edge: NamedEdge
) {
  let addIndex = 0;
  while (
    addIndex < state.length &&
    relativeOrientation(
      { from: state[addIndex].e[0].v, to: state[addIndex].e[1].v },
      { from: state[addIndex].e[0].v, to: vertex.v }
    ) < 0
  ) {
    addIndex += 1;
  }
  state.splice(addIndex, 0, edge);

  return addIndex;
}

function intersectionFound(
  events: Event[],
  edge1: NamedEdge,
  edge2: NamedEdge
): boolean {
  return !!events.find(
    (event) =>
      (event.type === 'intersection' &&
        (event.edge as [NamedEdge, NamedEdge])[0] === edge1 &&
        (event.edge as [NamedEdge, NamedEdge])[1] === edge2) ||
      ((event.edge as [NamedEdge, NamedEdge])[0] === edge2 &&
        (event.edge as [NamedEdge, NamedEdge])[1] === edge1)
  );
}

/**
 * Draw the intersecting line segment points with a plane sweep algorithm.
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas context that will be drawn on
 * @param {DrawVuffer} drawBuffer - The drawBuffer that contains already drawn elements
 * @param {{ edges: readonly Edge[] }} data - The data object that contains the elements for processing
 * @returns {DrawBuffer} - The local drawBuffer
 */
export function* lineSegmentIntersectionPlaneSweep(
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

  // Reorder the edges so the vertex of the vertex with the highest y-value is first
  // Give them a name
  const orderedEdges: NamedEdge[] = edges.map((e, i) =>
    e[0].y > e[1].y
      ? {
          name: `e${i}`,
          e: [
            { name: `v${i * 2}`, v: e[0] },
            { name: `v${i * 2 + 1}`, v: e[1] },
          ],
        }
      : {
          name: `e${i}`,
          e: [
            { name: `v${i * 2}`, v: e[1] },
            { name: `v${i * 2 + 1}`, v: e[0] },
          ],
        }
  );

  // Draw the names on the vertices and edges
  // Draw the vertices
  orderedEdges.forEach((namedEdge) => {
    const middle = middleEdge([namedEdge.e[0].v, namedEdge.e[1].v]);

    localDrawBuffer.text.push(
      {
        value: {
          position: middle,
          text: namedEdge.name,
        },
        color: EDGE_TEXT,
      },
      {
        value: {
          position: namedEdge.e[0].v,
          text: namedEdge.e[0].name,
        },
        color: VERTEX_TEXT,
      },
      {
        value: {
          position: namedEdge.e[1].v,
          text: namedEdge.e[1].name,
        },
        color: VERTEX_TEXT,
      }
    );

    localDrawBuffer.vertices.push(
      { value: namedEdge.e[0].v, color: OTHER },
      { value: namedEdge.e[1].v, color: OTHER }
    );
  });
  clearAndRedrawBuffer(ctx, localDrawBuffer);

  // Add all the upper and lower endpoints of the edges to the events
  const events: Event[] = orderedEdges
    .map((namedEdge) => [
      { type: 'upper', vertex: namedEdge.e[0], edge: namedEdge },
      { type: 'lower', vertex: namedEdge.e[1], edge: namedEdge },
    ])
    .flatMap((l) => l) as Event[];
  const state: NamedEdge[] = [];

  clearAndRedrawBuffer(ctx, localDrawBuffer);
  yield 'Add every upper and lower endpoint to the event queue';

  // Sort the events on lower to higher y-value, because we will work from right to left
  // So we will start from highest event and pop it till the events are empty
  // Could also work with shift but pop is faster
  events.sort((event1, event2) =>
    event1.vertex.v.y < event2.vertex.v.y ? -1 : 1
  );

  while (events.length > 0) {
    const currentEvent = events.pop() as Event; // Can't be undefined

    const sweep: Edge = [
      { x: 0, y: currentEvent.vertex.v.y },
      { x: CANVAS_WIDTH, y: currentEvent.vertex.v.y },
    ];

    // TODO: maybe make a function drawLine so it is definetly the whole canvas
    drawEdge(ctx, sweep, SWEEP);
    localDrawBuffer.edges.push({ value: sweep, color: SWEEP });
    yield `Update plane sweep to next event: ${currentEvent.type} ${currentEvent.vertex.name}`;

    yield `Current status: ${state.map(({ name }) => name).join('-')}`;

    /// ///////////////////////////////////////////
    // Handle upper endpoint
    if (currentEvent.type === 'upper') {
      const currentEventEdge: Edge = [
        (currentEvent.edge as NamedEdge).e[0].v,
        (currentEvent.edge as NamedEdge).e[1].v,
      ];
      const currentEventVertex: Vertex = currentEvent.vertex.v;

      // Add edge to the state
      const i = addEdgeToState(
        state,
        currentEvent.vertex,
        currentEvent.edge as NamedEdge
      );
      yield `Add edge to status: ${state.map(({ name }) => name).join('-')}`;

      // Test his maybe 2 neighbours for intersaction
      const left = state[i - 1];
      const right = state[i + 1];

      // if intersection and below => add to events
      if (left) {
        const leftEdge: Edge = [left.e[0].v, left.e[1].v];

        const { intersect, p } = intersectEdgesPoint(
          currentEventEdge,
          leftEdge
        );

        drawEdge(ctx, currentEventEdge, CURRENT);
        drawEdge(ctx, leftEdge, CURRENT);
        yield 'Current edges to test on intersection';

        if (intersect && p.y < currentEventVertex.y) {
          if (intersectionFound(events, currentEvent.edge as NamedEdge, left)) {
            yield 'They intersect but already found';
          } else {
            events.push({
              type: 'intersection',
              vertex: { name: 'intersection', v: p },
              edge: [currentEvent.edge as NamedEdge, left],
            });

            drawDot(ctx, p, SUCCESS);
            localDrawBuffer.vertices.push({ value: p, color: OTHER });
            yield 'They intersect, add to event queue';
          }
        } else {
          drawEdge(ctx, currentEventEdge, FAIL);
          drawEdge(ctx, leftEdge, FAIL);
          yield "They don't intersect";
        }

        clearAndRedrawBuffer(ctx, localDrawBuffer);
      }
      if (right) {
        const rightEdge: Edge = [right.e[0].v, right.e[1].v];

        const { intersect, p } = intersectEdgesPoint(
          currentEventEdge,
          rightEdge
        );

        drawEdge(ctx, currentEventEdge, CURRENT);
        drawEdge(ctx, rightEdge, CURRENT);
        yield 'Current edges to test on intersection';

        if (intersect && p.y < currentEventVertex.y) {
          if (
            intersectionFound(events, currentEvent.edge as NamedEdge, right)
          ) {
            yield 'They intersect but already found';
          } else {
            events.push({
              type: 'intersection',
              vertex: { name: 'intersection', v: p },
              edge: [currentEvent.edge as NamedEdge, right],
            });

            drawDot(ctx, p, SUCCESS);
            localDrawBuffer.vertices.push({ value: p, color: OTHER });
            yield 'They intersect, add to event queue';
          }
        } else {
          drawEdge(ctx, currentEventEdge, FAIL);
          drawEdge(ctx, rightEdge, FAIL);
          yield "They don't intersect";
        }

        clearAndRedrawBuffer(ctx, localDrawBuffer);
      }
    }
    /// ///////////////////////////////////////////
    // Handle lower endpoint
    else if (currentEvent.type === 'lower') {
      const currentEventVertex: Vertex = currentEvent.vertex.v;

      // Remove the edge from state
      const edgeIndex = state.findIndex((e) => e === currentEvent.edge);
      state.splice(edgeIndex, 1);

      yield `Delete edge from status: ${state
        .map(({ name }) => name)
        .join('-')}`;

      // Test maybe 2 new neighbours
      const left = state[edgeIndex - 1];
      const right = state[edgeIndex]; // Because we spliced the previous element on edgeIndex

      // if intersection and below => add to events
      if (left && right) {
        const leftEdge: Edge = [left.e[0].v, left.e[1].v];
        const rightEdge: Edge = [right.e[0].v, right.e[1].v];

        const { intersect, p } = intersectEdgesPoint(leftEdge, rightEdge);

        drawEdge(ctx, leftEdge, CURRENT);
        drawEdge(ctx, rightEdge, CURRENT);
        yield 'Current edges to test on intersection';

        if (intersect && p.y < currentEventVertex.y) {
          if (intersectionFound(events, left, right)) {
            yield 'They intersect but already found';
          } else {
            events.push({
              type: 'intersection',
              vertex: { name: 'intersection', v: p },
              edge: [left, right],
            });

            drawDot(ctx, p, SUCCESS);
            localDrawBuffer.vertices.push({ value: p, color: OTHER });
            yield 'They intersect, add to event queue';
          }
        } else {
          drawEdge(ctx, leftEdge, FAIL);
          drawEdge(ctx, rightEdge, FAIL);
          yield "They don't intersect";
        }

        clearAndRedrawBuffer(ctx, localDrawBuffer);
      }
    }
    /// ///////////////////////////////////////////
    // Handle intersection
    else if (currentEvent.type === 'intersection') {
      const currentEventVertex: Vertex = currentEvent.vertex.v;

      let index1 = state.findIndex(
        (e) => e === (currentEvent.edge as [NamedEdge, NamedEdge])[0]
      ); // e is type [Edge, Edge]
      let index2 =
        state[index1 - 1] === (currentEvent.edge as [NamedEdge, NamedEdge])[1]
          ? index1 - 1
          : index1 + 1; // left or right of index1
      [state[index1], state[index2]] = [state[index2], state[index1]]; // swap places

      yield `Swap edges in status: ${state.map(({ name }) => name).join('-')}`;

      // Make index1 the lowest value and index2 the one next to it
      [index1, index2] = index1 < index2 ? [index1, index2] : [index2, index1];

      // Test new neighbours to the left and right of the swapped edges on intersection
      const left = state[index1 - 1];
      const intersectionEdge1: Edge = [
        state[index1].e[0].v,
        state[index1].e[1].v,
      ];
      const right = state[index2 + 1];
      const intersectionEdge2: Edge = [
        state[index2].e[0].v,
        state[index2].e[1].v,
      ];

      // if intersection and below => add to events
      if (left) {
        const leftEdge: Edge = [left.e[0].v, left.e[1].v];

        const { intersect, p } = intersectEdgesPoint(
          intersectionEdge1,
          leftEdge
        );

        drawEdge(ctx, intersectionEdge1, CURRENT);
        drawEdge(ctx, leftEdge, CURRENT);
        yield 'Current edges to test on intersection';

        if (intersect && p.y < currentEventVertex.y) {
          if (intersectionFound(events, state[index1], left)) {
            yield 'They intersect but already found';
          } else {
            events.push({
              type: 'intersection',
              vertex: { name: 'intersection', v: p },
              edge: [state[index1], left],
            });

            drawDot(ctx, p, SUCCESS);
            localDrawBuffer.vertices.push({ value: p, color: OTHER });
            yield 'They intersect';
          }
        } else {
          drawEdge(ctx, intersectionEdge1, FAIL);
          drawEdge(ctx, leftEdge, FAIL);
          yield "They don't intersect";
        }

        clearAndRedrawBuffer(ctx, localDrawBuffer);
      }
      if (right) {
        const rightEdge: Edge = [right.e[0].v, right.e[1].v];

        const { intersect, p } = intersectEdgesPoint(
          intersectionEdge2,
          rightEdge
        );

        drawEdge(ctx, intersectionEdge2, CURRENT);
        drawEdge(ctx, rightEdge, CURRENT);
        yield 'Current edges to test on intersection';

        if (intersect && p.y < currentEventVertex.y) {
          if (intersectionFound(events, state[index2], right)) {
            yield 'They intersect but already found';
          } else {
            events.push({
              type: 'intersection',
              vertex: { name: 'intersection', v: p },
              edge: [state[index2], right],
            });

            drawDot(ctx, p, SUCCESS);
            localDrawBuffer.vertices.push({ value: p, color: OTHER });
            yield 'They intersect';
          }
        } else {
          drawEdge(ctx, intersectionEdge2, FAIL);
          drawEdge(ctx, rightEdge, FAIL);
          yield "They don't intersect";
        }

        clearAndRedrawBuffer(ctx, localDrawBuffer);
      }

      // Report the intersection point
      // Just push it, there are duplicates from init but it gets drawn over it
      // because this is added last.
      drawDot(ctx, currentEventVertex, INTERSECT);
      localDrawBuffer.vertices.push({
        value: currentEventVertex,
        color: INTERSECT,
      });
      yield 'Report intersection';
    }

    // Pop the previous sweep plane
    localDrawBuffer.edges.pop();
    clearAndRedrawBuffer(ctx, localDrawBuffer);

    // Resort the the events
    events.sort((event1, event2) =>
      event1.vertex.v.y < event2.vertex.v.y ? -1 : 1
    );
  }

  yield 'Done!';

  return localDrawBuffer;
}
