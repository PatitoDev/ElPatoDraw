import { ActionIcon, CloseButton, Group, Menu, TextInput } from "@mantine/core";

export interface ToolbarProps {
  currentSearch?: string;
  onChangeSearch?: (newSearch: string) => void;
}

export const Toolbar = ({ currentSearch, onChangeSearch }: ToolbarProps) => {
  const Cancel = (
    <CloseButton
      variant="transparent"
      onClick={() => onChangeSearch && onChangeSearch('')}
      disabled={!currentSearch || currentSearch.length === 0}
      sx={{ ':disabled': { color: 'transparent' } }}
    />
  );
  return (
    <Group
      style={{
        justifyContent: 'center',
        marginLeft: '1rem',
        marginRight: '1rem',
      }}
    >
      <Group sx={{ flex: 1, justifyContent: 'center' }}>
        <TextInput
          sx={{ flex: 1, maxWidth: '540px' }}
          value={currentSearch || ''}
          onChange={(e) =>
            onChangeSearch && onChangeSearch(e.currentTarget.value)
          }
          placeholder="Search..."
          rightSection={Cancel}
        />
      </Group>
      <Menu position="bottom-end">
        <Menu.Target>
          <ActionIcon size="lg" variant="filled" aria-label="Options">
            <img alt="" src="/img/menu.svg" />
          </ActionIcon>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item
            component="a"
            href="https://github.com/PatitoDev/ElPatoDraw"
            target="_blank"
          >
            Star on GitHub
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Group>
  );
};