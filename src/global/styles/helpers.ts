import { css } from 'styled-components';

export const lighten = (value: number) => css`
  filter: brightness(${value + 1});
`;

export const darken = (value: number) => css`
  filter: brightness(${1 - value});
`;
