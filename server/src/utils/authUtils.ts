import 'dotenv/config';
import jwt from 'jsonwebtoken';
import User from '../entities/User';

const createToken = (auth: any) => jwt.sign({
  email: auth.email,
}, process.env.JWT_SECRET || '',
{
  expiresIn: 60 * 120,
});

const generateToken = (req: any, _: any, next: any) => {
  req.token = createToken(req.auth);
  next();
};

const sendToken = (req: any, res: any) => {
  res.setHeader('access_token', req.token);
  res.status(200).send(req.auth);
};

const authenticate = async (req: any) => {
  const token = req.headers.auth;
  let jwtPayload: any;
  try {
    jwtPayload = jwt.verify(token, process.env.JWT_SECRET || '');
  } catch (e) {
    return null;
  }
  const { email } = jwtPayload;
  const matchedUser = await User.findOne({ email });
  return matchedUser || null;
};

export {
  generateToken,
  sendToken,
  authenticate,
};
