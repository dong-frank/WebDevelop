import { useEffect, useState } from 'react'

import './Publish.css'
import { useNavigate } from 'react-router-dom'

function Publish() {
  const [count, setCount] = useState(0)
  const navigate = useNavigate()

  return (
    <>
      <div class="side-nav">
        <button className='home' onClick={()=> navigate('/')}>首页</button>
        <button className='my-interest' onClick={()=> navigate('/')}>我的兴趣圈</button>
        <button className='explore' onClick={()=> navigate('/')}>探索</button>
        <button className='publish' onClick={()=> navigate('/')}>发表</button>
        </div>
        </>
  )
}
export default Publish
