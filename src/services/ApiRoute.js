export const API_BASE_URL = import.meta.env.VITE_BASE_URL;
export const API_ROUTES = {
  REGISTER: "/auth/register",
  LOGIN: "/auth/login",
  LOGOUT: "/auth/logout",
  GET_PROFILE: "/users/profile",
  UPDATE_USER: "/users/update",
  DELETE_USER: "/users/delete",
  GET_ALL_USERS: "/users",
  CREATE_POST: "/posts",
  GET_POSTS: "/posts",
  GET_POST_BY_ID: (id) => `/post/${id}`,
  UPDATE_POST: (id) => `/post/update/${id}`,
  DELETE_POST: (id) => `/post/delete/${id}`,
};
