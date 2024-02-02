import { inject, ref, watch } from 'vue';

export function useDarkMode() {
  const darkModeState = inject('darkModeState');
  const globalDarkModeState = ref(darkModeState.isDarkMode);
  const localDarkMode = ref(darkModeState.isDarkMode ? 'dark' : 'light');

  watch(
    () => darkModeState.isDarkMode,
    newVal => {
      localDarkMode.value = newVal ? 'dark' : 'light';
      globalDarkModeState.value = newVal;
    },
  );

  const toggleLocalDarkMode = () => {
    darkModeState.isDarkMode = !darkModeState.isDarkMode;
    localDarkMode.value = darkModeState.isDarkMode ? 'dark' : 'light';
  };

  return { localDarkMode, toggleLocalDarkMode, globalDarkModeState };
}
