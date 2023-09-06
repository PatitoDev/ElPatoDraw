import { useEffect, useMemo, useState } from 'react';
import { Api } from '../../api';
import { Button, Flex, Tabs } from '@mantine/core';
import { DrawingList } from '../../Components/DrawingList';
import { DrawingView } from '../../Components/DrawingView';
import { Drawing, DrawingMetadata } from '../../types/Entity';

const DrawingPage = () =>  {
  const [drawingsMetadata, setDrawingsMetadata] = useState<Array<DrawingMetadata>>([]);
  const [activeDrawings, setActiveDrawings] = useState<Array<Drawing>>([]);
  const [selectedDrawingId, setSelectedDrawingId] = useState<string | null>(null);

  const selectedDrawing = useMemo(() => 
    activeDrawings.find((item) => item.id === selectedDrawingId)
  , [activeDrawings, selectedDrawingId]);

  useEffect(() => {
    (async () => {
      const drawingMetadata = await Api.getDrawings();
      setDrawingsMetadata(drawingMetadata);
    })();
  }, []);

  const onTabChange = async (value: string) => {
    if (value === 'new') {
      const newDrawing = await Api.createNewDrawing();
      // TODO - add error handling
      if (!newDrawing) throw new Error();
      setDrawingsMetadata((prev) => (
        [...prev, {
          id: newDrawing.id,
          name: newDrawing.name,
          created_at: newDrawing.created_at
        }]
      ));
      setActiveDrawings((prev) => ([
        ...prev,
        newDrawing
      ]));
      setSelectedDrawingId(newDrawing.id);
      return;
    }
    const foundFile = activeDrawings.find((file) => file.id.toString() === value);
    if (foundFile) {
      setSelectedDrawingId(foundFile.id);
      return;
    }
    setSelectedDrawingId(null);
  };

  const onDrawingClick = async (id: string) => {
    if (!activeDrawings.find((item) => item.id === id)) {
      // can't be found active so we download it
      const drawing = await Api.getDrawing(id);
      if (!drawing) return;
      setActiveDrawings((prev) => ([
        ...prev,
        drawing
      ]));

      setDrawingsMetadata((prev) => (
        prev.map((item) => item.id === drawing.id ? {
          id: drawing.id,
          name: drawing.name,
          created_at: drawing.created_at
        } : item)
      ));
    }
    setSelectedDrawingId(id);
  };

  const onDrawingClose = (id: string) => {
    setActiveDrawings((prev) => (
      prev.filter((drawing) => drawing.id !== id)
    ));
    if (selectedDrawingId !== id) return;
    setSelectedDrawingId(null);
  };

  const onDrawingChange = (value: Drawing) => {
    setDrawingsMetadata((prev) => (
      prev.map(i => (i.id === value.id) ? {
        id: value.id,
        name: value.name,
        created_at: value.created_at
      } : i)
    ));
    setActiveDrawings((prev) => (
      prev.map(i => (i.id === value.id) ? value: i)
    ));
  };

  const onDrawingDelete = (id: string) => {
    setDrawingsMetadata((prev) => (
      prev.filter((drawing) => drawing.id !== id)
    ));
    setActiveDrawings((prev) => (
      prev.filter((drawing) => drawing.id !== id)
    ));
    if (selectedDrawingId === id) {
      setSelectedDrawingId(null);
    }
  };

  return (
    <Tabs display="flex" sx={{
      flexDirection: 'column',
    }} h="100%" defaultValue="gallery" value={selectedDrawing?.id?.toString() ?? 'home'} onTabChange={onTabChange}>
      <Tabs.List>
        <Tabs.Tab value="home">All Files</Tabs.Tab>
        { activeDrawings.map((file) => (
          <Flex align="center" key={file.id}>
            <Tabs.Tab pr={5} key={file.id} value={file.id.toString()}>
              {file.name}
            </Tabs.Tab>
            <Flex 
              sx={ file.id === selectedDrawing?.id ? {
                borderBottom: '0.125rem solid transparent',
                borderColor: '#1971c2',
                marginBottom: '-0.25rem'
              } : {
                borderBottom: '0.125rem solid transparent',
                marginBottom: '-0.25rem'
              }}
              direction="column" h="100%" align="center" justify="center">
              <Button h="80%" px={10} variant='subtle' onClick={() => onDrawingClose(file.id)}>
              ❌
              </Button>
            </Flex>
          </Flex>
        ))}
        <Tabs.Tab value="new">
            +
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel h="100%" bg='#121212' value="home" pt="xs">
        <DrawingList files={drawingsMetadata} onFileClick={onDrawingClick} />
      </Tabs.Panel>

      { activeDrawings.map((file) => (
        <Tabs.Panel bg='#121212' key={file.id} h="100%" value={file.id.toString()} pt="xs">
          <DrawingView drawing={file} 
            onChange={onDrawingChange} 
            onDelete={onDrawingDelete} 
          />
        </Tabs.Panel>
      ))}
    </Tabs>
  );
};

export default DrawingPage;