declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.svg' {
  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
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
