import React from 'react';
import styled from 'styled-components';
import colors from '../../global/styles/colors';

import { ReactComponent as PlayIcon } from '../../assets/icons/play.svg';
import { ReactComponent as SkipBackIcon } from '../../assets/icons/skip-back.svg';
import { ReactComponent as SkipForwardIcon } from '../../assets/icons/skip-forward.svg';

import { Button } from '../../global/components/Buttons';

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

const ControlContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Description = styled.span`
  font-size: 1.5rem;
  color: ${colors.white};
`;

const Input = styled.span`
  font-size: 1.5rem;
  color: ${colors.secondary};
`;

function Controls(): JSX.Element {
  return (
    <Container>
      <PlayContainer>
        <SkipBackIcon />
        <PlayIcon />
        <SkipForwardIcon />
      </PlayContainer>
      <ControlContainer>
        <Description>Speed:</Description>
        <Input>1x</Input>
      </ControlContainer>
      <ControlContainer>
        <Description>Edge Amount:</Description>
        <Input>10</Input>
      </ControlContainer>
      <Button
        color='secondary'
        onClick={(e) => {
          e.preventDefault();
        }}
      >
        Randomize
      </Button>
    </Container>
  );
}

export default Controls;
