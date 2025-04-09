import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5em;
`;

export const PathButton = styled.button`
  color: inherit;
  opacity: 0.8;
  font-size: inherit;
  font-family: inherit;
  outline: none;
  border-radius: 0.3em;
  padding: 0.5em 0.8em;
  margin: 0 -0.8em;
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
`;