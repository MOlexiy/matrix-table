export const getPercentile = (data: number[], percentile: number): number => {
  if (data.length === 0) return 0;

  const sorted = [...data].sort((a, b) => a - b);

  const index = (percentile / 100) * (sorted.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);

  if (lower === upper) {
    return sorted[lower];
  }

  const weight = index - lower;
  return sorted[lower] + (sorted[upper] - sorted[lower]) * weight;
}