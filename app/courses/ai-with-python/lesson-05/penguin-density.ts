// Seaborn pairplot defaults: Gaussian KDE, Scott bandwidth, 200 samples,
// support extended by three bandwidths, and common normalization across kinds.
export function estimateDensity(values: readonly number[], totalCount: number) {
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  const variance =
    values.reduce((sum, value) => sum + (value - mean) ** 2, 0) /
    (values.length - 1);
  const bandwidth = Math.sqrt(variance) * values.length ** -0.2;
  const low = Math.min(...values) - 3 * bandwidth;
  const high = Math.max(...values) + 3 * bandwidth;
  const normalizer = totalCount * bandwidth * Math.sqrt(2 * Math.PI);
  return {
    bandwidth,
    points: Array.from({ length: 200 }, (_, i) => {
      const value = low + ((high - low) * i) / 199;
      const density =
        values.reduce(
          (sum, sample) =>
            sum + Math.exp(-0.5 * ((value - sample) / bandwidth) ** 2),
          0,
        ) / normalizer;
      return { value, density };
    }),
  };
}
