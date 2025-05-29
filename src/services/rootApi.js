import { authSlice } from "@redux/slices/authSlice";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL, API_ROUTES } from "@services/ApiRoute";

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.accessToken;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // If we get an unauthorized response, we can handle re-authentication here

  if (result.error && result?.error?.status === 401) {
    api.dispatch(authSlice.actions.logOut());
    window.location.href = "/login"; // Redirect to login page
  }

  return result;
};
export const rootApi = createApi({
  // process is not defined in the browser, but vite replaces it with import.meta.env
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => {
    return {
      register: builder.mutation({
        query: ({ name, email, password }) => ({
          url: API_ROUTES.REGISTER,
          method: "POST",
          body: { name, email, password },
        }),
      }),
      login: builder.mutation({
        query: ({ email, password }) => ({
          url: API_ROUTES.LOGIN,
          method: "POST",
          body: { email, password },
        }),
      }),
      logOut: builder.mutation({
        query: () => ({
          url: API_ROUTES.LOGOUT,
          method: "POST",
        }),
      }),
      getAuthUser: builder.query({
        query: () => {
          return API_ROUTES.GET_PROFILE;
        },
      }),
      createPost: builder.mutation({
        query: (formData) => ({
          url: API_ROUTES.CREATE_POST,
          method: "POST",
          body: formData,
        }),
      }),
    };
  },
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useGetAuthUserQuery,
  useCreatePostMutation,
} = rootApi;
