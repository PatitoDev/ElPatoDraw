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
  justify-content: baseline;
  text-align: center;
  gap: 0.5em;
  font-size: 1em;
  padding: 1em;

  width: 10em;

  > svg {
    font-size: 3em;
    color: attr(data-color type(<color>));
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

  > :not(input) {
    pointer-events: none;
  }

  > input {
    padding: 0.5em;
    width: 100%;
    text-align: center;
    font-family: inherit;
    font-size: inherit;
    color: inherit;
    background-color: inherit;
    border: none;
    border-radius: 0.3em;
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.foreground };
    background: ${({ theme }) => theme.colors.background };
    height: 2em;
  }
`;

export const Name = styled.span`
  width: 100%;
  text-overflow: ellipsis;
  text-align: center;
  word-wrap: break-word;

  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
`;