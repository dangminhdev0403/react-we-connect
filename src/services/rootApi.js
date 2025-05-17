import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const rootApi = createApi({
  // process is not defined in the browser, but vite replaces it with import.meta.env
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BASE_URL }),
  endpoints: (builder) => {
    return {
      register: builder.mutation({
        query: ({ fullName, email, password }) => ({
          url: "/register",
          method: "POST",
          body: { fullName, email, password },
        }),
      }),
      login: builder.mutation({
        query: ({ email, password }) => ({
          url: "/login",
          method: "POST",
          body: { email, password },
        }),
      }),
    };
  },
});

export const { useRegisterMutation, useLoginMutation } = rootApi;
