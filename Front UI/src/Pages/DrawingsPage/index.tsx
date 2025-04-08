import { useEffect, useState } from 'react';
import { Tabs } from '@mantine/core';
import { DrawingList } from '../../Components/DrawingList';
import DrawingLoader from '../../Components/DrawingView/DrawingLoader';
import DrawingTabs from './DrawingTabs';
import { MetadataApi } from '../../api/MetadataApi';
import { FileChild, Folder } from '../../types/File';

const DrawingPage = () =>  {
  const [folder, setFolder] = useState<Folder | null>(null);
  const [activeFiles, setActiveFiles] = useState<Array<FileChild>>([]);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const homeFolder = await MetadataApi.getFolder();
      if (!homeFolder) return; // TODO - handle error
      setFolder(homeFolder);
    })();
  }, []);

  const onTabChange = async (value: string) => {
    // value here can be the id of the file or 'new' which would mean a new file
    // we could make this clearer
    if (value === 'new') {
      const createdFileId = await MetadataApi.createFile('New Drawing', 'Excalidraw');
      const homeFolder = await MetadataApi.getFolder();
      if (!homeFolder) return; // TODO - handle error
      console.log(createdFileId, homeFolder);
      setFolder(homeFolder);
      const newFile = homeFolder.files.find(f => f.id === createdFileId);
      if (!newFile) return;
      setActiveFiles(prev => [...prev, newFile]);
      setSelectedFileId(createdFileId);
      return;
    }

    const targetFile = activeFiles.find(item => item.id === value);
    if (!targetFile) {
      setSelectedFileId(null);
      return;
    }
    setSelectedFileId(targetFile.id);
  };

  const onDrawingClick = async (id: string) => {
    if (!folder) return;

    const foundItem = folder.files.find((item) => item.id === id);
    if (!foundItem) throw new Error('Client data not up to date, reload please');

    const alreadyInTabList = activeFiles.find(item => item.id === id);
    if (!alreadyInTabList) {
      setActiveFiles(prev => [...prev, foundItem]);
    }

    setSelectedFileId(foundItem.id);
  };

  const onDrawingClose = (id: string) => {
    setActiveFiles(prev => prev.filter(item => item.id !== id));
    if (selectedFileId !== id) return;
    setSelectedFileId(null);
  };

  const onDrawingNameChange = async (id: string, name: string) => {
    var file = activeFiles.find(f => f.id === id);
    if (!file) return;
    await MetadataApi.updateFiles([{
      id: id,
      name,
      // TODO - add parent folder id
    }])

    const homeFolder = await MetadataApi.getFolder();
    if (!homeFolder) return; // TODO - handle error
    setFolder(homeFolder);

    setActiveFiles(prev => prev.map(f => f.id !== id ? f : {
      ...f,
      name
    }));
  };

  const onDrawingDelete = async (id: string) => {
    await MetadataApi.deleteFiles([id]);
    if (selectedFileId === id)
      setSelectedFileId(null);
    setActiveFiles(prev => prev.filter(f => f.id !== id));

    const homeFolder = await MetadataApi.getFolder();
    if (!homeFolder) return; // TODO - handle error
    setFolder(homeFolder);
  };

  // z index is there to fix issues with excalidraw flickering when loading
  return (
    <Tabs 
      display="flex"
      sx={{ flexDirection: 'column' }}
      h="100%" 
      defaultValue="gallery" 
      value={selectedFileId ?? 'home'} 
      onTabChange={onTabChange}
    >
      <Tabs.List sx={{zIndex: 2}}>
        <DrawingTabs 
          tabs={activeFiles}
          selectedTabId={selectedFileId} 
          onTabClose={onDrawingClose} 
        />
      </Tabs.List>

      <Tabs.Panel h="100%" bg='#121212' value="home" pt="xs" sx={{ overflow: 'auto' }}>
        { folder && (
          <DrawingList 
            onFileClick={onDrawingClick}
            folder={folder}
          />
        )}
      </Tabs.Panel>

      { activeFiles.map((file) => (
        <Tabs.Panel sx={{ zIndex: 1 }} bg='#121212' key={file.id} h="100%" value={file.id.toString()} pt="xs">
          <DrawingLoader 
            id={file.id} 
            onTitleChange={onDrawingNameChange} 
            onDelete={onDrawingDelete}
          />
        </Tabs.Panel>
      ))}
    </Tabs>
  );
};

export default DrawingPage;