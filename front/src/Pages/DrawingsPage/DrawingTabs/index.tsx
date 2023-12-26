import { Button, Flex, Tabs } from "@mantine/core";
import { DrawingMetadata } from "../../../types/Entity";

interface DrawingTabsProps {
  activeDrawings: Array<DrawingMetadata>,
  selectedDrawingId: string | null,
  onDrawingClose: (id:string) => void
}

const DrawingTabs = ({ activeDrawings, selectedDrawingId, onDrawingClose }: DrawingTabsProps) => (
  <>
    <Tabs.Tab value="home">All Files</Tabs.Tab>
    { activeDrawings.map((metadata) => (
      <Flex align="center" key={metadata.id}>
        <Tabs.Tab pr={5} key={metadata.id} value={metadata.id.toString()}>
          {metadata.name}
        </Tabs.Tab>
        <Flex 
          sx={ metadata.id === selectedDrawingId ? {
            borderBottom: '0.125rem solid transparent',
            borderColor: '#1971c2',
          } : {
            borderBottom: '0.125rem solid transparent',
          }}
          direction="column" h="100%" align="center" justify="center">
          <Button  px={10} variant='subtle' onClick={() => onDrawingClose(metadata.id)}>
            <img height='18' width='18' src='/img/close.svg'></img>
          </Button>
        </Flex>
      </Flex>
    ))}
    <Tabs.Tab value="new">
        <img height='18' width='18' src='/img/plus.svg'></img>
    </Tabs.Tab>
  </>
);

export default DrawingTabs;