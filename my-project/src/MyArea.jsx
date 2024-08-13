import SideNav from "./SideNav";
import TopNav from "./TopNav";
import './MyArea.css';
import * as axios from 'axios';
import { useEffect, useState } from "react";
import { set } from "date-fns";
const client = axios.default;
function MyArea() {
  const [circleName, setCircleName] = useState('');
  const [circleIntro, setCircleIntro] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [myCircles, setMyCircles] = useState([]);
  const [expandedCircles, setExpandedCircles] = useState({});
  const [circleExperience, setCircleExperience] = useState([]);

  const handleToggleExpand = (circleId) => {
    setExpandedCircles(prevState => ({
      ...prevState,
      [circleId]: !prevState[circleId]
    }));
  };

  useEffect(() => {
    const fetchCircleExperience = async () => {
      const circleIds = Object.keys(expandedCircles).filter(id => expandedCircles[id]);
      if (circleIds.length > 0) {
        const circleId = circleIds[0]; // 假设一次只展开一个圈子
        const response = await client.get(`http://127.0.0.1:7001/api/my-interest-circles-detail/${circleId}`);
        console.log('response:', response.data);
        setCircleExperience(response.data);
      }
    };
    fetchCircleExperience();

  }, [expandedCircles]);

  useEffect(() => {
    console.log("comments:", circleExperience);
  }, [circleExperience]);

  useEffect(() => {
    const fetchCircles = async () => {
      const token = sessionStorage.getItem('token');
      await client.post(`http://127.0.0.1:7001/api/my-interest-circles`, {
        token: token
      })
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

  async function uploadImageToServer(image) {
    const formData = new FormData();
    console.log('image:', image);
    formData.append('image', image);
    const response = await client.post('http://127.0.0.1:3000/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.imageUrl;
  }

  const handleCreateCircle = async () => {
    console.log("create circle")
    const token = sessionStorage.getItem('token');
    if (!token) {
      alert('用户不存在,请先注册或登录');
      return;
    } else {
      console.log('token:', token);
    }
    const formData = new FormData();
    formData.append('token', token);
    if (!circleName) {
      alert('圈子名称不能为空');
      return;
    }
    formData.append('name', circleName);
    if (!circleIntro) {
      setCircleIntro("这个圈主很懒，什么都没留下");
    }

    formData.append('intro', circleIntro);
    if (!imageFile) {
      alert('请上传圈子头像');
      return;
    }
    const avatarUrl = await uploadImageToServer(imageFile);
    formData.append('avatar', avatarUrl);
    const response = await client.post('http://127.0.0.1:7001/api/create-circle', formData, {
      headers: {
        'Authorization': `Bearer your-jwt-token`,
      },
    });
    alert(response.data.message);
    setCircleName('');
    setCircleIntro('');
    setImageFile(null);
  }
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };
  return (
    <>
      <SideNav />
      <TopNav />
      <div className='myinterestCircles'>
        <p className="mycircle-title">我的兴趣圈</p>
        {myCircles.map(circle => (
          <div key={circle.id} className={`mycircle-container ${expandedCircles[circle.id] ? 'expanded' : ''}`}>
            <img className="mycircle-avatar" src={circle.avatar} />
            <div className="mycircle-name">{circle.name}</div>
            <div className="mycircle-users">{circle.users.length}人</div>
            <button className="detail-button" onClick={() => handleToggleExpand(circle.id)}>
              {expandedCircles[circle.id] ? '收起' : '详细'}
            </button>
            {expandedCircles[circle.id] && (
              <div className="extra-content">
                <p className="circle-owner">创建者: {circle.users[0].username}</p>
                <p className="circle-intro">简介: {circle.intro}</p>
                <div className="circle-experience">
                  {circleExperience.map(experience => (
                    <div key={experience.id} className="experience-item">
                      <div className="user-in-circle">用户: {experience.username}</div>
                      <div className="exp-in-circle">经验: {experience.experience}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="createCircleContainer">
        <p className="createTitle">创建圈子</p>
        <div className="createRule">
          <p style={{fontSize: '16px',color: '#646cff'}} >「兴趣圈用户使用协议」</p>
          <p>（1） 反对宪法所确定的基本原则的；</p>

          <p>（2） 危害国家安全，泄露国家秘密，颠覆国家政权，破坏国家统一的；</p>

          <p>（3） 损害国家荣誉和利益的；</p>

          <p>（4） 歪曲、丑化、亵渎、否定英雄烈士事迹和精神，以侮辱、诽谤或者其他方式侵害英雄烈士的姓名、肖像、名誉、荣誉的；</p>

          <p>（5） 宣扬恐怖主义、极端主义或者煽动实施恐怖活动、极端主义活动的；</p>

          <p>（6） 煽动民族仇恨、民族歧视，破坏民族团结的；</p>

          <p>（7） 破坏国家宗教政策，宣扬邪教和封建迷信的；</p>

          <p>（8） 散布谣言，扰乱经济秩序和社会秩序的；</p>

          <p>（9） 散布淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪、引诱自杀的；</p>

          <p>（10） 侮辱或者诽谤他人，侵害他人名誉、隐私和其他合法权益的；</p>

          <p>（11） 侵害未成年人合法权益或可能危害未成年人身心健康的；</p>

          <p>（12） 法律、行政法规禁止的其他行为或内容。</p>
        </div>
        <input
          className="inputCircleName"
          type="text"
          placeholder="请输入圈子名称"
          value={circleName}
          onChange={(e) => setCircleName(e.target.value)}
        />
        <div className="circleAvatarWrapper" onClick={() => document.getElementById('avatarInput').click()}>
          <input
            className="inputCircleAvatar"
            type="file"
            id="avatarInput"
            accept="image/*"

            onChange={handleImageChange}
          />
          <div className="circleAvatarPreview">
            {imagePreview ? (
              <img src={imagePreview} alt="Circle Avatar Preview" style={{ width: '100px', height: '100px' }} />
            ) : (
              <span></span>
            )}
          </div>
        </div>
        <div className="inputCircleIntro">
          <textarea
            className="inputCircleIntro"
            placeholder="请输入圈子简介"
            value={circleIntro}
            onChange={(e) => setCircleIntro(e.target.value)}
          />
        </div>
        <button className="createCircle" onClick={() => handleCreateCircle()}>创建圈子</button>
      </div>
    </>

  );
}

export default MyArea;