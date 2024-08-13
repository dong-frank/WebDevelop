import React from 'react';
import './LoginModal.css';
import * as axios from 'axios'
import { UserContext } from './UserContext';
import { useState } from 'react';
import { set } from 'date-fns';
const client = axios.default;

function LoginModal({ isOpen, onClose }) {
    if (!isOpen) return null;
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [isPrivacyConsentChecked, setIsPrivacyConsentChecked] = React.useState(false);
    const { setUserData } = React.useContext(UserContext);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
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

            const userData = await client.get('http://127.0.0.1:7001/api/userdata', {
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

    const handleRegister =async () => {
        if (password !== confirmPassword) {
            alert('密码和确认密码不匹配');
            return;
        }
        if (!isPrivacyConsentChecked) {
            alert('请先同意「兴趣圈用户使用协议」');
            return;
        }
        try {
            const response = await client.post('http://127.0.0.1:7001/api/register', {
                username,
                password,
            });
            alert('注册成功');
            setIsRegistering(false);
            setPassword('');
        } catch (error) {
            console.error('Register failed', error.response.data.message);
            alert(error.response.data.message);
            setPassword('');
            setConfirmPassword('');
        }
    }
    return (
        <div className="modal-overlay">
            <div className="modal-content">

                <button className="close-button" onClick={onClose}>关闭</button>

                <div className='welcome'>
                    <p className='welcome-text'>欢迎使用兴趣圈</p>
                    <input className='admin-name' type='text' placeholder='请输入用户名' value={username} onChange={(e) => setUsername(e.target.value)} />
                    <input className='admin-password' type='password' placeholder='请输入密码' value={password} onChange={(e) => setPassword(e.target.value)} />
                    {isRegistering && (
                        <input
                            className="admin-password"
                            type="password"
                            placeholder="确认密码"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    )}
                    <div className='privacy-consent'>
                        <input type='checkbox' id='privacyConsent' name='privacyConsent' checked={isPrivacyConsentChecked} onChange={(e) => setIsPrivacyConsentChecked(e.target.checked)} />
                        <label htmlFor='privacyConsent'>我已阅读并同意<a href='my-area'>「兴趣圈用户使用协议」</a></label>
                    </div>
                    <div className='login-button-container'>
                        <button className='login-button' onClick={isRegistering ? handleRegister : handleLogin}>
                            {isRegistering ? '注册' : '登录'}
                        </button>
                        <button className='forget-password-button' onClick={() => handleForgetPassword()}>忘记密码</button>
                        <button className='register-button' onClick={() => setIsRegistering(!isRegistering)}>{isRegistering ? '已有账号？登录' : '没有账号？注册'}</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginModal;