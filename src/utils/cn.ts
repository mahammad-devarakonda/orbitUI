export type ClassValue = string | number | boolean | undefined | null | { [key: string]: any } | ClassValue[];

export function cn(...inputs: ClassValue[]): string {
  const classes: string[] = [];

  const process = (val: ClassValue) => {
    if (!val) return;
    if (typeof val === 'string' || typeof val === 'number') {
      classes.push(String(val).trim());
    } else if (Array.isArray(val)) {
      val.forEach(process);
    } else if (typeof val === 'object') {
      Object.keys(val).forEach((key) => {
        if (val[key]) {
          classes.push(key.trim());
        }
      });
    }
  };

  inputs.forEach(process);
  
  // Deduplicate and join with standard spaces
  return classes.filter((v, i, a) => v !== '' && a.indexOf(v) === i).join(' ');
}
