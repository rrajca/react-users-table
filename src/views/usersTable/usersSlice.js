import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const usersSlice = createSlice({
  name: "users",
  initialState: {
    entries: [],
    results: 0,
    pageSize: 0,
    pageIndex: 0,
    pageCount: 0,
    search: "",
    sortBy: {},
    isLoading: false,
  },
  reducers: {
    updateUsers: (state, { payload }) => {
      state.entries = payload;
    },
    updateUsersCount: (state, { payload }) => {
      state.results = payload;
    },
    updatePageSize: (state, { payload }) => {
      state.pageSize = payload;
    },
    updatePageIndex: (state, { payload }) => {
      state.pageIndex = payload;
    },
    updatePageCount: (state, { payload }) => {
      state.pageCount = Math.ceil(state.results / payload);
    },
    updateSearch: (state, { payload }) => {
      state.search = payload;
    },
    updateSortBy: (state, { payload }) => {
      state.sortBy = payload;
    },
    updateLoadingStatus: (state, { payload }) => {
      state.isLoading = payload;
    },
  },
});

export const {
  updateUsers,
  updateUsersCount,
  updatePageSize,
  updatePageIndex,
  updatePageCount,
  updateSearch,
  updateSortBy,
  updateLoadingStatus,
} = usersSlice.actions;

export const getUsers = (pageSize, pageIndex, search, sortBy) => (dispatch) => {
  dispatch(updateLoadingStatus(true));
  axios
    .get("/api/users", {
      params: {
        page: pageIndex,
        per_page: pageSize,
        ...(search ? { search } : {}),
        ...(sortBy[0]
          ? {
              sort_by: sortBy[0].id,
              order: sortBy[0].desc ? "desc" : "asc",
            }
          : {}),
      },
    })
    .then((response) => {
      dispatch(updateUsers(response.data.data.entries));
      dispatch(updateUsersCount(response.data.data.results));
      dispatch(updatePageSize(pageSize));
      dispatch(updatePageIndex(pageIndex));
      dispatch(updatePageCount(pageSize));
      dispatch(updateSearch(search));
      dispatch(updateSortBy(sortBy[0] || {}));
      dispatch(updateLoadingStatus(false));
    })
    .catch((error) => console.log(error));
};

export const selectUsers = (state) => state.users;

export default usersSlice.reducer;
