import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import styled, { keyframes } from 'styled-components';

import { FileContentApi } from '@Api/FileContentApi';
import { FileType } from '@Types/File';
import { ExcalidrawEditor } from './ExcalidrawEditor';
import { TlDrawEditor } from './TlDrawEditor';

export interface FileLoaderProps {
  id: string,
  type: FileType
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

export const FileLoader = ({ id, type }: FileLoaderProps) => {
  const [state, setState] = useState<{
    isLoading: boolean,
    data: string | null,
    hasError: boolean
  }>({
    isLoading: true,
    data: null,
    hasError: false,
  });

  useEffect(() => {
    (async () => {
      try {
        setState({ isLoading: true, hasError: false, data: null });
        const resp = await FileContentApi.getFileContent(id);
        if (!resp.ok){
          setState({ hasError: true, isLoading: false, data: null });
          return;
        }

        const textContent = await resp.text();

        setState({
          hasError: false,
          isLoading: false,
          data: textContent
        });
      } catch (e) {
        console.error(e);

        setState({
          hasError: true,
          isLoading: false,
          data: null
        });
      }
    })();
  }, [id]);

  if (state.hasError) return (
    <h2>Error loading file, try again later.</h2>
  );

  if (state.isLoading) return (
    <LoadingContainer>
      <Icon icon='mingcute:loading-fill' />
    </LoadingContainer>
  );

  switch(type) {
  case 'Excalidraw':
    return (
      <ExcalidrawEditor
        id={id}
        initialData={state.data}
      />
    );
  case 'TlDraw':
    return (
      <TlDrawEditor
        id={id}
        initialData={state.data}
      />
    );
  }
};