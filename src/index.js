import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';
import CircularProgress from '@material-ui/core/CircularProgress';


import store, { persistor } from './store';


import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';


ReactDOM.render(<Provider store={store}>
  <PersistGate
    loading={<CircularProgress size={50} />}
    persistor={persistor}
  >
    <App />
  </PersistGate>
</Provider>, document.getElementById('root'));
registerServiceWorker();
