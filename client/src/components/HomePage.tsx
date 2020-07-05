import React, { useEffect } from 'react';
import axios from 'axios';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import './HomePage.css';

const HELLO = gql`
  {
    hello
  }
`;

const HomePage = () => {
  useEffect(() => {
    axios.get('/ig_posts').then(res => {
      console.log('BROWSER RES', res);
    }).catch(e => {
      console.log('BROWSER E', e);
    });
  }, []);

  const { data } = useQuery(HELLO);
  const redirectURL = process.env.NODE_ENV === 'production' ? 'https://instacraft.herokuapp.com' : 'https://localhost:3001'
  return (
    <div className='HomePage'>
      <a href={`https://www.instagram.com/oauth/authorize?client_id=629382497651717&redirect_uri=${redirectURL}/auth/instagram&scope=user_profile,user_media&response_type=code`}>
        Login with Instagram
      </a>
      Welcome, {data && data.hello}
    </div>
  );
}

export default HomePage;