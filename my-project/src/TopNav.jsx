import { useEffect, useState, useContext } from 'react'
import './TopNav.css'
import { useNavigate } from 'react-router-dom'
import { UserContext } from './UserContext'
import LoginModal from './LoginModal'

function TopNav() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { setUserData } = useContext(UserContext);

    const openModal = () => { setIsModalOpen(true) };
    const closeModal = () => setIsModalOpen(false);
    const navigate = useNavigate()
    const handleLogout = () => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('userData');
        setUserData(null);
        alert('注销成功');
        navigate('/');  
    }
    const { userData } = useContext(UserContext);
    const userName = userData ? userData.username : '请先登录';
    return (
        <>
            <div className="login-container">
                {userData ? (
                    <button className='login' onClick={handleLogout}>
                        注销
                    </button>
                ) : (
                    <button className='login' onClick={openModal}>
                        登录
                    </button>
                )}

                <img src='http://127.0.0.1:3000/9ba69ee6fac33bd14b7e00300.png' />
                <p className='welcome-back'>欢迎回来, {userName} !</p>
            </div>

            <LoginModal isOpen={isModalOpen} onClose={closeModal} />
        </>
    )
}
export default TopNav