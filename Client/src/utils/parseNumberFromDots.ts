const parseNumberFromDots = (value: string | number): number => {
  if (typeof value === "number") return value;
  return Number(value.replace(/\./g, ""));
};

export default parseNumberFromDots;

