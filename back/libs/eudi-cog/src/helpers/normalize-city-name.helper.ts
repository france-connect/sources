import { LEADING_ARTICLES } from '../constants';

export function normalizeCityName(
  locality: string,
  keepArticle?: boolean,
): string {
  const withoutDiacritics = locality
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');

  const words = withoutDiacritics
    .toUpperCase()
    .replace(/Œ/g, 'OE')
    .replace(/['’-]/g, ' ')
    .split(' ')
    .filter(Boolean);

  const [first, ...rest] = words;

  if (!keepArticle && rest.length && LEADING_ARTICLES.includes(first)) {
    return rest.join(' ');
  }

  return words.join(' ');
}
