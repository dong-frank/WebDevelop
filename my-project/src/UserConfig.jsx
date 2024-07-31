import { useState } from 'react'
import './UserConfig.css'
import React, { Component } from 'react'
import * as axios from 'axios'

const client = axios.default;

function UserConfig() {
  const [count, setCount] = useState(0);
  function handleLogin() {
    //TODO:
    client.get('http://127.0.0.1:7001/')
      .then((response) => {
        console.log(response.data);
      })
  }

  function handleRegister() {
    //TODO:
  }

  function handleForgetPassword() {
    //TODO:
    console.log("forget password");
  }
  return (
    <>
      <nav className="top-nav">
        <ul>
          <li><a href="/">首页</a></li>
          <li><a href="todo">关于</a></li>
          <li><a href="todo">帮助</a></li>
          <li><a href="todo">联系我们</a></li>
        </ul>
      </nav>
      <div className='container'>

        <div className="image-container">
          <img src="src/assets/UserConfig.jpg" />
        </div>

        <div className="welcome">
          <p>欢迎使用兴趣圈</p>
          <input className="admin-name" type="text" placeholder="请输入用户名" />
          <input className="admin-password" type="password" placeholder="请输入密码" />
          <div className="privacy-consent">
            <input type="checkbox" id="privacyConsent" name="privacyConsent" />
            <label htmlFor="privacyConsent">我已阅读并同意<a href="todo">「兴趣圈用户使用协议」</a></label>
          </div>

          <div className="login-button-container">
            <button className="login-button" onClick={() => handleLogin()}>登录</button>
            <button className="forget-password-button" onClick={() => handleForgetPassword()}>忘记密码</button>
            <button className="register-button" onClick={() => handleRegister()}>注册账号</button>
          </div>
        </div>



      </div>
    </>
  )
}

export default UserConfig