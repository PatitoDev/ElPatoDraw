import { useEffect, useState } from "react";
import { DrawingView, DrawingViewProps } from "..";
import { Drawing } from "../../../types/Entity";
import { Api } from "../../../api";
import { Flex, Loader } from "@mantine/core";

export interface DrawingLoaderProps extends Omit<DrawingViewProps, 'drawing'> {
  id: string
}

const DrawingLoader = ({ id, onTitleChange, onDelete  }: DrawingLoaderProps) => {
  const [result, setResult] = useState<{
    data?: Drawing,
    hasError?: boolean
  }>({});

  useEffect(() => {
    (async () => {
      try {
        setResult({});
        const data = await Api.getDrawing(id);
        setResult({ data, hasError: false });
      } catch {
        setResult({ hasError: true });
      }
    })();
  }, [id]);

  if (result.data) {
    return (
      <DrawingView drawing={result.data} onTitleChange={onTitleChange} onDelete={onDelete} />
    )
  }

  if (result.hasError) {
    return (
      <h2>Error loading drawing, try again later.</h2>
    );
  }

  return (
    <Flex justify='center' align='center' sx={{flex: '1 100%'}}>
      <Loader mt={50} size='xl'/>
    </Flex>
  )
};

export default DrawingLoader;