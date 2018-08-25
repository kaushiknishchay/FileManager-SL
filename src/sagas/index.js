import { fork } from 'redux-saga/effects';
import newAddSaga from './newAddSaga';
import deleteItemSaga from './deleteItemSaga';
import renameItemSaga from './renameItemSaga';


function* rootSaga() {
  yield fork(newAddSaga);
  yield fork(deleteItemSaga);
  yield fork(renameItemSaga);
}

export default rootSaga;
