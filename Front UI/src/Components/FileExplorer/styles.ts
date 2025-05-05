import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export const FileGrid = styled.div`
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-gutter: stable;
  flex: 1 100%;
  display: grid;
  padding: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(10em, 1fr));
  gap: 0.75em;
  justify-items: center;
  align-content: baseline;
`;

export const NoContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5em;
  gap: 1em;
`;