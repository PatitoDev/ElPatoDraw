import { Card, Flex, Text } from '@mantine/core';
import { DrawingMetadata } from '../../types/Entity';

export interface DrawingListProps {
  files: Array<DrawingMetadata>,
  onFileClick: (id: string) => void,
}

const parseDate = (date: string) => (
  new Date(date).toLocaleDateString()
);

export const DrawingList = ({ files, onFileClick }: DrawingListProps) => {

  return (
    <Flex p="md" gap="sm" wrap="wrap">
      {files.map((file) => (
        <Card
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            transition: 'transform 0.3s, box-shadow 0.3s',
            boxShadow: 'inset 0 0 0 0px rgb(193 194 197 / 0%)',
            ':hover' : {
              cursor: 'pointer',
              boxShadow: 'inset 0 0 0 3px rgb(193 194 197 / 100%)',
              transform: 'scale(1.03)'
            }
          }}
          miw="min(15em, 100%)"
          key={file.id} 
          onClick={() => onFileClick(file.id)}>
          <Text weight='bold'>{file.name}</Text>
          <Text size="sm">{parseDate(file.created_at)}</Text>
        </Card>
      ))}
    </Flex>
  );
};