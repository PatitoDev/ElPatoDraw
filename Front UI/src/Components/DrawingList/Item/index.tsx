import { useFileStorageStore } from '../../../Store/FileStorageStore';
import { DuckFolder } from './DuckFolder';
import * as S from './styles';
import { Icon } from '@iconify/react';

export interface ItemProps {
  id: string,
  name: string,
  color: string,
  type: 'File' | 'Folder';
}

export const Item = ({
  id,
  name,
  color,
  type,
}: ItemProps) => {
  const isSelected = useFileStorageStore(state => 
    !!state.selectedItemIds.find(selectedId => selectedId === id)
  );
  const clearSelection = useFileStorageStore(state => state.clearSelection);
  const addToSelection = useFileStorageStore(state => state.addToSelection);
  const removeFromSelection = useFileStorageStore(state => state.removeFromSelection);
  const openFile = useFileStorageStore(state => state.openFile);
  const openFolder = useFileStorageStore(state => state.changeToFolder);

  const handleOpen = () => {
    type === 'Folder' ? openFolder(id) : openFile(id)
  }

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    return;
    console.log('clicked');
    e.stopPropagation();
    if (!e.ctrlKey)
      clearSelection();

    (e.ctrlKey && isSelected) ? removeFromSelection(id) : addToSelection(id);
  }

  return (
    <S.Container
      data-id={id}
      data-droppable={type === 'Folder'}
      onDoubleClick={handleOpen}
      onClick={handleClick}
      $folderColor={color}
      $isSelected={isSelected}
    >
      { type === 'Folder' && <DuckFolder color={color} /> }
      { type === 'File' && <Icon icon="mingcute:file-fill" /> }
      {name}
    </S.Container>
  )
}