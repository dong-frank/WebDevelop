import { useEffect, useState } from 'react'

import './Publish.css'
import { useNavigate } from 'react-router-dom'
import SideNav from './SideNav'

function Publish() {
  const [count, setCount] = useState(0)
  const navigate = useNavigate()

  return (
    <>
        <SideNav />
        <img className='test_img' src=''/>
        
        
        </>
  )
}
export default Publish
