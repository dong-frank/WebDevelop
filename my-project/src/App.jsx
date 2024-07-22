import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useNavigate } from 'react-router-dom'

function App() {
  const [count, setCount] = useState(0)
  const navigate = useNavigate()
  return (
    <>
      <h1 className='title'>兴趣圈</h1>
      <div className="login-container">
        <button className='login' onClick={() => navigate('/user-login')}>
           登录
        </button>

        <img src = 'src/assets/admin-login.png'/>
        </div>

    </>
  )
}

export default App
