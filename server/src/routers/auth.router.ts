import 'dotenv/config';
import express from 'express';
import passport from 'passport';
import FacebookTokenStrategy from 'passport-facebook-token';
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

export { authRouter };