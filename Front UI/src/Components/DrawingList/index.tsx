import * as S from './styles';
import { ExplorerToolbar } from '../ExplorerToolbar';
import { Item } from './Item';
import { useFileStorageStore } from '../../Store/FileStorageStore';
import { useTheme } from 'styled-components';
import { SelectionBox } from '../SelectionBox';
import { useEffect, useMemo, useRef } from 'react';
import { Icon } from '@iconify/react';
import { FileListFooter } from '../FileListFooter';

export const DrawingList = () => {
  const filteredValue = useFileStorageStore(state => state.filteredValue);
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

  const filteredFolder = useMemo(() => {
    const valueToSearch = filteredValue.trim().toLocaleLowerCase();
    const files = (folder?.files ?? []).filter(f =>
      f.name.toLocaleLowerCase().includes(valueToSearch)
    );

    const folders = (folder?.folders ?? []).filter(f =>
      f.name.toLocaleLowerCase().includes(valueToSearch)
    );

    return { files, folders };
  }, [filteredValue, folder]);

  return (
    <S.Container>

      <ExplorerToolbar />
      { (!folder || (folder.files.length === 0 && folder.folders.length === 0)) && (
        <S.NoContent>
          <Icon fontSize='3em' icon='mingcute:folder-open-2-line' />
          <span>This folder is empty</span>
        </S.NoContent>
      )}
      <S.FileGrid ref={gridRef}>
        <SelectionBox />

        {filteredFolder.folders.map((f, index) => (
          <Item
            index={loadCounter.current < 2 ? index : 0}
            id={f.id}
            key={f.id}
            color={f.color ?? theme.colors.defaultFolderColor}
            name={f.name}
            type='Folder'
          />
        ))}

        {filteredFolder.files.map((f, index) => (
          <Item
            index={loadCounter.current < 2 ? index + filteredFolder.folders.length : 0}
            id={f.id}
            key={f.id}
            name={f.name}
            type='File'
            color={f.color ?? theme.colors.defaultFileColor}
          />
        ))}
      </S.FileGrid>
      <FileListFooter />
    </S.Container>
  );
};
