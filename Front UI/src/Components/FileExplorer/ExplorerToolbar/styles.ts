import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5em 1em;
  flex-wrap: wrap;
  position: relative;
  z-index: 2;
  background-color: ${({ theme }) => theme.colors.background};
`;