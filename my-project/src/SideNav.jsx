import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './SideNav.css'; // 如果有单独的样式文件

function SideNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [title, setTitle] = React.useState('');
  React.useEffect(() => {
    switch (location.pathname) {
      case '/':
        setTitle('兴趣圈');
        break;
      case '/my-area':
        setTitle('我的兴趣圈');
        break;
      case '/explore':
        setTitle('探索');
        break;
      case '/publish':
        setTitle('发表');
        break;
      default:
        setTitle('兴趣圈');
    }
  }, [location.pathname]);
  
  const handleNavigation = (path, newTitle) => {
    navigate(path);
    setTitle(newTitle);
  };
  return (
    <div className="side-nav">
      <h1 className='title'>{title}</h1>
      <button className="home" onClick={() => handleNavigation('/','兴趣圈')}>首页</button>
      <button className="my-interest" onClick={() => handleNavigation('/my-area','我的兴趣圈')}>我的兴趣圈</button>
      <button className="explore" onClick={() => handleNavigation('/explore','探索')}>探索</button>
      <button className="publish" onClick={() => handleNavigation('/publish','发表')}>发表</button>
    </div>
  );
}

export default SideNav;