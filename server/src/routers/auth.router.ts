import 'dotenv/config';
import express from 'express';
import passport from 'passport';
import FacebookTokenStrategy from 'passport-facebook-token';
import axios from 'axios';
import qs from 'qs';
import { User } from '../entities/User';
import {
  generateToken,
  sendToken
} from '../utils/authUtils';

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

passport.use(
  new FacebookTokenStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID || '',
      clientSecret: process.env.FACEBOOK_APP_SECRET || ''
    },
    async (_accessToken, _refreshToken, profile, done) => {
      const { email } = profile._json;
      const existingUser = await User.findOne({ email });
      if (!existingUser) {
        const newUser = new User();
        newUser.email = email;
        await newUser.save();
      }
      done(null, profile);
    }
  )
);

const authRouter = express.Router();

authRouter.post('/facebook', passport.authenticate('facebook-token'), (req: any, res: any, next: any) => {
  if (!req.user) {
    return res.send(400);
  }
  req.auth = {
    email: req.user._json.email
  };
  next();
}, generateToken, sendToken);

authRouter.get('/instagram', (req, res) => {
  const code = req.query.code;
  const serverRedirectURL = process.env.NODE_ENV === 'production' ? 'https://instacraft.herokuapp.com' : 'https://localhost:3001';
  axios.post('https://api.instagram.com/oauth/access_token', qs.stringify({
    client_id: '629382497651717',
    client_secret: 'e2620dce262e82ccf13b813d8388e511',
    grant_type: 'authorization_code',
    redirect_uri: `${serverRedirectURL}/auth/instagram`,
    code: code,
  })).then(response => {
    const { access_token, user_id } = response.data;
    if (req.session) {
      req.session.ig_access_token = access_token;
      req.session.ig_user_id = user_id;
    }
    const browserRedirectURL = process.env.NODE_ENV === 'production' ? 'https://instacraft.herokuapp.com' : 'https://localhost:3000';
    res.redirect(browserRedirectURL);
  }).catch(e => {
    console.log('ERROR', e);
  });
});

export { authRouter };