import { useEffect, useState } from 'react';
import { DrawingView } from '..';
import { Drawing } from '../../../types/Entity';
import { FileContentApi } from '../../../api/FileContentApi';
import styled from 'styled-components';

export interface DrawingLoaderProps {
  id: string
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1 100%;
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
    <Container>
      Loading...
    </Container>
  );
};

export default DrawingLoader;