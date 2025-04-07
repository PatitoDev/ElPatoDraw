import { Button, Flex, Tabs } from "@mantine/core";

interface TabItem {
  id: string,
  name: string
}

interface DrawingTabsProps {
  tabs: Array<TabItem>,
  selectedTabId: string | null,
  onTabClose: (id:string) => void
}

const DrawingTabs = ({ onTabClose, selectedTabId, tabs }: DrawingTabsProps) => (
  <>
    <Tabs.Tab value="home">All Files</Tabs.Tab>
    { tabs.map(({ id, name }) => (
      <Flex align="center" key={id}>
        <Tabs.Tab pr={5} key={id} value={id.toString()}>
          {name}
        </Tabs.Tab>
        <Flex 
          sx={ id === selectedTabId ? {
            borderBottom: '0.125rem solid transparent',
            borderColor: '#1971c2',
          } : {
            borderBottom: '0.125rem solid transparent',
          }}
          direction="column" h="100%" align="center" justify="center">
          <Button  px={10} variant='subtle' onClick={() => onTabClose(id)}>
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