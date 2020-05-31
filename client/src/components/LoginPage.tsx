import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import history from '../misc/history';
import './LoginPage.css';

const LoginPage = () => {
  const handleLoginClick = () => {
    FB.login(res => {
      if (res.authResponse) {
        fetch('auth/facebook', {
          method: 'POST',
          headers: {
            'access_token': res.authResponse.accessToken
          }
        }).then(res => {
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