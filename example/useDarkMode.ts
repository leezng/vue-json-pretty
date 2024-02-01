import { inject, ref, watch } from 'vue';

export function useDarkMode() {
  const darkModeState = inject('darkModeState');
  const localDarkMode = ref(darkModeState.isDarkMode);

  watch(
    () => darkModeState.isDarkMode,
    newVal => {
      localDarkMode.value = newVal;
    },
  );

  const toggleLocalDarkMode = () => {
    darkModeState.isDarkMode = !darkModeState.isDarkMode;
  };

  return { localDarkMode, toggleLocalDarkMode };
}
