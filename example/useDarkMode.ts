import { inject, ref, watch } from 'vue';

export function useDarkMode() {
  const darkModeState = inject('darkModeState');
  const globalDarkModeState = ref(darkModeState.isDarkMode);
  const localDarkMode = ref(darkModeState.isDarkMode);

  watch(
    () => darkModeState.isDarkMode,
    newVal => {
      localDarkMode.value = newVal;
      globalDarkModeState.value = newVal;
    },
  );

  const toggleLocalDarkMode = () => {
    darkModeState.isDarkMode = !darkModeState.isDarkMode;
  };

  return { localDarkMode, toggleLocalDarkMode, globalDarkModeState };
}
