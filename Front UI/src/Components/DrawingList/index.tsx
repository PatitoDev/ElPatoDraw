import * as S from './styles';
import { ExplorerToolbar } from '../ExplorerToolbar';
import { Item } from './Item';
import { useFileStorageStore } from '../../Store/FileStorageStore';
import { useTheme } from 'styled-components';

export const DrawingList = () => {
  const gridRef = useFileStorageStore(state => state.itemContainerRef);
  const folder = useFileStorageStore(state => state.currentFolder);
  const theme = useTheme();

  return (
    <S.Container>
      <ExplorerToolbar />
      <S.FileGrid ref={gridRef}>
        { (!folder || (folder.files.length === 0 && folder.folders.length === 0)) && (
          <div>No items</div>
        )
        }
        {folder && folder.folders.map(f => (
          <Item
            id={f.id}
            key={f.id}
            color={f.color}
            name={f.name}
            type='Folder'
          />
        ))}

        {folder && folder.files.map(f => (
          <Item
            id={f.id}
            key={f.id}
            name={f.name}
            type='File'
            color={theme.colors.defaultFileColor}
          />
        ))}
      </S.FileGrid>
    </S.Container>
  );
};
