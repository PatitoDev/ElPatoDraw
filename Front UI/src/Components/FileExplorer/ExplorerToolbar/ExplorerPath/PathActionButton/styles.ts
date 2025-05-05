import styled, { css } from 'styled-components';


export const PathButton = styled.button<{ $isDraggingOver: boolean }>`
  color: inherit;
  opacity: 0.8;
  font-size: inherit;
  font-family: inherit;
  outline: none;
  border-radius: 0.3em;
  padding: 0.5em 0.5em;
  margin: 0 -0.4em;
  background-color: inherit;
  border: none;

  transition:
    opacity 0.2s ease-in-out,
    background-color 0.2s ease-in-out
  ;

  &:hover {
    opacity: 1;
    cursor: pointer;
    background-color: ${({ theme }) => theme.colors.backgroundLight};
    color: white;
  }

  ${({ $isDraggingOver }) => $isDraggingOver && css`
    margin: -2px calc(-0.4em - 2px);
    border: dashed 2px;
  `}
`;