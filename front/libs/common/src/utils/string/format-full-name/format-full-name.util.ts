interface FullNameInterface {
  firstname?: string;
  lastname?: string;
}

export const formatFullName = (person?: FullNameInterface): string => {
  if (!person) {
    return '-';
  }

  const parts = [person.firstname, person.lastname].filter(Boolean);

  return parts.length > 0 ? parts.join(' ') : '-';
};
