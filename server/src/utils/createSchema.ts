import { buildSchema } from "type-graphql";
import { UserResolver } from "./../resolver/User.resolver";

export const createSchema = () =>
  buildSchema({
    resolvers: [UserResolver]
  });