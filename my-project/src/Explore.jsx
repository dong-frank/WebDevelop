import SideNav from "./SideNav";
import TopNav from "./TopNav";
import React from 'react';
import MasonryLayout from "./MasonryLayout";
import './Explore.css';


function Explore() {
  const items = [
    <div className="masonary-item"><img src='src/assets/test1.png'/><h>item1</h><p>内容</p></div>,
    <div className="masonary-item"><img src='src/assets/test2.jpg'/><h>item2</h></div>,
    <div className="masonary-item"><img src='src/assets/test2.jpg'/><h>item3</h></div>,
    <div className="masonary-item"><img src='src/assets/test1.png'/><h>item1</h></div>,
    <div className="masonary-item"><img src='src/assets/test1.png'/><h>item2</h></div>,
    <div className="masonary-item"><img src='src/assets/test1.png'/><h>item3</h></div>,
  ];

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