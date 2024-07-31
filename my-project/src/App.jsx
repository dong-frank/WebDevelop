import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useNavigate } from 'react-router-dom'
import LoginModal from './LoginModal'
import SideNav from './SideNav'

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const navigate = useNavigate()
  //TODO:
  const userName = 'admin'

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
      <div className="login-container">
        <button className='login' onClick={openModal}>
          登录
        </button>

        <img src='src/assets/admin-login.png' />
        <p className='welcome-back'>欢迎回来, {userName} !</p>
      </div>

      <div className='carousel'>
        <div className='carousel-item'>
          <img src='src/assets/UserConfig.jpg' />
          <img src='src/assets/test2.jpg' />
          <img src='src/assets/test1.png' />
        </div>
      </div>
      <LoginModal isOpen={isModalOpen} onClose={closeModal} />
        
    </>
  )
}

export default App
