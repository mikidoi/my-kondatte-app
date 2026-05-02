const PLACEHOLDER_COLORS: [string, string][] = [
  ["#c8a46a", "#a07840"],
  ["#7ab87a", "#3a8a3a"],
  ["#c87a7a", "#a04040"],
  ["#7ab8d4", "#3a7a9a"],
  ["#a0b87a", "#5a7a3a"],
  ["#d4a44a", "#a07820"],
];

function getPlaceholderColors(id: number): [string, string] {
  return PLACEHOLDER_COLORS[id % PLACEHOLDER_COLORS.length];
}

export default getPlaceholderColors;
