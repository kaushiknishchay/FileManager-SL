import { put, select, takeLatest } from 'redux-saga/effects';
import map from 'lodash/map';


import isArray from 'lodash/isArray';
import isObject from 'lodash/isObject';


const currentFolderSelector = state => state.folderList.data;

function iterateObj(obj, id, newObject) {
  if (isArray(obj)) {
    return map(obj, item => iterateObj(item, id, newObject));
  } else if (isObject(obj)) {
    if (obj.id === id) {
      const newObj = obj;
      if (newObj.children) {
        newObj.children.push(newObject);
      } else {
        newObj.children = [newObject];
      }
      return newObj;
    }
    return {
      ...obj,
      children: map(obj.children, child => iterateObj(child, id, newObject)),
    };
  }
}

function* myTask(action) {
  try {
    const { payload } = action;
    const currentFolderList = yield select(currentFolderSelector);
    const newObj = {
      id: payload.folderId + Math.floor(Math.random() * 100),
      name: payload.name,
      toggled: false,
      deleted: false,
    };

    if (action.type === 'ADD_NEW_FOLDER') {
      newObj.children = [];
    } else {
      newObj.fileType = 'file';
    }

    const newList = (iterateObj(currentFolderList, payload.folderId, newObj));

    yield put({
      type: 'SAVE_CHANGES',
      payload: newList,
    });
  } catch (e) {
    console.log(e);
  }
}

function* newAddSaga() {
  yield takeLatest('ADD_NEW_FILE', myTask);
  yield takeLatest('ADD_NEW_FOLDER', myTask);
}

export default newAddSaga;
