"use client";

import Squares from "../Squares";

export default function SquaresGrid() {
  return (
    <Squares
      speed={0.2}
      squareSize={40}
      direction="diagonal" // up, down, left, right, diagonal
      borderColor="#fff1"
      hoverFillColor="#222"
    />
  );
}
