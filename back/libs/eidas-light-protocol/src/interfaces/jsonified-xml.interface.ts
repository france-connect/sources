export interface IJsonifiedXmlDeclarationAttributes {
  version: string;
  encoding: string;
  standalone: string;
}

export interface IJsonifiedXmlDeclaration {
  _attributes: IJsonifiedXmlDeclarationAttributes;
}

export interface IJsonifiedXmlContent {
  _text: string;
}

export interface IJsonifiedXml {
  [key: string]:
    | IJsonifiedXml
    | IJsonifiedXml[]
    | IJsonifiedXmlContent
    | IJsonifiedXmlContent[];
}

export interface IJsonifiedLightResponseXml {
  _declaration: IJsonifiedXmlDeclaration;
  lightResponse: IJsonifiedXml;
}
