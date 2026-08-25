// ─── Base de données pays : Zone CEMAC + RDC + Maroc ─────────────
export type Country = {
  flag: string;
  name: string;
  code: string;       // indicatif ex: +241
  iso: string;        // ISO 3166-1 alpha-2
  format: string;     // format visuel ex: "062 12 34 56"
  regex: RegExp;      // regex de validation
  maxDigits: number;  // nombre de chiffres attendus (sans indicatif)
  example: string;    // exemple de numéro
};

export const COUNTRIES: Country[] = [
  // ── 1. Gabon (CEMAC - Priorité #1) ──
  {
    flag: '🇬🇦',
    name: 'Gabon',
    code: '+241',
    iso: 'GA',
    format: '062 12 34 56',
    regex: /^0?[67]\d{7}$/,
    maxDigits: 9,
    example: '062 12 34 56',
  },
  // ── 2. Cameroun (CEMAC) ──
  {
    flag: '🇨🇲',
    name: 'Cameroun',
    code: '+237',
    iso: 'CM',
    format: '6 71 23 45 67',
    regex: /^6[25-9]\d{7}$/,
    maxDigits: 9,
    example: '6 71 23 45 67',
  },
  // ── 3. Congo (CEMAC) ──
  {
    flag: '🇨🇬',
    name: 'Congo',
    code: '+242',
    iso: 'CG',
    format: '06 123 4567',
    regex: /^0?[456]\d{7}$/,
    maxDigits: 9,
    example: '06 123 4567',
  },
  // ── 4. RDC (République Démocratique du Congo) ──
  {
    flag: '🇨🇩',
    name: 'RDC (Congo)',
    code: '+243',
    iso: 'CD',
    format: '081 234 5678',
    regex: /^0?[89][0-9]\d{7}$/,
    maxDigits: 9,
    example: '081 234 5678',
  },
  // ── 5. Guinée équatoriale (CEMAC) ──
  {
    flag: '🇬🇶',
    name: 'Guinée équatoriale',
    code: '+240',
    iso: 'GQ',
    format: '222 123 456',
    regex: /^[235]\d{8}$/,
    maxDigits: 9,
    example: '222 123 456',
  },
  // ── 6. République centrafricaine (CEMAC) ──
  {
    flag: '🇨🇫',
    name: 'République centrafricaine',
    code: '+236',
    iso: 'CF',
    format: '70 12 34 56',
    regex: /^[72]\d{7}$/,
    maxDigits: 8,
    example: '70 12 34 56',
  },
  // ── 7. Tchad (CEMAC) ──
  {
    flag: '🇹🇩',
    name: 'Tchad',
    code: '+235',
    iso: 'TD',
    format: '66 12 34 56',
    regex: /^[69]\d{7}$/,
    maxDigits: 8,
    example: '66 12 34 56',
  },
  // ── 8. Maroc (Partenaire exceptionnel) ──
  {
    flag: '🇲🇦',
    name: 'Maroc',
    code: '+212',
    iso: 'MA',
    format: '06 12 34 56 78',
    regex: /^0?[567]\d{8}$/,
    maxDigits: 9,
    example: '06 12 34 56 78',
  },
];

// ─── Formatage auto du numéro par pays ────────────────────────────────────────
export function formatPhoneForCountry(raw: string, country: Country): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.length === 0) return '';

  const template = country.example.replace(/[^0-9\s\-\(\)]/g, '');
  const positions = [...template].reduce<number[]>((acc, c, i) => {
    if (/[\s\-]/.test(c)) acc.push(i);
    return acc;
  }, []);

  let result = '';
  let digitIndex = 0;
  let templateIndex = 0;

  while (digitIndex < digits.length && digitIndex < country.maxDigits) {
    if (positions.includes(templateIndex)) {
      result += ' ';
      templateIndex++;
    } else {
      result += digits[digitIndex];
      digitIndex++;
      templateIndex++;
    }
  }
  return result.trim();
}

// ─── Validation stricte ────────────────────────────────────────────────────────
export function validatePhone(raw: string, country: Country): boolean {
  const digits = raw.replace(/\D/g, '');
  if (digits.length < 7) return false;
  return country.regex.test(digits) || country.regex.test('0' + digits);
}
