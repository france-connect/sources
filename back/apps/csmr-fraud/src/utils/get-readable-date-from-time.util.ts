export function getReadableDateFromTime(timestamp: number): string {
  const date = new Date(timestamp);

  const readableDateTime = date.toLocaleString('fr-FR', {
    timeZone: 'Europe/Paris',
  });

  return readableDateTime;
}
