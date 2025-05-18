import { ref } from 'vue';

export type UseClipboardOptions = {
  source: string;
};

export function useClipboard({ source }: UseClipboardOptions) {
  const copied = ref(false);

  const copy = async () => {
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
};
