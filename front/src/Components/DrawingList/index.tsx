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
            ':hover' : {
              cursor: 'pointer',
              outline: 'solid 1px white',
            }
          }}
          miw="20em"
          key={file.id} 
          onClick={() => onFileClick(file.id)}>
          <Text>{file.name}</Text>
          <Text>{parseDate(file.created_at)}</Text>
        </Card>
      ))}
    </Flex>
  );
};