// import original module declarations
import 'styled-components';


// and extend them!
declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      accent: string,

      foreground: string,
      foregroundLight: string,

      background: string,
      backgroundLight: string,

      defaultFolderColor: string,
      defaultFileColor: string,

      notSelectedTabColor: string
      notSelectedTabBackground: string

      selectionBoxBackground: string
      selectionBoxBorderColor: string
    };
  }
}