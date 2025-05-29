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

  if (result.error && result?.error?.data?.statusCode === 401) {
    const refreshResult = await baseQuery(
      {
        url: API_ROUTES.REFRESH,
        credentials: "include",
        method: "POST",
      },
      api,
      extraOptions
    );
    const newAccessToken = refreshResult?.data?.data?.access_token;
    if (newAccessToken) {
      api.dispatch(
        authSlice.actions.login({
          accessToken: newAccessToken,
        })
      );
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(authSlice.actions.logOut());
      window.location.href = "/login";
    }
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
          credentials: "include",

          method: "POST",
          body: { name, email, password },
        }),
      }),
      login: builder.mutation({
        query: ({ email, password }) => ({
          url: API_ROUTES.LOGIN,
          credentials: "include",

          method: "POST",
          body: { email, password },
        }),
      }),
      refresh: builder.mutation({
        query: () => ({
          url: API_ROUTES.REFRESH,
          method: "POST",
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
        invalidatesTags: ["Post"],
      }),
      getAllPosts: builder.query({
        query: () => {
          return API_ROUTES.GET_All_POSTS;
        },
        providesTags: ["Post"],
      }),
    };
  },
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useGetAuthUserQuery,
  useCreatePostMutation,
  useRefreshMutation,
  useLogOutMutation,
  useGetAllPostsQuery,
} = rootApi;
