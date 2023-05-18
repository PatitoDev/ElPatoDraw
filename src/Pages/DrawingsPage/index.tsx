import { useEffect, useMemo, useState } from 'react';
import { Database } from '../../types/db';
import { Api } from '../../api';
import { Button, Flex, Tabs } from '@mantine/core';
import { DrawingList } from '../../Components/DrawingList';
import { Tables } from '../../types/tables';
import { DrawingView } from '../../Components/DrawingView';

const DrawingPage = () =>  {
  const [drawings, setDrawings] = useState<Array<Database['public']['Tables']['Drawing']['Row']>>([]);
  const [activeDrawingsIds, setActiveDrawingsIds] = useState<Array<number>>([]);
  const [selectedFileId, setSelectedFileId] = useState<number | null>(null);

  const activeDrawings = useMemo(() => 
    drawings.filter(item => activeDrawingsIds.includes(item.id)), 
  [activeDrawingsIds, drawings]);

  const selectedFile = useMemo(() => 
    drawings.find((item) => item.id === selectedFileId)
  , [drawings, selectedFileId]);

  useEffect(() => {
    (async () => {
      const drawings = await Api.getDrawings();
      setDrawings(drawings);
    })();
  }, []);

  const onTabChange = async (value: string) => {
    if (value === 'new') {
      const newDrawing = await Api.createNewDrawing();
      // TODO - add error handling
      if (!newDrawing) throw new Error();
      setDrawings((prev) => (
        [...prev, newDrawing]
      ));
      setActiveDrawingsIds((prev) => ([
        ...prev,
        newDrawing.id
      ]));
      setSelectedFileId(newDrawing.id);
      return;
    }

    const foundFile = drawings.find((file) => file.id.toString() === value);
    if (foundFile) {
      setSelectedFileId(foundFile.id);
      return;
    }
    setSelectedFileId(null);
  };

  const onDrawingClick = async (value: Tables['Drawing']['Row']) => {
    if (!activeDrawings.find((item) => item.id === value.id)) {
      setActiveDrawingsIds((prev) => ([
        ...prev,
        value.id
      ]));
      const drawing = await Api.getDrawing(value.id);
      if (!drawing) return;

      setDrawings((prev) => (
        prev.map((item) => item.id === drawing.id ? drawing : item)
      ));
    }
    setSelectedFileId(value.id);
  };

  const onDrawingClose = (value: Tables['Drawing']['Row']) => {
    setActiveDrawingsIds((prev) => (
      prev.filter((id) => id !== value.id)
    ));
    if (selectedFile?.id !== value.id) return;
    setSelectedFileId(null);
  };

  const onDrawingChange = (value: Tables['Drawing']['Row']) => {
    setDrawings((prev) => (
      prev.map(i => (i.id === value.id) ? value : i)
    ));
  };

  const onDrawingDelete = (id: number) => {
    setDrawings((prev) => (
      prev.filter((drawing) => drawing.id !== id)
    ));
    setActiveDrawingsIds((prev) => (
      prev.filter((activeId) => activeId !== id)
    ));
    if (selectedFileId === id) {
      setSelectedFileId(null);
    }
  };

  return (
    <Tabs display="flex" sx={{
      flexDirection: 'column',
    }} h="100%" defaultValue="gallery" value={selectedFile?.id.toString() ?? 'home'} onTabChange={onTabChange}>
      <Tabs.List>
        <Tabs.Tab value="home">All Files</Tabs.Tab>
        { activeDrawings.map((file) => (
          <Flex align="center" key={file.id}>
            <Tabs.Tab pr={5} key={file.id} value={file.id.toString()}>
              {file.name}
            </Tabs.Tab>
            <Flex 
              sx={ file.id === selectedFile?.id ? {
                borderBottom: '0.125rem solid transparent',
                borderColor: '#1971c2',
                marginBottom: '-0.25rem'
              } : {
                borderBottom: '0.125rem solid transparent',
                marginBottom: '-0.25rem'
              }}
              direction="column" h="100%" align="center" justify="center">
              <Button h="80%" px={10} variant='subtle' onClick={() => onDrawingClose(file)}>
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
        <DrawingList files={drawings} onFileClick={onDrawingClick} />
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