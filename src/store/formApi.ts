import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { FormSchema } from '../types/form';
import { BASE_URL } from '../utils/constants';

export const formApi = createApi({
  reducerPath: 'formApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${BASE_URL}/form` }),
  endpoints: (builder) => ({
    saveForm: builder.mutation<{ message: string }, FormSchema>({
      query: (schema) => ({
        url: '/',
        method: 'POST',
        body: schema,
      }),
    }),
    getForm: builder.query<FormSchema, string>({
      query: (id) => `/${id}`,
    }),
  }),
});

export const { useSaveFormMutation, useGetFormQuery } = formApi;
