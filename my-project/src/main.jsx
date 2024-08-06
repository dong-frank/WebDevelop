import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Publish from './Publish.jsx'
import Explore from './Explore.jsx'
import MyArea from './MyArea.jsx'
import Article from './Article.jsx'
import { UserProvider } from './UserContext.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/publish" element={<Publish />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/my-area" element={<MyArea />} />
        <Route path="/article/:id" element={<Article />} />
      </Routes>
    </BrowserRouter>
    </UserProvider>
  </React.StrictMode>,
)
