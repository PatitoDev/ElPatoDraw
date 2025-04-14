import * as S from './styles';
import { useEffect } from 'react';
import { TabList } from './TabList';
import { useFileStorageStore } from '../../Store/FileStorageStore';
import { TabContent } from './TabContent';
import { Modals } from '../../Components/Modals';

const DrawingPage = () =>  {
  const changeToFolder = useFileStorageStore(state => state.changeToFolder);

  useEffect(() => {
    changeToFolder(null);
  }, []);

  // z index is there to fix issues with excalidraw flickering when loading
  return (
    <S.Container>
      <Modals />
      <TabList />
      <TabContent />
    </S.Container>
  );
};

export default DrawingPage;