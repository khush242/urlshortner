import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  urls: [],

  /* ===== LIST ===== */
  listLoading: false,
  listError: null,

  /* ===== CREATE ===== */
  createdUrl: null,
  createLoading: false,
  createError: null,

  /* ===== ACTIONS (toggle / delete) ===== */
  actionLoading: false,
  actionError: null,

  /* ===== ANALYTICS ===== */
  analytics: null,
  analyticsLoading: false,
  analyticsError: null
};

const urlSlice = createSlice({
  name: "url",
  initialState,
  reducers: {
    /* ===== CREATE SHORT URL ===== */
    createUrlRequest(state) {
      state.createLoading = true;
      state.createError = null;
      state.createdUrl = null;
    },
    createUrlSuccess(state, action) {
      state.createLoading = false;
      state.createdUrl = action.payload;
      state.urls.unshift(action.payload);
    },
    createUrlFailure(state, action) {
      state.createLoading = false;
      state.createError = action.payload;
    },

    /* ===== GET USER URLS ===== */
    getUrlsRequest(state) {
      state.listLoading = true;
      state.listError = null;
    },
    getUrlsSuccess(state, action) {
      state.listLoading = false;
      state.urls = action.payload;
    },
    getUrlsFailure(state, action) {
      state.listLoading = false;
      state.listError = action.payload;
    },

    /* ===== TOGGLE URL STATUS ===== */
    toggleUrlStatusRequest(state) {
      state.actionLoading = true;
      state.actionError = null;
    },
    toggleUrlStatusSuccess(state, action) {
      state.actionLoading = false;

      const updatedUrl = action.payload;
      const index = state.urls.findIndex(
        (url) => url._id === updatedUrl._id
      );

      if (index !== -1) {
        state.urls[index] = updatedUrl;
      }
    },
    toggleUrlStatusFailure(state, action) {
      state.actionLoading = false;
      state.actionError = action.payload;
    },

    /* ===== DELETE URL ===== */
    deleteUrlRequest(state) {
      state.actionLoading = true;
      state.actionError = null;
    },
    deleteUrlSuccess(state, action) {
      state.actionLoading = false;
      state.urls = state.urls.filter(
        (url) => url.shortCode !== action.payload.shortCode
      );
    },
    deleteUrlFailure(state, action) {
      state.actionLoading = false;
      state.actionError = action.payload;
    },

    /* ===== ANALYTICS ===== */
    getUrlAnalyticsRequest(state) {
      state.analyticsLoading = true;
      state.analyticsError = null;
      state.analytics = null;
    },
    getUrlAnalyticsSuccess(state, action) {
      state.analyticsLoading = false;
      state.analytics = action.payload;
    },
    getUrlAnalyticsFailure(state, action) {
      state.analyticsLoading = false;
      state.analyticsError = action.payload;
    },

    /* ===== CLEARERS ===== */
    clearCreatedUrl(state) {
      state.createdUrl = null;
    },
    clearAnalytics(state) {
      state.analytics = null;
      state.analyticsError = null;
    }
  }
});

export const {
  createUrlRequest,
  createUrlSuccess,
  createUrlFailure,

  getUrlsRequest,
  getUrlsSuccess,
  getUrlsFailure,

  toggleUrlStatusRequest,
  toggleUrlStatusSuccess,
  toggleUrlStatusFailure,

  deleteUrlRequest,
  deleteUrlSuccess,
  deleteUrlFailure,

  getUrlAnalyticsRequest,
  getUrlAnalyticsSuccess,
  getUrlAnalyticsFailure,

  clearCreatedUrl,
  clearAnalytics
} = urlSlice.actions;

export default urlSlice.reducer;
