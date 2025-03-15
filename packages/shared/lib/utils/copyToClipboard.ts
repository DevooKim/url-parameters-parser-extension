export const copyToClipboard = async (data: string): Promise<boolean> => {
  if (!navigator?.clipboard) {
    console.warn('Clipboard not supported');
    return false;
  }

  if (typeof data !== 'string') {
    console.warn('Invalid data type. Expected a string.');
    return false;
  }

  try {
    await navigator.clipboard.writeText(data);
  } catch (error) {
    console.warn('Copy failed', error);
    return false;
  }

  return true;
};
