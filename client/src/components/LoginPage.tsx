import React, { useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import history from '../misc/history';
import './LoginPage.css';

const LoginPage = () => {
  useEffect(() => {
    localStorage.removeItem('instacraft_token');
  }, []);

  const handleLoginClick = () => {
    // TODO: @aaravin - handle FB Login and subsequent calls via await vs nesting
    FB.login((res) => {
      if (res.authResponse) {
        axios.post('auth/facebook', null, {
          headers: {
            access_token: res.authResponse.accessToken,
          },
        }).then((response) => {
          if (response.status === 200) {
            const token = response.headers.access_token;
            if (token) {
              localStorage.setItem('instacraft_token', token);
              history.push('/');
            }
          } else {
            console.log('LOGIN ERROR', res);
          }
        }).catch((e) => console.log('LOGIN ERROR', e));
      }
    }, { scope: 'public_profile,email' });
  };

  return (
    <div className="LoginPage">
      <button className="login-fb-button" onClick={handleLoginClick}>
        <FontAwesomeIcon icon={['fab', 'facebook-square']} />
        LOG IN WITH FACEBOOK
      </button>
    </div>
  );
};

export default LoginPage;
