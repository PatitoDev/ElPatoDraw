import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export const FileGrid = styled.div`
  flex: 1 100%;
  display: grid;
  padding: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(10em, 1fr));
  gap: 0.75em;
  justify-items: center;
  align-content: baseline;
`;