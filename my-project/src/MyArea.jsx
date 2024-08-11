import SideNav from "./SideNav";
import TopNav from "./TopNav";
import './MyArea.css';
import * as axios from 'axios';
import { useEffect } from "react";
const client = axios.default;
function MyArea() {
  const [myCircles, setMyCircles] = useState([]);

  useEffect(() => {
    const fetchCircles = async () => {
      await client.get(`http://127.0.0.1:7001/api/my-interest-circles`)
        .then(response => {
          setMyCircles(response.data.data);
          console.log('Circles fetched:', response.data.data);
          //todo:
        })
        .catch(error => {
          console.error('Error fetching circles:', error);
        });
    }

    fetchCircles();
  }, [])

  const handleCreateCircle = async () => {
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