import { all } from "redux-saga/effects";
import authSaga from "../features/auth/authSaga";
import urlSaga from "../features/urls/urlSaga";

export default function* rootSaga() {
  yield all([
    authSaga(),
    urlSaga()
  ]);
}
