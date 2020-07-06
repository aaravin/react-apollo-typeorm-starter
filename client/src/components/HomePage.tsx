import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ImageList from './ImageList';
import './HomePage.css';

type PostData = {
  id: string,
  // eslint-disable-next-line camelcase
  media_url: string,
  permalink: string,
}

const HomePage = () => {
  const [images, setImages] = useState([]);
  useEffect(() => {
    axios.get('/ig_posts').then((res) => {
      if (res.data && res.data.data) {
        const imageURLs = res.data.data.map((postData: PostData) => postData.media_url);
        setImages(imageURLs);
      }
    }).catch((e) => {
      console.log('ERROR FETCHING POSTS', e);
    });
  }, []);

  const handleFetchPostsClick = () => {
    const redirectURL = process.env.NODE_ENV === 'production' ? 'https://instacraft.herokuapp.com' : 'https://localhost:3001';
    window.location.replace(`https://www.instagram.com/oauth/authorize?client_id=629382497651717&redirect_uri=${redirectURL}/auth/instagram&scope=user_profile,user_media&response_type=code`);
  };

  return (
    <div className="HomePage">
      <button className="fetch-posts-button" onClick={handleFetchPostsClick}>Fetch Instagram Posts</button>
      <div className="home-page-content">
        <ImageList images={images} />
      </div>
    </div>
  );
};

export default HomePage;
