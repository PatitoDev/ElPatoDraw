import {
  ActionIcon,
  Card,
  CloseButton,
  Group,
  Menu,
  SimpleGrid,
  Text,
  TextInput,
} from '@mantine/core';
import { DrawingMetadata } from '../../types/Entity';
import { useEffect, useState } from 'react';

export interface DrawingListProps {
  files: Array<DrawingMetadata>,
  onFileClick: (id: string) => void,
}

export interface ToolbarProps {
  currentSearch?: string;
  onChangeSearch?: (newSearch: string) => void;
}

const dateAsTimestamp = (date: string) => (
  new Date(date).valueOf()
);


const parseDate = (date: string) => (
  new Date(date).toLocaleDateString()
);

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

export const DrawingList = ({ files, onFileClick }: DrawingListProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const [sortedFiles, setSortedFiles] = useState<DrawingMetadata[]>([]);

  useEffect(() => {
    let realFiles: DrawingMetadata[];
    if (!searchQuery) {
      realFiles = [...files];
    } else {
      const lowerSearchQuery = searchQuery.toLocaleLowerCase();
      realFiles = files.filter(
        (f) => f.name.toLocaleLowerCase().indexOf(lowerSearchQuery) >= 0,
      );
    }
    realFiles.sort((a, b) => {
      const tsA = dateAsTimestamp(a.created_at);
      const tsB = dateAsTimestamp(b.created_at);
      return tsB - tsA;
    });
    setSortedFiles(realFiles);
  }, [searchQuery, files]);

  return (
    <>
      <Toolbar currentSearch={searchQuery} onChangeSearch={setSearchQuery} />
      <SimpleGrid
        sx={{
          padding: '1rem',
          gridTemplateColumns: 'repeat(auto-fit, minmax(15em, 1fr))',
        }}
        spacing="0.75rem"
      >
        {sortedFiles.map((file) => (
          <Card
            sx={{
              transition: 'transform 0.3s, box-shadow 0.3s',
              boxShadow: 'inset 0 0 0 0px rgb(193 194 197 / 0%)',
              ':hover': {
                cursor: 'pointer',
                boxShadow: 'inset 0 0 0 3px rgb(193 194 197 / 100%)',
                transform: 'scale(1.03)',
              },
            }}
            key={file.id}
            onClick={() => onFileClick(file.id)}
          >
            <Text weight="bold">{file.name}</Text>
            <Text size="sm">{parseDate(file.created_at)}</Text>
          </Card>
        ))}
      </SimpleGrid>
    </>
  );
};
