import styled, { keyframes } from 'styled-components';

const ShowBackdrop = keyframes`
  0% {
    opacity: 0.6;
  },
  100% {
    opacity: 1;
  }
`;

export const ModalContainer = styled.div`
  animation: ${ShowBackdrop} 0.2s;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 9999;
  background-color: rgba(0,0,0,0.5);
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 5em;
`;