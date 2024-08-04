import { useEffect, useState } from 'react'
import './Publish.css'
import { useNavigate } from 'react-router-dom'
import SideNav from './SideNav'
import TopNav from './TopNav'
import * as axios from 'axios'
const client = axios.default;

function Publish() {
  const [count, setCount] = useState(0)
  const navigate = useNavigate()
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [isListOpen, setIsListOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const toggleList = () => {
    setIsListOpen(!isListOpen);
  }
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      return new Promise((resolve) => {
        reader.onloadend = () => {
          resolve(reader.result);
        };
      });
    });

    Promise.all(newImages).then((imagePreviews) => {
      setImages((prevImages) => {
        const totalImages = prevImages.length + imagePreviews.length;
        if (totalImages > 6) {
          alert('最多只能添加 6 张图片');
          return prevImages;
        }
        return [...prevImages, ...imagePreviews];
      });
    });
  };

  const handleTagSelection = (tag) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tag) ? prevTags.filter((t) => t !== tag) : [...prevTags, tag]
    );
  };

  const handlePublish = async () => {

    const formData = new FormData();
    const token = sessionStorage.getItem('token');
    if (!token) {
      alert('用户不存在,请先注册或登录');
      return;
    }else{
      console.log('token:',token);
    }
    if(!title){
      alert('标题不能为空');
      return;
    }
    formData.append('title', title);
    if(!content){
      content=title;
    }
    formData.append('content', content);
    formData.append('tags', JSON.stringify(selectedTags));
    formData.append('token', token);
    if (images.length === 0) {
      images[0]=null;
    }
    images.forEach((image, index) => {
      formData.append(`images[${index}]`, image);
    });
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }
    try {
      const response = await client.post('http://127.0.0.1:7001/api/publish', formData,{
        headers: {
          'Authorization': `Bearer your-jwt-token`,
        },
      });
      alert(response.data.message);
      setTitle('');
      setContent('');
      setSelectedTags([]);
      setImages([]);
    } catch (error) {
      alert('发布失败' + error.response.data.message);
    }

  }

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const removeImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  return (
    <>
      <SideNav />
      <TopNav />
      <div className='image-upload'>
        <div className='image-input-wrapper' style={{ left: `${250 + images.length * 110}px` }} onClick={() => document.getElementById('file').click()}>
          <input className='image-input' type='file' id='file' accept='image/*' onChange={handleImageChange} />
        </div>
        <div className='image-previews'>
          {images.map((image, index) => (
            <div key={index} className='image-preview-wrapper'>
              <img key={index} src={image} alt={'preview ${index}'} className='image_preview' onClick={() => handleImageClick(image)} />
              <span className="remove-image" onClick={() => removeImage(index)}>&times;</span>
            </div>
          ))}
        </div>
      </div>
      {selectedImage && (
        <div className="modal" onClick={closeModal}>
          <span className="close" onClick={closeModal}>&times;</span>
          <img className="modal-content" src={selectedImage} alt="Selected" />
        </div>
      )}

      <input type='text' placeholder='填写标题会有更多赞噢~' className='title_input' value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea placeholder='添加正文' className='content_input' value={content} onChange={(e) => setContent(e.target.value)} />
      <div className="tags">
        <h2>标签</h2>
        {['#鼠鼠', '#小动物', '#可爱'].map((tag) => (
          <button
            key={tag}
            className={`tag ${selectedTags.includes(tag) ? 'selected' : ''}`}
            onClick={() => handleTagSelection(tag)}
          >
            {tag}
          </button>

        ))}
      </div>

      <div className="atfriends">
        <button onClick={toggleList}>
          {isListOpen ? '@圈好友' : '@圈好友'}
        </button>
        {isListOpen && (
          <ul>
            <li>小铫</li>
            <li>幺幺</li>
            <li>屁屁</li>
            {/* 添加更多列表项 */}
          </ul>
        )}
      </div>

      <div className="publish-button">
        <button onClick={() => handlePublish()}>发布</button>
      </div>

      <div className='draft-button'>
        <button>存草稿</button>
      </div>
    </>
  )
}
export default Publish
