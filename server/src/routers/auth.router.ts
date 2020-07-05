import 'dotenv/config';
import express from 'express';
import passport from 'passport';
import FacebookTokenStrategy from 'passport-facebook-token';
import { User } from '../entities/User';
import {
  generateToken,
  sendToken
} from '../utils/authUtils';
import {
  genUploadImageFromUrl,
} from '../utils/uploadUtils';

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
      console.log("HEREEEEEE");
      console.log(profile.photos[0].value);
      const existingUser = await User.findOne({ email });
      if (!existingUser) {
        console.log("CREATING NEW USER!");
        const newUser = new User();
        newUser.email = email;
        const uploadedProfilePicUrl = await genUploadImageFromUrl(profile.photos[0].value);
        if (uploadedProfilePicUrl !== null) {
          newUser.profileImageURL = uploadedProfilePicUrl;
        }
        await newUser.save();
      } else {
        if (existingUser.profileImageURL === null) {
          const uploadedProfilePicUrl = await genUploadImageFromUrl(profile.photos[0].value);
          if (uploadedProfilePicUrl !== null) {
            existingUser.profileImageURL = uploadedProfilePicUrl;
            await existingUser.save();
          }
        }
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
  console.log(req);
  req.auth = {
    email: req.user.email
  };
  next();
}, generateToken, sendToken);

export { authRouter };