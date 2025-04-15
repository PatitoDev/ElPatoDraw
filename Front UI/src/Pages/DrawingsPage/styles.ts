import styled from 'styled-components';

export const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.colors.foreground };
  background-color: ${({ theme }) => theme.colors.background };
  user-select: none;
`;