import * as S from './styles';
import { ActionToolbar } from "./ActionToolbar"
import { ExplorerPath } from "./ExplorerPath"

export const ExplorerToolbar = () => {

  return (
    <S.Container>
      <ExplorerPath />
      <ActionToolbar />
    </S.Container>
  )
}