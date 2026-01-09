import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  refreshTokenError: null,
  authChecked: false // 👈 ADD THIS
};


const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginRequest(state) {
      state.loading = true;
      state.error = null;
    },
    loginSuccess(state, action) {
      state.loading = false;
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
    loginFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    registerRequest(state) {
      state.loading = true;
      state.error = null;
    },
    registerSuccess(state) {
      state.loading = false;
    },
    registerFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    meRequest(state) {
  state.loading = true;
  state.authChecked = false;
},

meSuccess(state, action) {
  state.loading = false;
  state.user = action.payload.user;
  state.isAuthenticated = true;
  state.authChecked = true;
},

meFailure(state) {
  state.loading = false;
  state.user = null;
  state.isAuthenticated = false;
  state.authChecked = true;
},


    logoutRequest(state) {
      state.loading = true;
    },
    logoutSuccess(state) {
  state.loading = false;
  state.user = null;
  state.isAuthenticated = false;
  state.authChecked = true;
},

    refreshTokenRequest(state) {
      state.loading = true;
      state.refreshTokenError = null;
    },

    refreshTokenSuccess(state) {
      state.loading = false;
    },

    refreshTokenFailure(state, action) {
      state.loading = false;
      state.refreshTokenError = action.payload;
    },

    clearAuthError(state) {
      state.error = null;
    }
  }
});

export const {
  loginRequest,
  loginSuccess,
  loginFailure,
  registerRequest,
  registerSuccess,
  registerFailure,
  meRequest,
  meSuccess,
  meFailure,
  logoutRequest,
  logoutSuccess,
  refreshTokenRequest,
  refreshTokenSuccess,
  refreshTokenFailure,
  clearAuthError
} = authSlice.actions;

export default authSlice.reducer;
