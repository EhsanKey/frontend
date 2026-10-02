const persianDateFormatter = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

const persianTimeFormatter = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

const persianFullDateFormatter = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

export const formatPersianDate = (value: string): string => {
  if (!value) {
    return '';
  }

  try {
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return value;
    }
    return persianDateFormatter.format(date);
  } catch {
    return value;
  }
};

export const formatPersianTime = (value: string): string => {
  if (!value) {
    return '';
  }

  try {
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return '';
    }
    return persianTimeFormatter.format(date);
  } catch {
    return '';
  }
};

export const formatPersianFullDate = (value: string): string => {
  if (!value) {
    return '';
  }

  try {
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return value;
    }
    return persianFullDateFormatter.format(date);
  } catch {
    return value;
  }
};

export const isSameDay = (date1Str?: string, date2Str?: string): boolean => {
  if (!date1Str || !date2Str) return false;
  try {
    const d1 = new Date(date1Str);
    const d2 = new Date(date2Str);
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return false;
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  } catch {
    return false;
  }
};
