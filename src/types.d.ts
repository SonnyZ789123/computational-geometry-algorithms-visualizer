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
export type AlgorithmData = Vertex[] | Edge[] | DirectedEdge[];

export type Algorithm = Generator<undefined, DrawBuffer | undefined, unknown>;

// DataType will be somethine like { vertices: Vertex[], ...}
export type AlgorithmGenerator<DataType extends {}> = (
  ctx: CanvasRenderingContext2D,
  drawBuffer: DrawBuffer,
  data: DataType
) => Algorithm;
