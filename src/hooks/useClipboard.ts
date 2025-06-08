import { ref } from 'vue';

export function useClipboard() {
  const copied = ref(false);

  const copy = async (source: string) => {
    try {
      await navigator.clipboard.writeText(source);
      copied.value = true;
      setTimeout(() => {
        copied.value = false;
      }, 300);
    } catch (err) {
      console.error('[vue-json-pretty] Copy failed: ', err);
    }
  };

  return {
    copy,
  };
}
