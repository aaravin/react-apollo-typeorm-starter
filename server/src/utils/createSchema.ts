import { buildSchema } from 'type-graphql';
import UserResolver from '../resolvers/User.resolver';
import UtilResolver from '../resolvers/Util.resolver';

export default () => buildSchema({
  resolvers: [UserResolver, UtilResolver],
});
