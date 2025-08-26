export const extractIndexes = (path: string) => {
  const parts = path.split(".");
  return {
    nestIndex: Number(parts[1]),
    questionGroupIndex: Number(parts[3]),
  };
};
