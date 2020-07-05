import { buildSchema } from 'type-graphql';
import { UserResolver } from '../resolvers/User.resolver';
import { UtilResolver } from '../resolvers/Util.resolver';

export const createSchema = () =>
  buildSchema({
    resolvers: [UserResolver, UtilResolver]
  });