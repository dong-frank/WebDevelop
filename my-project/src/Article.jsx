import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Article.css';
import SideNav from "./SideNav";
import TopNav from "./TopNav";

function Article() {
    const { id } = useParams();
    const [article, setArticle] = useState(null);
    console.log('id:', id);
    const author = '张三';
    const view = 100;
    const like = 100;
    const comment = 100;

    const [currentIndex, setCurrentIndex] = useState(0);

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    };

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    };

    const images = [
        "image1.jpg",
        "image2.jpg",
        "image3.jpg",
        // 添加更多图片路径
    ];
    return (
        <>
            <SideNav />
            <TopNav />
            <div className="article-title">
                <h className="title">文章标题</h>
                <p className="time">2024年8月6日22点04分</p>
                <p className="view">{view} 浏览</p>
                <p className="like">{like} 点赞</p>
                <p className="comment">{comment} 评论</p>
            </div>
            <div className="author">
                <img className='author-avatar' src="http://127.0.0.1:3000/9ba69ee6fac33bd14b7e00300.png" />
                <h className='author-name'>{author}</h>
                <button className='follow-author'>关注作者</button>
                <button className='inside-interest'>进入圈子</button>
            </div>

            <div className='images-container'>
                <button className="prev" onClick={prevSlide}>❮</button>
                <div className="image-slider" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                    {images.map((src, index) => (
                        <img key={index} src={src} alt={`Image ${index + 1}`} />
                    ))}
                </div>
                <button className="next" onClick={nextSlide}>❯</button>
            </div>

            <div className="content">
                <p>文章内容</p>
            </div>

            <div className="comments">
                <h>评论</h>
            </div>

        </>
    )
}

export default Article;