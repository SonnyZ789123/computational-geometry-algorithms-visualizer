import colors from '../global/styles/colors';
import { Vertex, Edge, DirectedEdge, DrawBuffer } from '../types';

/// /////////
// Config
/// /////////
export const DOT_SIZE = 3;
export const LINE_WIDTH = 1;
export const GRID_SIZE = 10;
export const MIN_DELTA = 1; // Min space between 2 points
export const CANVAS_WIDTH = 500;
export const CANVAS_HEIGHT = 500;
export const TOTAL_POINTS = (CANVAS_WIDTH * CANVAS_HEIGHT) / MIN_DELTA ** 2;
export const X_MAX = Math.floor(CANVAS_WIDTH / GRID_SIZE);
export const Y_MAX = Math.floor(CANVAS_HEIGHT / GRID_SIZE);
const ARROW_LEN = MIN_DELTA * 7;

/// /////////
// Init and clear
/// /////////
export function drawGrid(ctx: CanvasRenderingContext2D) {
  // Start at 1 because otherwise we draw on the border
  // Draw grid lines along X-axis
  for (let i = 1; i < Y_MAX; i += 1) {
    ctx.beginPath();
    ctx.lineWidth = 1;

    ctx.strokeStyle = colors.greyDark;

    ctx.moveTo(0, GRID_SIZE * i + 0.5);
    ctx.lineTo(CANVAS_WIDTH, GRID_SIZE * i + 0.5);

    ctx.stroke();
  }

  // Draw grid lines along y-axis
  for (let i = 1; i < X_MAX; i += 1) {
    ctx.beginPath();
    ctx.lineWidth = 1;

    ctx.strokeStyle = colors.greyDark;

    ctx.moveTo(GRID_SIZE * i + 0.5, 0);
    ctx.lineTo(GRID_SIZE * i + 0.5, CANVAS_HEIGHT);

    ctx.stroke();
  }
}

/**
 * Clears the canvas and draws the grid.
 *
 * @param {CanvasRenderingContext2D} ctx - The 2D context of a canvas
 */
export function clearCanvas(ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  drawGrid(ctx);
}

export function readyCanvas(
  canvas: HTMLCanvasElement | null
): CanvasRenderingContext2D | undefined {
  if (!canvas) {
    return;
  }
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return;
  }

  return ctx;
}

/// /////////
// Drawing
/// /////////
export function drawDot(
  ctx: CanvasRenderingContext2D,
  v: Vertex,
  color: string
) {
  ctx.fillStyle = color;
  ctx.fillRect(v.x - DOT_SIZE / 2, v.y - DOT_SIZE / 2, DOT_SIZE, DOT_SIZE); // Center it
}

export function drawEdge(
  ctx: CanvasRenderingContext2D,
  [v1, v2]: Edge,
  color: string
) {
  ctx.strokeStyle = color;
  ctx.lineWidth = LINE_WIDTH;
  ctx.beginPath();
  ctx.moveTo(v1.x, v1.y);
  ctx.lineTo(v2.x, v2.y);
  ctx.stroke();
}

export function drawDirectedEdge(
  ctx: CanvasRenderingContext2D,
  { from, to }: DirectedEdge,
  color: string
) {
  ctx.strokeStyle = color;
  ctx.lineWidth = LINE_WIDTH;
  const angle = Math.atan2(to.y - from.y, to.x - from.x);
  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(to.x, to.y);
  ctx.lineTo(
    to.x - ARROW_LEN * Math.cos(angle - Math.PI / 6),
    to.y - ARROW_LEN * Math.sin(angle - Math.PI / 6)
  );
  ctx.moveTo(to.x, to.y);
  ctx.lineTo(
    to.x - ARROW_LEN * Math.cos(angle + Math.PI / 6),
    to.y - ARROW_LEN * Math.sin(angle + Math.PI / 6)
  );
  ctx.stroke();
}

/**
 * Used to draw text corresponding to a vertex, will not draw exactly to the
 * vertex's position.
 */
export function drawText(
  ctx: CanvasRenderingContext2D,
  v: Vertex,
  text: string,
  color: string
) {
  const textLength = ctx.measureText(text).width;
  let xPos = v.x + GRID_SIZE;
  let yPos = v.y + GRID_SIZE;

  ctx.fillStyle = color;
  ctx.font = `${GRID_SIZE * 1.2}px Arial`;

  // Position overflows to the right, so draw to the left
  if (xPos + textLength > CANVAS_WIDTH) {
    xPos = v.x - textLength - GRID_SIZE;
  }

  // Position overflows under, so just draw above the vertex
  if (yPos + textLength > CANVAS_HEIGHT) {
    yPos = v.y - GRID_SIZE;
  }

  // Draw the number a grid element to the right and under
  ctx.fillText(text, xPos, yPos);
}

export function redrawBuffer(
  ctx: CanvasRenderingContext2D,
  drawBuffer: DrawBuffer
) {
  // use for-loop for better performance
  for (let i = 0; i < drawBuffer.vertices.length; i += 1) {
    drawDot(ctx, drawBuffer.vertices[i].value, drawBuffer.vertices[i].color);
  }
  for (let i = 0; i < drawBuffer.edges.length; i += 1) {
    drawEdge(ctx, drawBuffer.edges[i].value, drawBuffer.edges[i].color);
  }
  for (let i = 0; i < drawBuffer.directedEdges.length; i += 1) {
    drawDirectedEdge(
      ctx,
      drawBuffer.directedEdges[i].value,
      drawBuffer.directedEdges[i].color
    );
  }
  for (let i = 0; i < drawBuffer.text.length; i += 1) {
    drawText(
      ctx,
      drawBuffer.text[i].value.position,
      drawBuffer.text[i].value.text,
      drawBuffer.text[i].color
    );
  }
}

export function clearAndRedrawBuffer(
  ctx: CanvasRenderingContext2D,
  drawBuffer: DrawBuffer
) {
  clearCanvas(ctx);
  redrawBuffer(ctx, drawBuffer);
}

/// /////////
// Generators
/// /////////
function generateRandomPoint() {
  // First scale to integers, pick a random number between all possible x-coo, then scale back to right size
  const x = Math.floor(Math.random() * (CANVAS_WIDTH / MIN_DELTA)) * MIN_DELTA;
  const y = Math.floor(Math.random() * (CANVAS_HEIGHT / MIN_DELTA)) * MIN_DELTA;

  return { x, y };
}

export function generateRandomVertices(amount: number) {
  const vertices: Vertex[] = [];

  for (let i = 0; i < amount; i += 1) {
    const p = generateRandomPoint();

    if (!vertices.find((v) => v.x === p.x && v.y === p.y)) {
      vertices.push(p);
    } else {
      i -= 1;
    }
  }

  return vertices;
}

export function generateRandomEdges(amount: number) {
  const edges: Edge[] = [];

  for (let i = 0; i < amount; i += 1) {
    const p1 = generateRandomPoint();
    const p2 = generateRandomPoint();

    if (
      !edges.find(
        (e) =>
          e[0].x === p1.x &&
          e[0].y === p1.y &&
          e[1].x === p2.x &&
          e[1].y === p2.y
      )
    ) {
      edges.push([p1, p2]);
    } else {
      i -= 1;
    }
  }

  return edges;
}

/**
 * Generate a simple polygon, thus with no intersecting edges.
 *
 * @param {number} _amount - The amount of edges the polygon consists of
 * @returns {DirectedEdge[]} The edges of the simple polygon in clockwise order
 */
export function generateSimplePolygon(amount: number) {}
