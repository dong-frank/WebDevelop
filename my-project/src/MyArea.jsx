import SideNav from "./SideNav";
import TopNav from "./TopNav";
import './MyArea.css';
import * as axios from 'axios';
const client = axios.default;
function MyArea() {


  const handleCreateCircle = async() =>{
    console.log("create circle")
    const token = sessionStorage.getItem('token');
    if (!token) {
      alert('用户不存在,请先注册或登录');
      return;
    } else {
      console.log('token:', token);
    }
    const response = await client.post('http://127.0.0.1:7001/api/create-circle', {
      name: '圈子名称',
      avatar: '圈子头像',
      token: token
    });
    alert(response.data.message);

  }
  return (
    <>
    <SideNav />
    <TopNav />
    <button className="createCircle" onClick={() => handleCreateCircle()}>创建圈子</button>
    </>
    
  );
}

export default MyArea;