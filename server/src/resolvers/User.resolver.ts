import { Resolver, Query, Ctx } from 'type-graphql';
import User from '../entities/User';

interface ContextType {
  user: User
}

@Resolver()
export default class UserResolver {
  @Query(() => String)
  async hello(@Ctx() context: ContextType) {
    const email = context.user && context.user.email;
    return email;
  }
}
