import React from 'react';
import {Masonry} from 'react-masonry-component2';
import './MasonryLayout.css'; // 引入样式文件

const MasonryLayout = ({ items }) => {
    return(
    <Masonry
    columnsCountBreakPoints={{
      1400: 2,
      1000: 2,
      700: 2,
    }}
  >
    {items.map((item, index) => (
        <div key={index} className="masonry-item">
          {item}
        </div>
      ))}
  </Masonry>
    );
};

export default MasonryLayout;