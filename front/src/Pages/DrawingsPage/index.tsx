import { useEffect, useMemo, useState } from 'react';
import { Api } from '../../api';
import { Tabs } from '@mantine/core';
import { DrawingList } from '../../Components/DrawingList';
import { DrawingMetadata } from '../../types/Entity';
import DrawingLoader from '../../Components/DrawingView/DrawingLoader';
import DrawingTabs from './DrawingTabs';

const DrawingPage = () =>  {
  const [drawings, setDrawings] = useState<Array<{
    metadata: DrawingMetadata,
    isOpened: boolean
  }>>([]);
  const [selectedDrawingId, setSelectedDrawingId] = useState<string | null>(null);

  const selectedDrawing = useMemo(() => 
    drawings.find((item) => item.metadata.id === selectedDrawingId)
  , [selectedDrawingId, drawings]);

  useEffect(() => {
    (async () => {
      const drawingMetadata = await Api.getDrawings();
      setDrawings(drawingMetadata.map(metadata => ({
        isOpened: false,
        metadata
      })));
    })();
  }, []);

  const onTabChange = async (value: string) => {
    // value here can be the id of the file or 'new' which would mean a new file
    // we could make this clearer
    if (value === 'new') {
      // TODO - add loading state
      const newDrawing = await Api.createNewDrawing();
      // TODO - add error handling
      if (!newDrawing) throw new Error();

      setDrawings((items) => ([
        ...items,
        {
          isOpened: true,
          metadata: {
            id: newDrawing.id,
            name: newDrawing.name,
            created_at: newDrawing.created_at
          },
        }
      ]));

      setSelectedDrawingId(newDrawing.id);
      return;
    }

    const drawing = drawings.find(item => item.metadata.id === value);
    if (!drawing) {
      setSelectedDrawingId(null);
      return;
    }
    setSelectedDrawingId(drawing.metadata.id);
  };

  const onDrawingClick = async (id: string) => {
    const foundItem = drawings.find((item) => item.metadata.id === id);
    if (!foundItem) throw new Error('Client data not up to date, reload please');

    setSelectedDrawingId(foundItem.metadata.id);
    if (!foundItem.isOpened) {
      // if its not opened then we open it and load the data
      setDrawings((items) => (items.map(item => item.metadata.id !== id ? item : {
        ...item,
        isOpened: true
      })));
    }
  };

  const onDrawingClose = (id: string) => {
    setDrawings((items) => items.map((item) => item.metadata.id !== id ? item : {
      ...item,
      isOpened: false
    }));
    if (selectedDrawingId !== id) return;
    setSelectedDrawingId(null);
  };

  const onDrawingChange = (value: DrawingMetadata) => {
    setDrawings(items => items.map(item => item.metadata.id !== value.id ? item : {
      ...item,
      metadata: value,
    }));
  };

  const onDrawingDelete = (id: string) => {
    setDrawings((prev) => prev.filter(item => item.metadata.id !== id));
    if (selectedDrawingId === id) {
      setSelectedDrawingId(null);
    }
  };

  const activeTabs = useMemo(() => (
    drawings.filter(item => item.isOpened).map(item => item.metadata)
  ), [drawings]);

  // z index is there to fix issues with excalidraw flickering when loading
  return (
    <Tabs display="flex" sx={{
      flexDirection: 'column',
    }} h="100%" defaultValue="gallery" value={selectedDrawing?.metadata.id?.toString() ?? 'home'} onTabChange={onTabChange}>

      <Tabs.List sx={{zIndex: 2}}>
        <DrawingTabs activeDrawings={activeTabs} onDrawingClose={onDrawingClose} selectedDrawingId={selectedDrawingId} />
      </Tabs.List>

      <Tabs.Panel h="100%" bg='#121212' value="home" pt="xs" sx={{ overflow: 'auto' }}>
        <DrawingList files={drawings.map((item) => item.metadata)} onFileClick={onDrawingClick} />
      </Tabs.Panel>

      { drawings.filter(item => item.isOpened).map((file) => (
        <Tabs.Panel sx={{ zIndex: 1 }} bg='#121212' key={file.metadata.id} h="100%" value={file.metadata.id.toString()} pt="xs">
          <DrawingLoader id={file.metadata.id} onTitleChange={onDrawingChange} onDelete={onDrawingDelete} />
        </Tabs.Panel>
      ))}
    </Tabs>
  );
};

export default DrawingPage;