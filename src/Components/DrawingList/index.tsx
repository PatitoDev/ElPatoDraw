import { Card, Flex, Text } from '@mantine/core';
import { Tables } from '../../types/tables';

export interface DrawingListProps {
  files: Array<Tables['Drawing']['Row']>,
  onFileClick: (file: Tables['Drawing']['Row']) => void,
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
          onClick={() => onFileClick(file)}>
          <Text>{file.name}</Text>
          <Text>{parseDate(file.created_at)}</Text>
        </Card>
      ))}
    </Flex>
  );
};