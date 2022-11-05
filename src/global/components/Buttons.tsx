import React from 'react';
import styled from 'styled-components';
import colors from '../styles/colors';

import { darken } from '../styles/helpers';

const StyledButton = styled.button`
  color: ${colors.white};
  border: none;
  border-radius: 15px;
  background-color: ${colors.actionDark};
  font-size: 1.25rem;
  padding: 10px 25px;

  &:hover {
    ${darken(0.3)}
    cursor: pointer;
  }
`;

type ButtonProps = {
  children: string | undefined;
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

export function Button({ children, onClick }: ButtonProps): JSX.Element {
  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    onClick(e);
  };

  return <StyledButton onClick={handleClick}>{children}</StyledButton>;
}

export default Button;
