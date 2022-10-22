import colors from '../global/styles/colors';
import { Vertex, Edge, DirectedEdge } from '../types';

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

    ctx.strokeStyle = colors.darkGrey;

    ctx.moveTo(0, GRID_SIZE * i + 0.5);
    ctx.lineTo(CANVAS_WIDTH, GRID_SIZE * i + 0.5);

    ctx.stroke();
  }

  // Draw grid lines along y-axis
  for (let i = 1; i < X_MAX; i += 1) {
    ctx.beginPath();
    ctx.lineWidth = 1;

    ctx.strokeStyle = colors.darkGrey;

    ctx.moveTo(GRID_SIZE * i + 0.5, 0);
    ctx.lineTo(GRID_SIZE * i + 0.5, CANVAS_HEIGHT);

    ctx.stroke();
  }
}

export function clearCanvas(ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  drawGrid(ctx);
}

export function readyCanvas(
  canvasRef: React.RefObject<HTMLCanvasElement>
): CanvasRenderingContext2D | undefined {
  if (!canvasRef.current) {
    return;
  }
  const canvas = canvasRef.current;
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

/// /////////
// Generators
/// /////////
export function generateRandomVertices(amount: number) {
  const vertices: Vertex[] = [];

  for (let i = 0; i < amount; i += 1) {
    const x =
      Math.floor(Math.random() * (CANVAS_WIDTH / MIN_DELTA)) * MIN_DELTA; // First scale to integers, pick a rondom number between all possible x-coo, then scale back to right size
    const y =
      Math.floor(Math.random() * (CANVAS_HEIGHT / MIN_DELTA)) * MIN_DELTA;

    if (!vertices.find((v) => v.x === x && v.y === y)) {
      vertices.push({ x, y });
    } else {
      i -= 1;
    }
  }

  return vertices;
}
