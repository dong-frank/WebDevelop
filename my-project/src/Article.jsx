import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Article.css';
import SideNav from "./SideNav";
import TopNav from "./TopNav";
import * as axios from 'axios';
import { format } from 'date-fns'; // 导入 date-fns 的 format 函数

const client = axios.default;
function Article() {
    const { id } = useParams();

    const [article, setArticle] = useState(null);
    const [author, setAuthor] = useState(null);
    const [author_name, setAuthorName] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [images, setImages] = useState([]);
    const [time, setTime] = useState('');
    const [like, setLike] = useState(0);
    const [view, setView] = useState(0);
    const [comment, setComment] = useState(0);
    const [currentImage, setCurrentImage] = useState(''); // 当前显示的图片
    const [isModalOpen, setIsModalOpen] = useState(false); // 控制模态框的显示
    
    useEffect(() => {
        const goTopButton = document.getElementById('go-top-button');
        if (goTopButton) {
            goTopButton.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth' // 平滑滚动
                });
            });
        }
        // 发送请求获取文章数据
        const fetchData = async () => {
            await client.get(`http://127.0.0.1:7001/api/explore/${id}`)
                .then(response => {
                    setArticle(response.data.data.article);
                    setAuthor(response.data.data.user);
                    setAuthorName(response.data.data.user.username);
                    setTitle(response.data.data.article.title);
                    setContent(response.data.data.article.content);
                    setImages(response.data.data.article.images);
                    setLike(response.data.data.article.likes);
                    // setView(response.data.data.article.view);
                    setComment(response.data.data.article.comments_count);
                    const formattedTime = format(new Date(response.data.data.article.created_at), 'yyyy-MM-dd HH:mm:ss');
                    setTime(formattedTime);
                    console.log('response:', response.data.data.article);
                })
                .catch(error => {
                    console.error('Error fetching article:', error);
                });
        }

        fetchData();
    }, [id]);

    console.log('id:', id);
    console.log('content:', content);

    const [currentIndex, setCurrentIndex] = useState(0);

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    };

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    };

    const openModal = (image) => {
        setCurrentImage(image);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };
    return (
        <>
            <SideNav />
            <TopNav />
            <div className="article-title">
                <h className="title">{title}</h>
                <p className="time">{time}</p>
                <p className="view">{view} 浏览</p>
                <p className="like">{like} 点赞</p>
                <p className="comment">{comment} 评论</p>
            </div>
            <div className="author">
                <img className='author-avatar' src="http://127.0.0.1:3000/default_avatar.png" />
                <h className='author-name'>{author_name}</h>
                <button className='follow-author'>关注作者</button>
                <button className='inside-interest'>进入圈子</button>
            </div>

            <div className='images-container'>
                <button className="prev" onClick={prevSlide}>❮</button>
                <div className="image-slider" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                    {images.map((src, index) => (
                        <img key={index} src={src} alt={`Image ${index + 1}`} onClick={() => openModal(src)} />
                    ))}
                </div>
                <button className="next" onClick={nextSlide}>❯</button>
            </div>

            <div className="content">
                <p>{content}</p>
            </div>
            <div className='right-content'>
                <button className='like-button'></button>
                <button className='comment-button'></button>
                <button className='go-top' id="go-top-button"></button>
            </div>
            <div className="comments">
                <h>评论</h>
            </div>
            {isModalOpen && (
                <div className="modal-article" onClick={closeModal}>
                    <span className="close-modal-article" onClick={closeModal}>&times;</span>
                    <img className="modal-content-article" src={currentImage} alt="Current" />
                </div>
            )}
        </>
    )
}

export default Article;