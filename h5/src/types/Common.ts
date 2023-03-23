export interface ObjType {
  [key: string]: any;
}

export type AkErrorType =
  | ObjType
  | {
      code: number;
      data?: any;
      header?: ObjType;
      message?: string;
      success?: boolean;
    };

export type NumOrStrType = number | string;
