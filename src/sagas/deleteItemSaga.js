import { put, select, takeLatest } from 'redux-saga/effects';
import map from 'lodash/map';


import isArray from 'lodash/isArray';
import isObject from 'lodash/isObject';


const currentFolderSelector = state => state.folderList.data;

function iterateObj(obj, id, type = 'delete') {
  if (isArray(obj)) {
    return map(obj, item => iterateObj(item, id, type));
  } else if (isObject(obj)) {
    if (obj.id === id) {
      return {
        ...obj,
        deleted: type === 'delete',
        children: map(obj.children, child => iterateObj(child, child.id, type)),
      };
    }
    return {
      ...obj,
      children: map(obj.children, child => iterateObj(child, id, type)),
    };
  }
  return null;
}

function* myTask(action) {
  try {
    const { payload } = action;
    const currentFolderList = yield select(currentFolderSelector);
    const actionType = action.type === 'DELETE_ITEM' ? 'delete' : 'restore';

    const newList = (iterateObj(currentFolderList, payload.itemId, actionType));

    yield put({
      type: 'SAVE_CHANGES',
      payload: newList,
    });
  } catch (e) {
    console.log(e);
  }
}

function* newAddSaga() {
  yield takeLatest('DELETE_ITEM', myTask);
  yield takeLatest('RESTORE_ITEM', myTask);
}

export default newAddSaga;
