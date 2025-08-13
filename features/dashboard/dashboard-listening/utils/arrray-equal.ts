// pengecekan untuk kesamaan antara options / tempAnswer dengan answer

export function arrayEqual(a: string[], b: string[]) {
  if (a.length !== b.length) return false;
  const sortedA = [...a].sort();
  const sortedB = [...b].sort();

  return sortedA.every((val, i) => val === sortedB[i]);
}
