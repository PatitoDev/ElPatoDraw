import { useEffect } from 'react';

import * as S from './styles';
import { TabList } from './TabList';
import { TabContent } from './TabContent';
import { Modals } from '@Components/Modals';
import { ContextMenu } from '@Components/Core/ContextMenu';
import { useFileStore } from '@Store/useFileStore';
import { useFolderKeybinds } from '@Hooks/useExplorerKeybinds';

export const HomePage = () =>  {
  const changeToFolder = useFileStore(state => state.changeToFolder);
  useFolderKeybinds();

  useEffect(() => {
    changeToFolder(null);
  }, [changeToFolder]);

  // z index is there to fix issues with excalidraw flickering when loading
  return (
    <S.Container>
      <ContextMenu />
      <Modals />
      <TabList />
      <TabContent />
    </S.Container>
  );
};