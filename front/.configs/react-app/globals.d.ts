declare module '*.module.css' {
  const classes: { [key: string]: string };
  // eslint-disable-next-line import/no-default-export
  export default classes;
}

declare module '*.module.scss' {
  const classes: { [key: string]: string };
  // eslint-disable-next-line import/no-default-export
  export default classes;
}

declare module '*.svg' {
  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  // eslint-disable-next-line import/no-default-export
  export default content;
}

declare module '*.ttf';
declare module '*.eot';
declare module '*.gif';
declare module '*.png';
declare module '*.jpg';
declare module '*.css';
declare module '*.jpeg';
declare module '*.scss';
