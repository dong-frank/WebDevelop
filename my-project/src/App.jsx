import { useEffect, useState, useContext } from 'react'
import './App.css'
import { useNavigate } from 'react-router-dom'
import { UserContext } from './UserContext'
import SideNav from './SideNav'
import TopNav from './TopNav'
import * as axios from 'axios'
const client = axios.default;
function App() {

  const navigate = useNavigate()
  //TODO:
  const { userData } = useContext(UserContext);
  const userName = userData ? userData.username : '请先登录';
  const [circles, setCircles] = useState([]);

  useEffect(() => {
    const carouselItem = document.querySelector('.carousel-item');
    const images = carouselItem.querySelectorAll('img');
    let index = 0;

    const fetchCircles = async () => {
      await client.get(`http://127.0.0.1:7001/api/interest-circles`)
        .then(response => {
          setCircles(response.data.data);
          console.log('Circles fetched:', response.data.data);
          //todo:
        })
        .catch(error => {
          console.error('Error fetching circles:', error);
        });
    }

    fetchCircles();

    function showNextImage() {
      index++;
      if (index >= images.length) {
        index = 0;
      }
      carouselItem.style.transform = `translateX(${-index * 100}%)`;
    }

    const intervalId = setInterval(showNextImage, 2000);
    return () => clearInterval(intervalId);
  }, [])

  const  handleJoinCircle =async(circleId) => {
    console.log('加入圈子');
    const token = sessionStorage.getItem('token');
    if (!token) {
      alert('用户不存在,请先注册或登录');
      return;
    } else {
      console.log('token:', token);
    }
    const response =await client.post('http://127.0.0.1:7001/api/join-circle', {
      circleId: circleId,
      token: token
    });
    alert(response.data.message);
    navigate('/my-area');
    }
  
  return (
    <>
      <SideNav />
      <TopNav />
      <div className='carousel'>
        <div className='carousel-item'>
          <img src='http://127.0.0.1:3000/封面图片1.jpg' />
          <img src='http://127.0.0.1:3000/封面图片2.jpg' />
          <img src='http://127.0.0.1:3000/封面图片3.jpg' />
        </div>
      </div>

      <div className='interestCircles'>
        {circles.map(circle => (
          <div key={circle.id} className="circle-container">
            <img className="circle-avatar" src={circle.avatar} />
            <div className="circle-name">{circle.name}</div>
            <div className="circle-users">{circle.users.length}人</div>
            <button className='join-circle' onClick={()=>handleJoinCircle(circle.id)}>加入</button>
          </div>
        ))}
      </div>
    </>
  )
}

export default App
