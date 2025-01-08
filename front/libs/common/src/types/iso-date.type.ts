type TYear = `${number}${number}${number}${number}`;
type TMonth = `${number}${number}`;
type TDay = `${number}${number}`;
type THours = `${number}${number}`;
type TMinutes = `${number}${number}`;
type TSeconds = `${number}${number}`;
type TMilliseconds = `${number}${number}${number}`;

type TDateISODate = `${TYear}-${TMonth}-${TDay}`;
type TDateISOTime = `${THours}:${TMinutes}:${TSeconds}.${TMilliseconds}`;

export type ISODate = `${TDateISODate}T${TDateISOTime}Z`;
