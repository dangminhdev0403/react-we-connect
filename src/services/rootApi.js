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
  tagTypes: ["POSTS", "USERS", "FRIENDS", "CHATS"],
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
        onQueryStarted: async (
          args,
          { dispatch, queryFulfilled, getState }
        ) => {
          const tempID = crypto.randomUUID();
          const store = getState();
          const file = args.get("image");
          const imageUrl = file ? URL.createObjectURL(file) : null;
          const newPost = {
            _id: tempID,
            content: args.get("content"),
            imageUrl,
            likeCount: 0,
            commentCount: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            __v: 0,
            author: {
              _id: store.auth.user.id,
              name: store.auth.user.name,
            },
          };

          // ✅ Patch tất cả pages (hoặc ít nhất page đầu tiên)
          const patchResults = [];

          // Ví dụ: patch page đầu tiên (offset 1)
          patchResults.push(
            dispatch(
              rootApi.util.updateQueryData(
                "getAllPosts",
                { offset: 1, limit: 5 },
                (draft) => {
                  if (!Array.isArray(draft.data.posts)) {
                    draft.data.posts = [];
                  }
                  draft.data.posts.unshift(newPost);
                }
              )
            )
          );

          // Helper function to find post index by tempID
          function findPostIndexByTempID(posts, tempID) {
            return posts.findIndex((post) => post._id === tempID);
          }

          try {
            const { data } = await queryFulfilled;
            // ✅ Replace temp post với post thực tế từ server
            patchResults.forEach((patch) => {
              dispatch(
                rootApi.util.updateQueryData(
                  "getAllPosts",
                  patch.arg,
                  (draft) => {
                    const index = findPostIndexByTempID(
                      draft.data.posts,
                      tempID
                    );
                    if (index !== -1) {
                      draft.data.posts[index] = data;
                    }
                  }
                )
              );
            });
          } catch (err) {
            patchResults.forEach((patch) => patch.undo());
            console.error("Error in createPost:", err);
          }
        },
      }),
      getAllPosts: builder.query({
        query: ({ offset, limit } = {}) => {
          return {
            url: API_ROUTES.GET_All_POSTS,
            params: {
              offset,
              limit,
            },
          };
        },
        providesTags: [{ type: "POSTS" }],
      }),
      searchUser: builder.query({
        query: ({ offset, limit, keyword }) => {
          const encoedKeyword = encodeURIComponent(keyword.trim());
          return {
            url: `${API_ROUTES.SEARCH_USER}?keyword=${encoedKeyword}`,
            params: { offset, limit },
          };
        },
        providesTags: (result) =>
          result
            ? [
                ...result.data.map((post) => ({ type: "USERS", id: post._id })),
                { type: "USERS", id: "LIST" },
              ]
            : [{ type: "USERS", id: "LIST" }],
      }),
      getFriendList: builder.query({
        query: ({ offset = 1, limit = 5 } = {}) => {
          return {
            url: `${API_ROUTES.GET_FRIEND_LIST}`,
            params: { offset, limit },
          };
        },
        providesTags: (result) =>
          result?.data?.friends
            ? [
                ...result.data.friends.map((friend) => ({
                  type: "FRIENDS",
                  id: friend._id,
                })),
                { type: "FRIENDS", id: "LIST" },
              ]
            : [{ type: "FRIENDS", id: "LIST" }],
      }),
      sendFriendRequest: builder.mutation({
        query: (receiverId) => ({
          url: API_ROUTES.SEND_FRIEND_REQUEST,
          method: "POST",
          body: { receiverId },
        }),
        invalidatesTags: (result, error, args) => [{ type: "USERS", id: args }],
      }),
      approveFriendRequest: builder.mutation({
        query: (requestId) => ({
          url: API_ROUTES.RESPOND_FRIEND_REQUEST,
          method: "PUT",
          body: { requestId, action: "accept" },
        }),
        invalidatesTags: [
          { type: "PENDING_FRIEND_REQUEST", id: "LIST" },
          { type: "FRIENDS", id: "LIST" },
        ],
      }), // ApproveFriendRequest
      declineFriendRequest: builder.mutation({
        query: (requestId) => ({
          url: API_ROUTES.RESPOND_FRIEND_REQUEST,
          method: "PUT",
          body: { requestId, action: "reject" },
        }),
        invalidatesTags: [
          { type: "PENDING_FRIEND_REQUEST", id: "LIST" },
          { type: "FRIENDS", id: "LIST" },
        ],
      }),
      getFriendRequests: builder.query({
        query: () => {
          return API_ROUTES.GET_FRIEND_REQUESTS;
        },
        providesTags: (result) =>
          result
            ? [
                ...result.data.users.map(({ _id }) => ({
                  type: "PENDING_FRIEND_REQUEST",
                  id: _id,
                })),
                { type: "PENDING_FRIEND_REQUEST", id: "LIST" },
              ]
            : [{ type: "PENDING_FRIEND_REQUEST", id: "LIST" }],
      }),
      getSimpleMessage: builder.query({
        query: ({ receiverId, offset = 0, limit = 5 }) => {
          return {
            url: `${API_ROUTES.GET_SINGLE_MESSAGES}/${receiverId}`,
            params: { offset, limit },
          };
        },
        providesTags: (result) =>
          result?.data?.messages
            ? [
                ...result.data.messages.map((message) => ({
                  type: "SIMPLE_MESSAGES",
                  id: message._id,
                })),
                { type: "SIMPLE_MESSAGES", id: "LIST" },
              ]
            : [{ type: "SIMPLE_MESSAGES", id: "LIST" }],
      }),
      sendSingleMessage: builder.mutation({
        query: (dataForm) => ({
          url: API_ROUTES.SEND_SINGLE_MESSAGES,
          method: "POST",
          body: dataForm,
        }),
        invalidatesTags: [
          { type: "SIMPLE_MESSAGES", id: "LIST" },
          { type: "USERS", id: "LIST" },
        ],
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
  useSearchUserQuery,
  useSendFriendRequestMutation,
  useGetFriendRequestsQuery,
  useApproveFriendRequestMutation,
  useDeclineFriendRequestMutation,
  useGetFriendListQuery,
  useGetSimpleMessageQuery,
  useSendSingleMessageMutation,
} = rootApi;
