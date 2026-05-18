export const getRandomNumberStringWithLength = (
  length: number,
  paddingLength = 0,
): string => {
  const max = 10 ** length;
  return String(Math.floor(Math.random() * max)).padStart(paddingLength, '0');
};

const luhnChecksum = (num: string): number => {
  let sum = 0;
  let shouldDouble = true;

  for (let i = num.length - 1; i >= 0; i--) {
    let digit = parseInt(num[i], 10);

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return (10 - (sum % 10)) % 10;
};

export const generateSiren = (): string => {
  const base = String(Math.floor(Math.random() * 1_0000_0000)).padStart(8, '0');
  const checksum = luhnChecksum(base);
  return base + checksum;
};

const generateNic = (siren: string): string => {
  const base = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
  const checksum = luhnChecksum(siren + base);
  return base + checksum;
};

export const generateSiret = (): string => {
  const siren = generateSiren();
  return siren + generateNic(siren);
};
