import { useThemeStore } from '../../stores/themeStore';
import '../../app/styles/tokens.css';
import '../../app/styles/base.css';
import '../../app/styles/layout.css';
import '../../app/styles/utilities.css';

export function WorkbenchLayoutStylesNotice() {
  useThemeStore();
  return null;
}
