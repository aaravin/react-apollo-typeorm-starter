import React from 'react';
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import history from '../misc/history';
import './LoginPage.css';
import { config } from '@fortawesome/fontawesome-svg-core';

const LoginPage = () => {
  const handleLoginClick = () => {
    // TODO: @aaravin - handle FB Login and subsequent calls via await vs nesting 
    FB.login(res => {
      if (res.authResponse) {
        // let accessTokenRes = await axios.post('auth/facebook', null, { headers: {
        //   'access_token': res.authResponse.accessToken
        // }});
        // if (accessTokenRes.status === 200) {
        //   const token = accessTokenRes.headers.get('access_token');
        //   if (token) {
        //     localStorage.setItem('instacraft_token', token);
        //     history.push('/');
        //   }
        // }

        axios.post('auth/facebook', 
          null,  
          { 
            headers: {
              'access_token': res.authResponse.accessToken
            }
          }
          ).then(res => {
          if (res.status === 200) {
            const token = res.headers.get('access_token');
            if (token) {
              localStorage.setItem('instacraft_token', token);
              history.push('/');
            }
          } else {
            console.log('LOGIN ERROR', res);
          }
        });
        // fetch('auth/facebook', {
        //   method: 'POST',
        //   headers: {
        //     'access_token': res.authResponse.accessToken
        //   }
        // }).then(res => {
        //   if (res.status === 200) {
        //     const token = res.headers.get('access_token');
        //     if (token) {
        //       localStorage.setItem('instacraft_token', token);
        //       history.push('/');
        //     }
        //   } else {
        //     console.log('LOGIN ERROR', res);
        //   }
        // });
      }
    }, {scope: 'public_profile,email'});
  }

  return (
    <div className='LoginPage'>
      <button onClick={handleLoginClick}>
        <FontAwesomeIcon icon={['fab', 'facebook-square']} />
        LOG IN WITH FACEBOOK
      </button>
    </div>
  );
}

export default LoginPage;