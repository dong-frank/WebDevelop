import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Article.css';
import SideNav from "./SideNav";
import TopNav from "./TopNav";
import * as axios from 'axios';
import { format, set } from 'date-fns'; // 导入 date-fns 的 format 函数
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const client = axios.default;
function Article() {
    const { id } = useParams();

    const [article, setArticle] = useState(null);
    const [author, setAuthor] = useState(null);
    const [author_name, setAuthorName] = useState('');
    const [title, setTitle] = useState('');
    const [tags, setTags] = useState([]);
    const [content, setContent] = useState('');
    const [images, setImages] = useState([]);
    const [time, setTime] = useState('');
    const [like, setLike] = useState(0);
    const [view, setView] = useState(0);
    const [commentCount, setCommentCount] = useState(0);
    const [comment, setComment] = useState([]);
    const [currentImage, setCurrentImage] = useState(''); // 当前显示的图片
    const [isModalOpen, setIsModalOpen] = useState(false); // 控制模态框的显示

    const [commentContentInput, setCommentContentInput] = useState('');

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

        const updateViewCount = async () => {
            try {
                await client.post(`http://127.0.0.1:7001/api/view/${id}`);
                console.log('View count updated');
            } catch (error) {
                console.error("Error updating view count:", error);
            }
        };

        // 发送请求获取文章数据
        const fetchData = async () => {
            updateViewCount();
            await client.get(`http://127.0.0.1:7001/api/explore/${id}`)
                .then(response => {
                    setArticle(response.data.data.article);
                    setAuthor(response.data.data.user);
                    setAuthorName(response.data.data.user.username);
                    setTitle(response.data.data.article.title);
                    setTags(response.data.data.article.tags);
                    setContent(response.data.data.article.content);
                    setImages(response.data.data.article.images);
                    setLike(response.data.data.article.likes);
                    setView(response.data.data.article.views);
                    setCommentCount(response.data.data.article.comments_count);
                    const formattedTime = format(new Date(response.data.data.article.created_at), 'yyyy-MM-dd HH:mm:ss');
                    setTime(formattedTime);
                    setComment(response.data.data.article.comments);
                    //todo:

                })
                .catch(error => {
                    console.error('Error fetching article:', error);
                });
        }

        fetchData();
    }, [id]);

    useEffect(() => {
        console.log("comments:", comment);
        setComment(comment);
    }, [comment]);

    useEffect(() => {
        async function getExperience() {
            await client.post('http://127.0.0.1:7001/api/experience', {
                token: sessionStorage.getItem('token'),
                circleId: article.circle.id,
                experience: 1
            });
            toast.success('每日浏览文章，经验+1', {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
        getExperience();
    }, [article]);


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

    const handlelLike = async () => {
        setLike(like + 1);
        console.log('like:', like);
        try {
            await client.post(`http://127.0.0.1:7001/api/like/${id}`)
        } catch (error) {
            console.error('Error liking article:', error);
        }
    }

    const handleComment = async () => {
        //TODO:
        // console.log('comment:');
    }

    const handleCommentPublish = async () => {
        const formData = new FormData();
        const token = sessionStorage.getItem('token');
        if (!token) {
            alert('用户不存在,请先注册或登录');
            return;
        } else {
            console.log('token:', token);
        }
        if (!commentContentInput) {
            alert('评论不能为空');
        }
        formData.append('token', token);
        formData.append('article_id', id);
        formData.append('content', commentContentInput);

        try {
            const response = await client.post('http://127.0.0.1:7001/api/comment', formData, {
                headers: {
                    'Authorization': `Bearer your-jwt-token`,
                },
            });
            alert(response.data.message);
            setCommentContentInput('');

            await client.post('http://127.0.0.1:7001/api/experience', {
                token: sessionStorage.getItem('token'),
                circleId: response.data.data.circle.id,
                experience: 4
            });
            toast.success('评论文章，经验+4', {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            
        } catch (error) {
            alert('评论失败' + error.response.data.message);
        }


    }

    return (
        <>
            <SideNav />
            <TopNav />
            <ToastContainer />
            <div className="article-title">
                <h className="title">{title}</h>
                <p className="time">{time}</p>
                <p className="view">{view} 浏览</p>
                <p className="like">{like} 点赞</p>
                <p className="comment">{commentCount} 评论</p>
            </div>
            <div className="article-tags">
                #{tags}
            </div>
            <div className="author">
                <img className='author-avatar' src="http://127.0.0.1:3000/default_avatar.png" />
                <h className='author-name'>{author_name}</h>
                
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
                <button className='like-button' onClick={() => handlelLike()}></button>
                <button className='go-top' id="go-top-button"></button>
            </div>
            <div className="comments">
                {comment.map(comment => (
                    <div key={comment.id} className="comment-container">
                        <img className="comment-avatar" src="http://127.0.0.1:3000/default_avatar.png" />
                        <div className="comment-author">{comment.author.username}</div>
                        <div className="comment-content">
                            <p>{comment.content}
                            </p>
                        </div>
                        <div className="comment-time">{format(new Date(comment.created_at), 'yyyy-MM-dd HH:mm:ss')}</div>
                    </div>
                ))}
            </div>

            <div className="comment-input">
                <input type="text" placeholder="分享你的观点" value={commentContentInput} onChange={(e) => setCommentContentInput(e.target.value)} />
                <img className="comment-input-avatar" src="http://127.0.0.1:3000/default_avatar.png" />
                <button className='comment-publish' onClick={() => handleCommentPublish()}>发布</button>
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