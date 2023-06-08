export const removeOnFromArray = <T>(array: T[], callback: (value: T) => boolean): T[] => {
  const index = array.findIndex(callback);
  if (index !== -1) {
    array.splice(index, 1);
  }
  return array;
};
