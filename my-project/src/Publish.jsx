import { useEffect, useState } from 'react'
import add_Img from './assets/add_image.svg'
import './Publish.css'
import { useNavigate } from 'react-router-dom'
import SideNav from './SideNav'

function Publish() {
  const [count, setCount] = useState(0)
  const navigate = useNavigate()

  const [selectedTags, setSelectedTags] = useState([]);
  const [isListOpen, setIsListOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const toggleList = () => {
    setIsListOpen(!isListOpen);
  }


  const handleTagSelection = (tag) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tag) ? prevTags.filter((t) => t !== tag) : [...prevTags, tag]
    );
  };

  const handlePublish = () => {
    // 发布逻辑
    console.log('title:', title);
    console.log('content:', content);
  }

  return (
    <>
      <SideNav />
      <img className='test_img' src='src/assets/test1.png' />
      <img className='add_img' src={add_Img} />

      <input type='text' placeholder='填写标题会有更多赞噢~' className='title_input' value={title} onChange={(e) => setTitle(e.target.value)}/>
      <textarea placeholder='添加正文' className='content_input' value={content} onChange={(e) => setContent(e.target.value)}/>
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
