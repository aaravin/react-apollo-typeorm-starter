import { Resolver, Query, Arg, Mutation} from 'type-graphql';
import {
  genSignedUrl,
} from '../utils/uploadUtils';
@Resolver()
export class UtilResolver {
  @Query(() => String)
  async hello2() {
    return 'hello2';
	}
	

  @Mutation(() => String)
  async signedUploadUrl(
		@Arg("filename") filename: string,
		@Arg("filetype") filetype: string,
  ) {
    return genSignedUrl(filename, filetype);
	}
}

// @ObjectType()
// export class SignedUploadUrlResponse {
//     @Field()
// 		public filename: string;
// 		@Field()
//     public filetype: string;
// }