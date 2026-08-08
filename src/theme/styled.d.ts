import 'styled-components';
import type { AppTheme } from './theme';

declare module 'styled-components' {
  // The styled-components docs' own recommended pattern for typing the
  // theme is exactly this "empty interface extends" — it's what makes
  // `props.theme` resolve to AppTheme everywhere without re-declaring it.
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface DefaultTheme extends AppTheme {}
}
