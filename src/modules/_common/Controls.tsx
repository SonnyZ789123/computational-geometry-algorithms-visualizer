import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import colors from '../../global/styles/colors';
import { readyCanvas, TOTAL_POINTS } from '../../lib/canvas';

import { ReactComponent as PlayIcon } from '../../assets/icons/play.svg';
import { ReactComponent as PauseIcon } from '../../assets/icons/pause.svg';
import { ReactComponent as SkipBackIcon } from '../../assets/icons/skip-back.svg';
import { ReactComponent as SkipForwardIcon } from '../../assets/icons/skip-forward.svg';

import { Button } from '../../global/components/Buttons';
import { delay } from '../../lib/visualization';
import { Vertex, Algorithm, AlgorithmGenerator, DrawBuffer } from '../../types';

const Container = styled.div`
  grid-column: 10 / end;
  display: flex;
  flex-flow: column nowrap;
  gap: 1rem;
`;

const PlayContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Icon = styled.div`
  cursor: pointer;
`;

const ControlContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Description = styled.label`
  font-size: 1.5rem;
  color: ${colors.white};
`;

const Input = styled.input`
  font-size: 1.5rem;
  color: ${colors.secondary};
  width: 30%;
`;

type ControlsProps = {
  amount: number;
  setAmount: React.Dispatch<React.SetStateAction<number>>;
  randomize: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  genAlgorithm: AlgorithmGenerator<{ vertices: Vertex[] }>;
  canvasElement: HTMLCanvasElement | null;
  drawBuffer: DrawBuffer;
  data: { vertices: Vertex[] };
};

function Controls({
  amount,
  setAmount,
  randomize,
  genAlgorithm,
  canvasElement,
  drawBuffer,
  data,
}: ControlsProps): JSX.Element {
  const [playing, setPlaying] = useState(false);
  const [delayAmount, setDelayAmount] = useState(2000); // in ms
  const algorithm = useRef<Algorithm>();

  const handlePlayingClick = async () => {
    if (!algorithm.current) return;

    setPlaying(true);

    // Step through all the steps (yields) but wait before each yield
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const step of algorithm.current) {
      await delay(delayAmount);
    }
  };

  const handleBackClick = () => {};

  const handleNextClick = () => {
    if (!algorithm.current) return;

    algorithm.current.next();
  };

  // We need to generate the algorithm again if the input changes
  useEffect(() => {
    const ctx = readyCanvas(canvasElement);
    if (!ctx) return;

    // local drawBuffer, it gets modified
    const localDrawBuffer: DrawBuffer = {
      vertices: [...drawBuffer.vertices],
      edges: [...drawBuffer.edges],
      directedEdges: [...drawBuffer.directedEdges],
    };

    algorithm.current = genAlgorithm(ctx, localDrawBuffer, data);

    return () => {
      // Don't need the drawBuffer it returns, just return is so it's state is 'closed'.
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      algorithm.current?.return;
    };
  }, [data, canvasElement]);

  return (
    <Container>
      <PlayContainer>
        <Icon>
          <SkipBackIcon onClick={handleBackClick} />
        </Icon>
        <Icon>
          {playing ? (
            <PauseIcon onClick={() => setPlaying(false)} />
          ) : (
            <PlayIcon onClick={handlePlayingClick} />
          )}
        </Icon>
        <Icon>
          <SkipForwardIcon onClick={handleNextClick} />
        </Icon>
      </PlayContainer>
      <ControlContainer>
        <Description htmlFor='delay'>Delay:</Description>
        <Input
          id='delay'
          name='delay'
          value={`${delayAmount / 1000}`}
          onChange={(e) => setDelayAmount(Number(e.target.value) * 1000)}
          type='number'
          min={0.1}
          step={0.1}
          max={3}
        />
      </ControlContainer>
      <ControlContainer>
        <Description htmlFor='amount'>Vertex Amount:</Description>
        <Input
          id='amount'
          name='amount'
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          type='number'
          min={3}
          step={1}
          max={TOTAL_POINTS / 5} // Accept less than a fifth of the total possible amount of points
        />
      </ControlContainer>
      <Button color='secondary' onClick={randomize}>
        Randomize
      </Button>
    </Container>
  );
}

export default Controls;
