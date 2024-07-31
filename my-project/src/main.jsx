import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import UserConfig from './UserConfig.jsx'
import Publish from './Publish.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/user-login" element={<UserConfig />} />
        <Route path="/publish" element={<Publish />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
