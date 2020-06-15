import 'dotenv/config';
import 'reflect-metadata';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import compression from 'compression';
import cors from 'cors';
import passport from 'passport';
import path from 'path';
import {
  createConnection,
  getConnectionOptions,
  ConnectionOptions
} from 'typeorm';
import { createSchema } from './utils/createSchema';
import { authRouter } from './routers/auth.router';
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
    }
  });

  const app = express();

  const port = process.env.PORT || 3001;
  app.set('port', (process.env.PORT || port));

  app.use(cors());
  app.use(compression());

  app.use(cookieParser());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(session({
    secret: process.env.SESSION_SECRET || '',
    resave: false,
    saveUninitialized: false
  }));
  app.use(passport.initialize());
  app.use(passport.session());

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, '../../client/build')));
  }

  app.use('/auth', authRouter);

  apolloServer.applyMiddleware({ app, path: '/graphql' });

  app.get('/', (_, res) => {
    res.sendFile(path.resolve(__dirname, '../../client/build/index.html'));
  });

  app.listen(
    port,
    () => console.log(`Apollo Server now running on http://localhost:${port}/graphql`)
  );
}

server();