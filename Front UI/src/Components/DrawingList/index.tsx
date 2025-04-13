import * as S from './styles';
import { ExplorerToolbar } from '../ExplorerToolbar';
import { Item } from './Item';
import { useFileStorageStore } from '../../Store/FileStorageStore';
import { useTheme } from 'styled-components';
import { SelectionBox } from '../SelectionBox';
import { useEffect, useRef } from 'react';
import { Icon } from '@iconify/react';

export const DrawingList = () => {
  const gridRef = useFileStorageStore(state => state.itemContainerRef);
  const folder = useFileStorageStore(state => state.currentFolder);
  const theme = useTheme();
  const loadCounter = useRef<number>(0);

  useEffect(() => {
    loadCounter.current = 0;
  }, [folder?.metadata?.id]);

  loadCounter.current += 1;
  // item index sets the animation delay, but we only want to have some animation delay on the 'first' folder load
  // so after that we disable the delay so that when the user adds a file/folder there is no animation delay

  return (
    <S.Container>

      <ExplorerToolbar />
      { (!folder || (folder.files.length === 0 && folder.folders.length === 0)) && (
        <S.NoContent>
          <Icon fontSize="3em" icon="mingcute:folder-open-2-line" />
          <span>This folder is empty</span>
        </S.NoContent>
      )}
      <S.FileGrid ref={gridRef}>
        <SelectionBox />

        {folder && folder.folders.map((f, index) => (
          <Item
            index={loadCounter.current < 1 ? index : 0}
            id={f.id}
            key={f.id}
            color={f.color ?? theme.colors.defaultFolderColor}
            name={f.name}
            type='Folder'
          />
        ))}

        {folder && folder.files.map((f, index) => (
          <Item
            index={loadCounter.current < 1 ? index + folder.folders.length : 0}
            id={f.id}
            key={f.id}
            name={f.name}
            type='File'
            color={f.color ?? theme.colors.defaultFileColor}
          />
        ))}
      </S.FileGrid>
    </S.Container>
  );
};
