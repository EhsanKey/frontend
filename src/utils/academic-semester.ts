/**
 * Academic Semester Calculation & Formatting Utility
 *
 * Implements Islamic Azad University & Iranian academic year and semester naming rules:
 * - Term 1 (نیمسال اول / مهر): Starts in Mehr (or late Shahrivar), exams in Dey.
 *   Submissions up to 2 months post-term (Dey + Bahman + Esfand) belong to Term 1.
 *   Code format: Y1 (e.g. 4041 for 1404-1405 Term 1).
 * - Term 2 (نیمسال دوم / بهمن): Starts in Bahman, classes/exams in Farvardin-Tir.
 *   Code format: (Y-1)2 (e.g. 4042 for 1404-1405 Term 2).
 * - Term 3 (دوره تابستان / تابستان): Tir-Shahrivar.
 *   Code format: (Y-1)3 (e.g. 4043 for 1404-1405 Term 3).
 */

export type AcademicTerm = 1 | 2 | 3;

export interface AcademicSemesterInfo {
  code: string;
  term: AcademicTerm;
  academicYear: number;
  label: string;
}

export function parseSemesterCode(code?: string | null): AcademicSemesterInfo | null {
  if (!code) return null;
  const cleanCode = code.trim();
  const num = parseInt(cleanCode, 10);
  if (isNaN(num) || cleanCode.length !== 4) return null;

  const termNum = num % 10;
  if (termNum !== 1 && termNum !== 2 && termNum !== 3) return null;

  const shortYear = Math.floor(num / 10);
  const fullYear = shortYear >= 300 ? 1000 + shortYear : 1400 + shortYear;
  const term = termNum as AcademicTerm;

  let label = '';
  if (term === 1) {
    label = `نیمسال اول ${fullYear}-${fullYear + 1} (مهر)`;
  } else if (term === 2) {
    label = `نیمسال دوم ${fullYear}-${fullYear + 1} (بهمن)`;
  } else {
    label = `دوره تابستان ${fullYear}-${fullYear + 1}`;
  }

  return {
    code: cleanCode,
    term,
    academicYear: fullYear,
    label,
  };
}

export function getJalaliDateParts(date: Date): { year: number; month: number; day: number } {
  const formatter = new Intl.DateTimeFormat('en-US-u-ca-persian', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });

  const parts = formatter.formatToParts(date);
  let year = 1404;
  let month = 7;
  let day = 1;

  for (const part of parts) {
    if (part.type === 'year') {
      year = parseInt(part.value, 10);
    } else if (part.type === 'month') {
      month = parseInt(part.value, 10);
    } else if (part.type === 'day') {
      day = parseInt(part.value, 10);
    }
  }

  return { year, month, day };
}

export function getAcademicSemester(dateInput?: Date | string | number | null): AcademicSemesterInfo {
  const date = dateInput ? new Date(dateInput) : new Date();
  const validDate = isNaN(date.getTime()) ? new Date() : date;
  const { year: jy, month: jm, day: jd } = getJalaliDateParts(validDate);

  if (jm >= 7 && jm <= 12) {
    // Mehr, Aban, Azar, Dey, Bahman, Esfand (Term 1 of academic year jy)
    const code = `${jy % 1000}1`;
    return {
      code,
      term: 1,
      academicYear: jy,
      label: `نیمسال اول ${jy}-${jy + 1} (مهر)`,
    };
  } else if (jm >= 1 && jm <= 4) {
    // Farvardin, Ordibehesht, Khordad, Tir (Term 2 of academic year jy - 1)
    const ay = jy - 1;
    const code = `${ay % 1000}2`;
    return {
      code,
      term: 2,
      academicYear: ay,
      label: `نیمسال دوم ${ay}-${ay + 1} (بهمن)`,
    };
  } else if (jm === 5 || (jm === 6 && jd <= 20)) {
    // Mordad and early/mid Shahrivar (Summer term of academic year jy - 1)
    const ay = jy - 1;
    const code = `${ay % 1000}3`;
    return {
      code,
      term: 3,
      academicYear: ay,
      label: `دوره تابستان ${ay}-${ay + 1}`,
    };
  } else {
    // Late Shahrivar (jd > 20): start of new academic year Mehr
    const code = `${jy % 1000}1`;
    return {
      code,
      term: 1,
      academicYear: jy,
      label: `نیمسال اول ${jy}-${jy + 1} (مهر)`,
    };
  }
}

export function formatSemesterCode(code?: string | null): string {
  if (!code) return 'نامشخص';
  const cleanCode = code.trim();
  const num = parseInt(cleanCode, 10);
  if (isNaN(num) || cleanCode.length !== 4) return cleanCode;

  const termNum = num % 10;
  const shortYear = Math.floor(num / 10);
  const fullYear = shortYear >= 300 ? 1000 + shortYear : 1400 + shortYear;

  if (termNum === 1) {
    return `نیمسال اول ${fullYear}-${fullYear + 1} (مهر)`;
  } else if (termNum === 2) {
    return `نیمسال دوم ${fullYear}-${fullYear + 1} (بهمن)`;
  } else if (termNum === 3) {
    return `دوره تابستان ${fullYear}-${fullYear + 1}`;
  }

  return cleanCode;
}

export function getRecentAcademicSemesters(count = 6): AcademicSemesterInfo[] {
  const current = getAcademicSemester(new Date());
  const results: AcademicSemesterInfo[] = [];

  let curYear = current.academicYear;
  let curTerm = current.term;

  for (let i = 0; i < count; i++) {
    const code = `${curYear % 1000}${curTerm}`;
    let label = '';
    if (curTerm === 1) {
      label = `نیمسال اول ${curYear}-${curYear + 1} (مهر)`;
    } else if (curTerm === 2) {
      label = `نیمسال دوم ${curYear}-${curYear + 1} (بهمن)`;
    } else {
      label = `دوره تابستان ${curYear}-${curYear + 1}`;
    }

    results.push({
      code,
      term: curTerm,
      academicYear: curYear,
      label,
    });

    if (curTerm === 3) {
      curTerm = 2;
    } else if (curTerm === 2) {
      curTerm = 1;
    } else {
      curTerm = 3;
      curYear -= 1;
    }
  }

  return results;
}

export function isValidSemesterCode(code: string): boolean {
  if (!code || typeof code !== 'string') return false;
  return /^[34]\d{2}[1-3]$/.test(code.trim());
}
