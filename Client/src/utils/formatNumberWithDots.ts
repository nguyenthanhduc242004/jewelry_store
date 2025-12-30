const formatNumberWithDots = (num: number | string): string => {
  const str = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return str;
};

export default formatNumberWithDots;

