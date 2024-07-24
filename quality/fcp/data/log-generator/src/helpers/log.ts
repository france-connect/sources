export function debug(data: string): void {
  // eslint-disable-next-line no-console
  console.log(` * ${data}`);
}

export function warn(data: string): void {
  // eslint-disable-next-line no-console
  console.warn(` > ${data}`);
}
