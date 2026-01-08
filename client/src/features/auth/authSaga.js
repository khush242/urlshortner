import { call, put, takeLatest } from "redux-saga/effects";
import api from "../../utils/api";
import toast from "react-hot-toast";

import {
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
  logoutSuccess
} from "./authSlice";

/* ===== LOGIN ===== */
function* loginWorker(action) {
  try {
    const res = yield call(api.post, "/auth/login", action.payload);

    yield put(loginSuccess({ user: res.data.data.user }));

    // ✅ success toast
    toast.success("Welcome back 👋");

  } catch (err) {
    const msg =
      err.response?.data?.message || "Login failed";

    yield put(loginFailure(msg));

    // ❌ error toast
    toast.error(msg);
  }
}

/* ===== REGISTER ===== */
function* registerWorker(action) {
  try {
    yield call(api.post, "/auth/signup", action.payload);

    yield put(registerSuccess());

    // ✅ success toast
    toast.success("Account created successfully 🎉");

  } catch (err) {
    const msg =
      err.response?.data?.message || "Registration failed";

    yield put(registerFailure(msg));

    // ❌ error toast
    toast.error(msg);
  }
}

/* ===== ME ===== */
function* meWorker() {
  try {
    const res = yield call(api.get, "/auth/me");
    yield put(meSuccess({ user: res.data.data.user }));
  } catch {
    // no toast here (silent auth check)
    yield put(meFailure());
  }
}

/* ===== LOGOUT ===== */
function* logoutWorker() {
  try {
    yield call(api.post, "/auth/logout");

    // ✅ success toast
    toast.success("Logged out successfully");

  } finally {
    yield put(logoutSuccess());
  }
}

/* ===== WATCHER ===== */
export default function* authSaga() {
  yield takeLatest(loginRequest.type, loginWorker);
  yield takeLatest(registerRequest.type, registerWorker);
  yield takeLatest(meRequest.type, meWorker);
  yield takeLatest(logoutRequest.type, logoutWorker);
}
