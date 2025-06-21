import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FormField, FormSchema } from '../types/form';

interface FormState {
  schema: FormSchema;
}

const initialState: FormState = {
  schema: {
    id: 'default-form-id',
    name: '',
    fields: [],
  },
};

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    setFormName(state, action: PayloadAction<string>) {
      state.schema.name = action.payload;
    },
    addField(state, action: PayloadAction<FormField>) {
      state.schema.fields.push(action.payload);
    },
    removeField(state, action: PayloadAction<string>) {
      state.schema.fields = state.schema.fields.filter(
        (field) => field.id !== action.payload
      );
    },
    updateField(state, action: PayloadAction<FormField>) {
      const index = state.schema.fields.findIndex(
        (field) => field.id === action.payload.id
      );
      if (index !== -1) {
        state.schema.fields[index] = action.payload;
      }
    },
    reorderFields(state, action: PayloadAction<FormField[]>) {
      state.schema.fields = action.payload;
    },
    setSchema(state, action: PayloadAction<FormSchema>) {
      state.schema = action.payload;
    },
  },
});

export const selectForm = (state) => state.form;

export const {
  setFormName,
  addField,
  removeField,
  updateField,
  reorderFields,
  setSchema,
} = formSlice.actions;
export default formSlice.reducer;
