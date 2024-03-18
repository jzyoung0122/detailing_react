import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {Provider} from 'react-redux'
import store from './store'
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import { RouterProvider } from 'react-router-dom';
import router from './router'
import {QueryClientProvider,QueryClient} from 'react-query'

const root = ReactDOM.createRoot(document.getElementById('root'));
const queryClient=new QueryClient()
const persistor=persistStore(store)

root.render(
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
          <RouterProvider router={router}/>
          </PersistGate>
    </Provider>
  </QueryClientProvider>
  
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
