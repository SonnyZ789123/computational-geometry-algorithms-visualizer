// _common
export type Vertex = {
  x: number;
  y: number;
};

export type Edge = [Vertex, Vertex];

export type DirectedEdge = {
  from: Vertex;
  to: Vertex;
};

export type Line = [Vertex, Vertex];

export type DirectedLine = {
  from: Vertex;
  to: Vertex;
};

// DrawBuffer
export type DrawBuffer = {
  vertices: { value: Vertex; color: string }[];
  edges: { value: Edge; color: string }[];
  directedEdges: { value: Directed; color: string }[];
};

// Algorithm
export type AlgorithmData = {
  vertices?: readonly Vertex[];
  edges?: readonly Edge[];
  directedEdges?: readonly DirectedEdge[];
};

export type Algorithm = Generator<undefined, DrawBuffer | undefined, unknown>;

export type AlgorithmGenerator = (
  ctx: CanvasRenderingContext2D,
  drawBuffer: DrawBuffer,
  data: AlgorithmData
) => Algorithm;
