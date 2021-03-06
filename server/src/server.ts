import 'dotenv/config';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import https from 'https';
import fs from 'fs';
import axios from 'axios';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cookieSession from 'cookie-session';
import compression from 'compression';
import cors from 'cors';
import passport from 'passport';
import path from 'path';
import {
  createConnection,
  getConnectionOptions,
  // eslint-disable-next-line no-unused-vars
  ConnectionOptions,
} from 'typeorm';
import createSchema from './utils/createSchema';
import authRouter from './routers/auth.router';
import { authenticate } from './utils/authUtils';

const server = async () => {
  let connectionOptions: ConnectionOptions;
  if (process.env.DATABASE_URL) {
    connectionOptions = {
      type: 'postgres',
      synchronize: true,
      logging: false,
      extra: {
        ssl: false,
      },
      entities: ['dist/entities/*.*'],
    };
    Object.assign(connectionOptions, { url: process.env.DATABASE_URL });
  } else {
    connectionOptions = await getConnectionOptions();
  }

  await createConnection(connectionOptions);

  const schema = await createSchema();

  const apolloServer = new ApolloServer({
    schema,
    context: async ({ req }) => {
      const user = await authenticate(req);
      if (!user) {
        throw new Error('Authentication failed');
      }
      return { user };
    },
  });

  const app = express();

  const port = process.env.PORT || 3001;
  app.set('port', (process.env.PORT || port));

  app.use(cors());
  app.use(compression());

  app.use(cookieParser());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieSession({
    secret: process.env.SESSION_SECRET || '',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  }));
  app.use(passport.initialize());
  app.use(passport.session());

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, '../../client/build')));
  }

  app.use('/auth', authRouter);

  app.get('/ig_posts', (req, res) => {
    if (req.session) {
      const accessToken = req.session.ig_access_token;
      axios.get(`https://graph.instagram.com/me/media?fields=id,caption,media_url,permalink,thumbnail_url&access_token=${accessToken}`)
        .then((response) => {
          res.send(response.data);
        })
        .catch((e) => console.log('ERROR FETCHING POSTS', e));
    } else {
      res.status(401);
    }
  });

  apolloServer.applyMiddleware({ app, path: '/graphql' });

  app.get('/', (_, res) => {
    res.sendFile(path.resolve(__dirname, '../../client/build/index.html'));
  });

  const httpServer = process.env.NODE_ENV === 'production' ? app : https.createServer({
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert'),
  }, app);

  httpServer.listen(
    port,
    () => console.log(`Apollo Server now running on https://localhost:${port}/graphql`),
  );
};

server();
