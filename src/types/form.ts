export type FieldType =
  | "text"
  | "number"
  | "email"
  | "password"
  | "dropdown"
  | "radio"
  | "checkbox";

export interface FormField {
  id: string;
  name: string;
  value: string;
  type: FieldType;
  required: boolean;
  label: string;
  placeholder?: string;
  options?: string[];
  validation?: {
    min?: number;
    max?: number;
    regex?: string;
  };
}

export interface FormTemplate {
  id: string;
  title: string;
  createdAt: string;
  fields: FormField[];
}
