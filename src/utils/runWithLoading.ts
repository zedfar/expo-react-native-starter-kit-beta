/**
 * Wrapper untuk menyalakan & mematikan loading state otomatis
 * serta menangkap error callback opsional
 */
export const runWithLoading = async (
  setLoading: (v: boolean) => void,
  promise: Promise<any>,
  onError?: () => void
) => {
  try {
    setLoading(true);
    return await promise;
  } catch (e) {
    if (onError) onError();
    throw e; // throw lagi agar caller tahu error terjadi
  } finally {
    setLoading(false);
  }
};
