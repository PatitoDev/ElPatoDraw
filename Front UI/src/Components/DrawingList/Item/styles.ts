import styled, { css, keyframes } from "styled-components";

const appear = keyframes`
  0% {
    opacity: 0;
    transform: translateX(-10px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
`;

export const Container = styled.div<{ 
  $isSelected: boolean,
  $isHovering: boolean,
  $isDragging: boolean,
  $index: number
}>`
  animation: ${appear} 0.3s backwards;
  animation-delay: ${({ $index }) => $index * 20}ms;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5em;
  font-size: 1em;
  padding: 1em;

  width: 9em;
  height: 9em;

  > svg {
    font-size: 3em;
    color: attr(data-color);
  }

  cursor: pointer;
  border-radius: 0.5em;

  &:hover {
    background-color: ${({ theme }) => theme.colors.backgroundLight };
  }

  ${({ $isSelected }) => $isSelected && css`
    outline: solid 2px ${({ theme }) => theme.colors.foreground };
    background-color: ${({ theme }) => theme.colors.backgroundLight };
  `}

  ${({ $isDragging, $isHovering }) => $isDragging && !$isHovering && css`
    opacity: 0.5;
  `}

  ${({ $isHovering }) => $isHovering && css`
    outline: dashed 2px ${({ theme }) => theme.colors.foreground };
    > * {
      pointer-events: none;
    }
  `}

  > input {
    padding: 0.5em;
    width: 8em;
    text-align: center;
    font-family: inherit;
    font-size: inherit;
    color: inherit;
    background-color: inherit;
    outline: solid 1px white;
    border: none;
    border-radius: 0.3em;
  }
`;
