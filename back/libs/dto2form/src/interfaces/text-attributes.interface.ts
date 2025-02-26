export interface TextAttributesArguments {
  type?: string;
  order?: number;
}

export interface TextAttributes extends Required<TextAttributesArguments> {
  name: string;
}
