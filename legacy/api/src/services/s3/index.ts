import AWS from 'aws-sdk';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION } = process.env;

AWS.config.update({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  region: AWS_REGION
});

const s3 = new AWS.S3();

const uploadS3 = async (file, folder) => {
  try {
    const body = fs.readFileSync(file);

    const filename = `${uuidv4()}-${path
    .basename(file)
    .toLowerCase()
    .replace(/%20/g, '-')
    .replace(/\s/g, '-')}`;
  
  const params = {
    Bucket: 'public.moove.fit',
    Body: body,
    Key: `${folder}/media/${filename}`,
    ACL: 'public-read',
    StorageClass: 'REDUCED_REDUNDANCY',
  };

  return s3
    .putObject(params)
    .promise()
    .then(() => {
      return `${folder}/media/${filename}`;
    })
    .catch(function (err) {
      console.error('[Upload Error]:', err);
      return err;
    });
  } catch (e) {
    console.error('err', e)
  }

};

const uploadS3Buffer = async (file, path) => {
  const params = {
    Bucket: 'public.moove.fit',
    Body: file,
    Key: path,
    ACL: 'public-read',
    StorageClass: 'REDUCED_REDUNDANCY',
    ContentType: 'video/mp4;',
  };

  return s3
    .putObject(params)
    .promise()
    .then(() => {
      return path;
    })
    .catch(function (err) {
      console.error('[Upload Error]:', err);
    });
};

const checkInS3 = async (file, folder) => {
  const filename = path
    .basename(file)
    .toLowerCase()
    .replace(/%20/g, '-')
    .replace(/\s/g, '-');

  const params = {
    Bucket: 'public.moove.fit',
    Key: `${folder}/media/${filename}`, //if any sub folder-> path/of/the/folder.ext
  };

  try {
    const object = await s3.headObject(params).promise();
    if (!!object) return true;
  } catch (err) {
    // console.log("File not Found ERROR : " + err.code);
    return false;
  }
  return true;
};

export {
  uploadS3,
  uploadS3Buffer,
  checkInS3
}