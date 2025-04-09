import styled from "styled-components";

export const Container = styled.div`
  flex: 1;
  height: 100%;

  display: flex;
  flex-direction: column;
`;

export const ListContainer = styled.div`
  height: 100%;
`

export const DrawingContainer = styled.div`
  height: 100%;
  border: solid ${({ theme }) => theme.colors.background} 5px;
  border-radius: 1em;
  overflow: hidden;
`;