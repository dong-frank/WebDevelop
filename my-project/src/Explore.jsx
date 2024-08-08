import SideNav from "./SideNav";
import TopNav from "./TopNav";
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import MasonryLayout from "./MasonryLayout";
import './Explore.css';
import * as axios from 'axios'
const client = axios.default;

function Explore() {
  const [items, setItems] = useState([]);
  const navigate = useNavigate()
  useEffect(() => {
    // 发送 GET 请求获取文章数据
    client.get('http://127.0.0.1:7001/api/explore')
      .then(response => {
        // 处理成功响应
        const articles = response.data.data;
        const formattedItems = articles.map((article, index) => (
          console.log("image[0]",article),
          <div key={index} className="masonary-item" onClick={() => handleItemClick(article)}>
            <img src={article.images[0]} alt={article.title} />
            <h>{article.title}</h>
            {/* <p>{article.content}</p> */}
          </div>
        ));
        setItems(formattedItems);
      })
      .catch(error => {
        // 处理错误响应
        console.error('Error fetching articles:', error);
      });
  }, []);

  const handleItemClick = (article) => {
    console.log('You clicked:', article);
    navigate(`/article/${article.id}`);
  }
  // const items = [
  //   <div className="masonary-item"><img src='src/assets/test1.png'/><h>item1</h><p>内容</p></div>,
  //   <div className="masonary-item"><img src='src/assets/test2.jpg'/><h>item2</h></div>,
  //   <div className="masonary-item"><img src='src/assets/test2.jpg'/><h>item3</h></div>,
  //   <div className="masonary-item"><img src='src/assets/test1.png'/><h>item1</h></div>,
  //   <div className="masonary-item"><img src='src/assets/test1.png'/><h>item2</h></div>,
  //   <div className="masonary-item"><img src='src/assets/test1.png'/><h>item3</h></div>,
  // ];

  return (
    <>
    <SideNav />
    <TopNav />
    <div className="masonry">
      <MasonryLayout items={items} />
    </div>
    </>
  );
}

export default Explore;