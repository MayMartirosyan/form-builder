export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'checkbox' | 'select';
  required: boolean;
  defaultValue: string | number | boolean | string[];
  options?: string;
}

export interface FormSchema {
  id: string;
  name: string;
  fields: FormField[];
}