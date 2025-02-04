import { differenceInMonths, differenceInYears } from "date-fns";

export const calculateAge = (dob: string | null): string => {
  if (!dob) return "N/A";
  
  const birthDate = new Date(dob);
  const today = new Date();
  
  const years = differenceInYears(today, birthDate);
  const months = differenceInMonths(today, birthDate) % 12;
  
  if (years === 0) {
    return `${months} months`;
  } else if (months === 0) {
    return `${years} years`;
  } else {
    return `${years}.${Math.floor((months / 12) * 10)} years`;
  }
};