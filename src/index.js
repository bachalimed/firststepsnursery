import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { registerLicense } from '@syncfusion/ej2-base';//to register licence
import { store } from './app/store'
import { Provider } from 'react-redux'//provide global state to the app, we will wrap the app in the provider so that the global state is available within the app



// Registering Syncfusion license key
registerLicense('Ngo9BigBOggjHTQxAR8/V1NDaF5cWWtCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdnWH9eeXVRQ2ZfUUd0XUA=');


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          
          <Route path="/*" element={<App />} />
          
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
)