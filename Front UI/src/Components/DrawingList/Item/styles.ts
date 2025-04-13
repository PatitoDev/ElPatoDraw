import styled, { css } from "styled-components";

export const Container = styled.div<{ $folderColor: string, $isSelected: boolean }>`
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
    color: ${(props) => (props.$folderColor)};
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

`;
