export const generateCSVContent = <T extends object>(data: T[]): string => {
  if (!data || data.length === 0) {
    return '';
  }

  const headers = Object.keys(data[0]);

  const dataRows = data.map((entry) => {
    // eslint-disable-next-line max-nested-callbacks
    const values = headers.map((header) => formatCSVValue(entry[header]));
    return values.join(',');
  });

  const csvContent = [headers.join(','), ...dataRows].join('\n');

  return csvContent;
};

const formatCSVValue = (value: unknown): string => {
  if (value === null || value === undefined) {
    return '';
  } else if (Array.isArray(value)) {
    const escapedValues = value.map((item) => escapeCSVString(String(item)));
    return escapedValues.join(';');
  }
  return escapeCSVString(String(value));
};

const escapeCSVString = (value: string): string => {
  if (value.includes(',') || value.includes('\n') || value.includes('"')) {
    const escapedValue = value.replace(/"/g, '""');
    return `"${escapedValue}"`;
  }
  return value;
};
