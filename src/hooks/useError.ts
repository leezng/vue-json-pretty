import { watchEffect } from 'vue';

type UseErrorOptions = {
  emitListener: boolean;
};

export function useError(message: string, { emitListener }: UseErrorOptions) {
  const emit = () => {
    throw new Error(`[VueJsonPretty] ${message}`);
  };

  watchEffect(() => {
    if (emitListener) {
      emit();
    }
  });

  return {
    emit,
  };
}
