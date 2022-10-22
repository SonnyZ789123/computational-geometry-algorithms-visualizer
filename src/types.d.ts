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
