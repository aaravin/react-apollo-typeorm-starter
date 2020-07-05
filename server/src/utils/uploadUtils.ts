import 'dotenv/config';
import * as AWS from 'aws-sdk'
import axios from 'axios'
import { v4 as uuid } from 'uuid';

const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID as string;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY as string;
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME as string;
const S3_BUCKET_REGION = process.env.S3_BUCKET_REGION as string;

enum UPLOAD_TYPE {
  JPEG,
  PNG
}

const signedUrlExpiresSeconds = 60*10; // 10 minutes

AWS.config.update({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  region: S3_BUCKET_REGION,
});
const s3 = new AWS.S3();

const genSignedUrl = async (fileName: string, fileType: string) => {
  // fileData contains `name` and `type` properties
  const params = {
    ACL: 'public-read',
    Bucket: S3_BUCKET_NAME,
    ContentType: fileType,
    Expires: signedUrlExpiresSeconds,
    Key: fileName,
  };
  const url = await s3.getSignedUrlPromise('putObject', params);
  return url; 
};

const genUploadImageFromUrl = async (url: string, type: UPLOAD_TYPE = UPLOAD_TYPE.JPEG): Promise<string|null> => {
  try {
    const response = await axios.get(encodeURI(url), { responseType: 'arraybuffer' });
    console.log("GOT THE IMAGE FROM URL")
    var fileType = 'image/jpeg';
    var fileExt = '';
    switch(type) {
      case (UPLOAD_TYPE.PNG) :
        fileType = 'image/png';
        fileExt = '.png'
        break;
      default:
        fileType = 'image/jpeg';
        fileExt = '.jpg'
        break;
    }
    var fileKey = uuid() + fileExt;
    const params = {
      ACL: 'public-read',
      Body: response.data,
      Bucket: S3_BUCKET_NAME,
      Key: 'img/' + fileKey,
      ContentType: fileType
    };
    const uploadRes = await s3.upload(params).promise();
    return uploadRes.Location;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export {
  genSignedUrl,
  genUploadImageFromUrl,
}