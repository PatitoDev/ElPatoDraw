import * as S from './styles';
import { DrawingList } from '../../../Components/DrawingList';
import DrawingLoader from '../../../Components/DrawingView/DrawingLoader';
import { useFileStorageStore } from '../../../Store/FileStorageStore';

export const TabContent = () => {
  const activeFiles = useFileStorageStore(state => state.activeFiles);
  const currentFolder = useFileStorageStore(state => state.currentFolder);

  const fileIdCurrentlyEditing = useFileStorageStore(state => state.fileIdCurrentlyEditing);


  return (
    <S.Container>
      { currentFolder && (
        <S.ListContainer style={{ 
          display: fileIdCurrentlyEditing === null ? '' : 'none'
        }}>
          <DrawingList />
        </S.ListContainer>
      )}

      {activeFiles.map(file => (
        <S.DrawingContainer key={file.id} style={{ 
          display: fileIdCurrentlyEditing === file.id ? '' : 'none'
        }}>
          <DrawingLoader
            key={file.id}
            id={file.id}
          />
        </S.DrawingContainer>
      ))}
    </S.Container>
  );
};