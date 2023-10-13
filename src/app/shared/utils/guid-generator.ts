export function generateGUIDFromId(id: number): string {
  // Constants for the Linear Congruential Generator (LCG)
  const LCG_MODULUS = 2147483647;  // 2^31 - 1: Largest 32-bit prime number
  const LCG_MULTIPLIER = 16807;    // Park–Miller random number generator

  let currentSeed = id % LCG_MODULUS;
  // Pseudo-random number generator using LCG formula
  const getNextRandomNumber = () => {
      currentSeed = (currentSeed * LCG_MULTIPLIER) % LCG_MODULUS;
      return currentSeed;
  };

  const generateGUIDSection = (digits: number) => {
      let sectionValue = '';
      for (let i = 0; i < digits; i++) {
          const hexDigit = getNextRandomNumber() % 16;
          sectionValue += hexDigit.toString(16);
      }
      return sectionValue;
  };

  return `${generateGUIDSection(8)}-${generateGUIDSection(4)}-4${generateGUIDSection(3)}-a${generateGUIDSection(3)}-${generateGUIDSection(12)}`;
}
