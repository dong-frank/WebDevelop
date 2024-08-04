import { useEffect, useState, useContext } from 'react'
import './App.css'
import { useNavigate } from 'react-router-dom'
import { UserContext } from './UserContext'
import SideNav from './SideNav'
import TopNav from './TopNav'

function App() {

  const navigate = useNavigate()
  //TODO:
  const { userData } = useContext(UserContext);
  const userName = userData ? userData.username : '请先登录';

  useEffect(() => {
    const carouselItem = document.querySelector('.carousel-item');
    const images = carouselItem.querySelectorAll('img');
    let index = 0;

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

  return (
    <>
      <SideNav />
      <TopNav />
      <div className='carousel'>
        <div className='carousel-item'>
          <img src='src/assets/UserConfig.jpg' />
          <img src='src/assets/test2.jpg' />
          <img src='src/assets/test1.png' />
        </div>
      </div>
    </>
  )
}

export default App
