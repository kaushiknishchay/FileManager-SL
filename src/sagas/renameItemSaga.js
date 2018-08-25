import { put, select, takeLatest } from 'redux-saga/effects';
import map from 'lodash/map';


import isArray from 'lodash/isArray';
import isObject from 'lodash/isObject';


const currentFolderSelector = state => state.folderList.data;

function iterateObj(obj, id, newName) {
  if (isArray(obj)) {
    return map(obj, item => iterateObj(item, id, newName));
  } else if (isObject(obj)) {
    if (obj.id === id) {
      return {
        ...obj,
        name: newName,
      };
    }
    return {
      ...obj,
      children: map(obj.children, child => iterateObj(child, id, newName)),
    };
  }
  return null;
}

function* myTask(action) {
  try {
    const { payload } = action;
    const currentFolderList = yield select(currentFolderSelector);

    const newList = (iterateObj(currentFolderList, payload.itemId, payload.name));

    yield put({
      type: 'SAVE_CHANGES',
      payload: newList,
    });
  } catch (e) {
    console.log(e);
  }
}

function* renameItemSaga() {
  yield takeLatest('RENAME_ITEM', myTask);
}

export default renameItemSaga;
