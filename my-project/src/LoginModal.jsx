import React from 'react';
import './LoginModal.css';
import * as axios from 'axios'
import { UserContext } from './UserContext';
const client = axios.default;

function LoginModal({ isOpen, onClose }) {
    if (!isOpen) return null;
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [isPrivacyConsentChecked, setIsPrivacyConsentChecked] = React.useState(false);
    const { setUserData } = React.useContext(UserContext);
    const handleLogin = async () => {
        if (!isPrivacyConsentChecked) {
            alert('请先同意「兴趣圈用户使用协议」');
            return;
        }
        try {
            const response = await client.post('http://127.0.0.1:7001/api/login', {
                username,
                password,
            });
            
            const token = response.data.token;
            sessionStorage.setItem('token', token);

            alert('登录成功');
            
            const userData = await client.get('http://127.0.0.1:7001/api/userdata' , {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setUserData(userData.data)
            onClose();
        } catch (error) {
            console.error('Login failed', error.response.data.message);
            alert('登录失败,用户名或密码错误');
            setPassword('');
        }
    };
    return (
        <div className="modal-overlay">
            <div className="modal-content">

                <button className="close-button" onClick={onClose}>关闭</button>

                <div className='welcome'>
                    <p className='welcome-text'>欢迎使用兴趣圈</p>
                    <input className='admin-name' type='text' placeholder='请输入用户名' value={username} onChange={(e) => setUsername(e.target.value)} />
                    <input className='admin-password' type='password' placeholder='请输入密码' value={password} onChange={(e) => setPassword(e.target.value)} />
                    <div className='privacy-consent'>
                        <input type='checkbox' id='privacyConsent' name='privacyConsent' checked={isPrivacyConsentChecked} onChange={(e) => setIsPrivacyConsentChecked(e.target.checked)} />
                        <label htmlFor='privacyConsent'>我已阅读并同意<a href='my-area'>「兴趣圈用户使用协议」</a></label>
                    </div>
                    <div className='login-button-container'>
                        <button className='login-button' onClick={() => handleLogin()}>登录</button>
                        <button className='forget-password-button' onClick={() => handleForgetPassword()}>忘记密码</button>
                        <button className='register-button' onClick={() => handleRegister()}>注册账号</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginModal;