import 'styled-components';
import { ThemeType } from './ui/styles/theme';

declare module 'styled-components' {
  export interface DefaultTheme extends ThemeType {}
}
