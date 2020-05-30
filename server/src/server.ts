// import 'dotenv/config';
import 'reflect-metadata';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import compression from 'compression';
import cors from 'cors';
import path from 'path';
import {
  createConnection,
  getConnectionOptions,
  ConnectionOptions
} from 'typeorm';
import { createSchema } from './utils/createSchema';

const server = async () => {
  let connectionOptions: ConnectionOptions;
  if (process.env.DATABASE_URL) {
    connectionOptions = {
      type: 'postgres',
      synchronize: true,
      logging: false,
      extra: {
        ssl: true,
      },
      entities: ['dist/entity/*.*'],
    };
    Object.assign(connectionOptions, { url: process.env.DATABASE_URL });
  } else {
    connectionOptions = await getConnectionOptions(); 
  }

  await createConnection(connectionOptions);

  const schema = await createSchema();

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }) => ({ req, res })
  });

  const app = express();

  const port = process.env.PORT || 3001;
  app.set('port', (process.env.PORT || port));

  app.use('*', cors());
  app.use(compression());

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, '../../client/build')));
  }

  apolloServer.applyMiddleware({ app, path: '/graphql' });

  app.get('/*', (_, res) => {
    res.sendFile(path.resolve(__dirname, '../../client/build/index.html'));
  });

  app.listen(
    port,
    () => console.log(`Apollo Server now running on http://localhost:${port}/graphql`)
  );
}

server();