import 'dotenv/config';
import jwt from 'jsonwebtoken';
import expressJwt from 'express-jwt';

const createToken = (auth: any) => {
  return jwt.sign({
    email: auth.email
  }, process.env.JWT_SECRET || '',
    {
      expiresIn: 60 * 120
    });
};

const generateToken = (req: any, _: any, next: any) => {
  req.token = createToken(req.auth);
  next();
};

const sendToken = (req: any, res: any) => {
  res.setHeader('access_token', req.token);
  res.status(200).send(req.auth);
};

const authenticate = expressJwt({
  secret: process.env.JWT_SECRET || '',
  requestProperty: 'auth',
  getToken: function(req: any) {
    if (req.headers['access_token']) {
      return req.headers['access_token'];
    }
    return null;
  }
});

export {
  generateToken,
  sendToken,
  authenticate
}