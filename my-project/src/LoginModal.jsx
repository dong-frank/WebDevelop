import React from 'react';
import './LoginModal.css';

function LoginModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">

            <button className="close-button" onClick={onClose}>关闭</button>

                <div className='welcome'>
                    <p className='welcome-text'>欢迎使用兴趣圈</p>
                    <input className='admin-name' type='text' placeholder='请输入用户名' />
                    <input className='admin-password' type='password' placeholder='请输入密码' />
                    <div className='privacy-consent'>
                        <input type='checkbox' id='privacyConsent' name='privacyConsent' />
                        <label htmlFor='privacyConsent'>我已阅读并同意<a href='todo'>「兴趣圈用户使用协议」</a></label>
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