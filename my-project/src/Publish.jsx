import { useEffect, useState } from 'react'
import add_Img from './assets/add_image.svg'
import './Publish.css'
import { useNavigate } from 'react-router-dom'
import SideNav from './SideNav'

function Publish() {
  const [count, setCount] = useState(0)
  const navigate = useNavigate()

  return (
    <>
        <SideNav />
        <img className='test_img' src='src/assets/test1.png'/>
        <img className='add_img' src={add_Img}/>
        
        <input type='text' placeholder='填写标题会有更多赞噢~' className='title_input'/>
        <textarea placeholder='添加正文' className='content_input'/>
        </>
  )
}
export default Publish
