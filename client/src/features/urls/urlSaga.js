import { call, put, takeLatest } from "redux-saga/effects";
import api from "../../utils/api";
import toast from "react-hot-toast";

import {
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
  getUrlAnalyticsFailure
} from "./urlSlice";


const getErrorMessage = (err, fallback) =>
  err?.response?.data?.message || fallback;


function* createUrlWorker(action) {
  try {
    const res = yield call(api.post, "/urls", action.payload);

    yield put(createUrlSuccess(res.data.data));

    toast.success("Short URL created 🚀");

  } catch (err) {
    const msg = getErrorMessage(err, "Failed to create short URL");

    yield put(createUrlFailure(msg));


    toast.error(msg);
  }
}


function* getUrlsWorker() {
  try {
    const res = yield call(api.get, "/urls");
    yield put(getUrlsSuccess(res.data.data));
  } catch (err) {
    const msg = getErrorMessage(err, "Failed to fetch URLs");

    yield put(getUrlsFailure(msg));

    
    toast.error(msg);
  }
}


function* toggleUrlStatusWorker(action) {
  try {
    const { id } = action.payload;

    const res = yield call(api.post, `/urls/${id}/status`);

    yield put(toggleUrlStatusSuccess(res.data.data));

  
    toast.success(
      res.data.data.isActive
        ? "URL activated "
        : "URL deactivated "
    );

  } catch (err) {
    const msg = getErrorMessage(err, "Failed to toggle URL status");

    yield put(toggleUrlStatusFailure(msg));

  
    toast.error(msg);
  }
}

/* ===== DELETE URL ===== */
function* deleteUrlWorker(action) {
  try {
    const { shortCode } = action.payload;

    yield call(api.post, `/urls/${shortCode}`);

    yield put(deleteUrlSuccess({ shortCode }));

    // ✅ success toast
    toast.success("URL deleted 🗑️");

  } catch (err) {
    const msg = getErrorMessage(err, "Failed to delete URL");

    yield put(deleteUrlFailure(msg));

   
    toast.error(msg);
  }
}

/* ===== URL ANALYTICS ===== */
function* getUrlAnalyticsWorker(action) {
  try {
    const { id } = action.payload;

    const res = yield call(api.get, `/urls/${id}/analytics`);

    yield put(getUrlAnalyticsSuccess(res.data.data));
  } catch (err) {
    const msg = getErrorMessage(err, "Failed to fetch analytics");

    yield put(getUrlAnalyticsFailure(msg));

    
    toast.error(msg);
  }
}

/* ===== WATCHERS ===== */
export default function* urlSaga() {
  yield takeLatest(createUrlRequest.type, createUrlWorker);
  yield takeLatest(getUrlsRequest.type, getUrlsWorker);

  yield takeLatest(toggleUrlStatusRequest.type, toggleUrlStatusWorker);
  yield takeLatest(deleteUrlRequest.type, deleteUrlWorker);
  yield takeLatest(getUrlAnalyticsRequest.type, getUrlAnalyticsWorker);
}
