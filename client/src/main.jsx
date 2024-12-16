import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './App.css';
import App from './App.jsx';
import { persistor, store } from './redux/store.js';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { GoogleOAuthProvider } from '@react-oauth/google';

createRoot(document.getElementById('root')).render(
//  <StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <GoogleOAuthProvider clientId='832458855190-3ittnsqdkn44mkbo6jm3d0v65iim1b1a.apps.googleusercontent.com'>
          <App />
        </GoogleOAuthProvider>
      </PersistGate>
    </Provider>
// </StrictMode>
);
