import { useEffect, useState } from 'react';
import { DrawingView } from '..';
import { Drawing } from '../../../types/Entity';
import { FileContentApi } from '../../../api/FileContentApi';
import styled, { keyframes } from 'styled-components';
import { Icon } from '@iconify/react';

export interface DrawingLoaderProps {
  id: string
}

const Spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1 100%;
  padding-top: 5em;
  font-size: 3em;
  > * {
    animation: ${Spin} 0.5s infinite linear;
  }
`;

const DrawingLoader = ({ id }: DrawingLoaderProps) => {
  const [result, setResult] = useState<{
    data?: Drawing,
    hasError?: boolean
  }>({});

  useEffect(() => {
    (async () => {
      try {
        setResult({});
        const data = await FileContentApi.getFileContent(id);
        setResult({ data, hasError: false });
      } catch {
        setResult({ hasError: true });
      }
    })();
  }, [id]);

  if (result.data) {
    return (
      <DrawingView
        drawing={result.data}
      />
    );
  }

  if (result.hasError) {
    return (
      <h2>Error loading drawing, try again later.</h2>
    );
  }

  return (
    <LoadingContainer>
      <Icon icon='mingcute:loading-fill' />
    </LoadingContainer>
  );
};

export default DrawingLoader;