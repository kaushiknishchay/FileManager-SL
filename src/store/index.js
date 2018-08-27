import { applyMiddleware, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import logger from 'redux-logger';
import { persistReducer, persistStore } from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import storage from 'redux-persist/lib/storage';
import rootReducer from '../reducers/index';
import rootSagas from '../sagas';


const persistConfig = {
  key: 'root',
  storage,
  stateReconciler: autoMergeLevel2,
  whitelist: ['folderList'],
};
const pReducer = persistReducer(persistConfig, rootReducer);


// create the saga middleware
const sagaMiddleware = createSagaMiddleware();

// create a redux store with our reducer above and middleware
const store = createStore(
  pReducer,
  (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? applyMiddleware(sagaMiddleware, logger) : applyMiddleware(sagaMiddleware),
);

// run the saga
sagaMiddleware.run(rootSagas);

export const persistor = persistStore(store);

export default store;
