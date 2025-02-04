import { differenceInYears, differenceInMonths } from "date-fns";

export const calculateAge = (dob: Date | null): string => {
  if (!dob) return "N/A";
  
  const today = new Date();
  const years = differenceInYears(today, dob);
  const months = differenceInMonths(today, dob) % 12;
  
  if (years === 0) {
    return `${months} months`;
  } else if (months === 0) {
    return `${years} years`;
  } else {
    return `${years}.${months} years`;
  }
};