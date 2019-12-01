import { all, takeEvery, call, put } from 'redux-saga/effects'

import actionTypes from 'Redux/actionTypes'
import * as apis from 'Apis/apis'

function* watchSampleSaga(action: any) {
  try {
    const result = yield call(apis.sampleAPI)
    yield put({
      type: actionTypes.REQUEST_DEFAULT_SUCCESS,
      payload: result,
    })
  } catch (error) {
    yield put({
      type: actionTypes.REQUEST_DEFAULT_ERROR,
      payload: error,
    })
  }
}

export default function* watchSaga() {
  yield all([
    takeEvery(actionTypes.REQUEST_DEFAULT, watchSampleSaga),
  ])
}