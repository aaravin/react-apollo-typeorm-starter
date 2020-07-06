import React from 'react';
import './ImageList.css';

type ImageListProps = {
  images: string[]
}

const ImageList = ({ images }: ImageListProps) => {
  const imageElements = images.map((imageURL, index) => <img alt={`post ${index}`} className="post-image" src={imageURL} />);
  return (
    <div className="ImageList">
      {imageElements}
    </div>
  );
};

export default ImageList;
