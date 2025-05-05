import * as S from './styles';
import DrawingLoader from '@Components/FileViewer';
import { FileExplorer } from '@Components/FileExplorer';
import { useFileStore } from '@Store/useFileStore';

export const TabContent = () => {
  const openedFiles = useFileStore(state => state.openedFiles);
  const currentFolder = useFileStore(state => state.currentFolder);

  const focusedFileId = useFileStore(state => state.focusedFileId);

  return (
    <S.Container>
      { currentFolder && (
        <S.ListContainer style={{
          display: focusedFileId === null ? '' : 'none'
        }}>
          <FileExplorer />
        </S.ListContainer>
      )}

      {openedFiles.map(file => (
        <S.DrawingContainer key={file.id} style={{
          display: focusedFileId === file.id ? '' : 'none'
        }}>
          <DrawingLoader
            key={file.id}
            id={file.id}
            type={file.type}
          />
        </S.DrawingContainer>
      ))}
    </S.Container>
  );
};