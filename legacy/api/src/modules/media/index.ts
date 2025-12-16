import { writeFileSync, unlinkSync } from 'fs';
import { parse, resolve, dirname } from 'path';
import ffmpeg from 'ffmpeg-static';
import getThumb from 'simple-thumbnail';
import DB from '../../services/dynamodb';
import { uploadS3 } from '../../services/s3';

const uploadAvatar = async (server: any, request: any, reply: any) => {
  const { file } = (request.raw as any).files;
  const { email } = request?.user;

  if (!email) {
    return reply.send({
      status: 'FAIL',
      error: 'wrong'
    });
  }

  const exists = await DB.USERS.get(email);

  if (!!exists?.Items?.length) {
    const user: any = exists.Items[0];
    const data = new Uint8Array(Buffer.from(file.data));

    try {
      writeFileSync(`./temp/${file.name}`, data);
    } catch (err) {
      console.error('write', err);
    }

    const upload = await uploadS3(`./temp/${file.name}`, `${user.id}`);

    try {
      unlinkSync(`./temp/${file.name}`);
    } catch (err) {
      console.error('delete', err);
    }

    if (upload) {
      return reply.send({
        status: 'SUCCESS',
        upload,
      });
    }

    return reply.send({
      status: 'FAIL',
      error: 'no_upload',
      stack: upload,
      code: 1002
    });
  }

  return reply.send({
    status: 'FAIL',
    error: 'wrong',
    code: 1001
  });
};


const uploadVideo = async (server: any, request: any, reply: any) => {
  const { file } = (request.raw as any).files;
  const { email } = request?.user;

  if (!email) {
    return reply.send({
      status: 'FAIL',
      error: 'wrong'
    });
  }

  const exists = await DB.USERS.get(email);

  if (!!exists?.Items?.length) {
    const user: any = exists.Items[0];
    const data = new Uint8Array(Buffer.from(file.data));
  
    try {
      writeFileSync(`./temp/${file.name}`, data);
    } catch (err) {
      console.error('write');
    }

    const baseName = parse(file.name).name;
    const pathFile = resolve('temp', file.name);
    const path = dirname(pathFile);

    await getThumb(pathFile, `${path}/${baseName}-snapshot.png`, '200x?', {
      path: ffmpeg.path
    })
    .then(async () => {
	    const uploadThumb = await uploadS3(`./temp/${baseName}-snapshot.png`, `${user.id}`);
      const upload = await uploadS3(`./temp/${file.name}`, `${user.id}`);

      try {
        unlinkSync(`./temp/${baseName}-snapshot.png`);
        unlinkSync(`./temp/${file.name}`);
      } catch (err) {
        console.error('delete');
      }

      if (upload) {
        return reply.send({
          status: 'SUCCESS',
          media: {
            video: upload,
            thumbnail: uploadThumb
          },
        });
      }

    })
    .catch(err => {
      try {
        unlinkSync(`./temp/${file.name}`);
      } catch (err) {
        console.error('delete');
      }

      console.error('[thumb]', err);

      return reply.send({
        status: 'FAIL',
        error: 'wrong',
        code: 1002
      });
    });
  }

  return reply.send({
    status: 'FAIL',
    error: 'wrong',
    code: 1001
  });
};

export {
  uploadAvatar,
  uploadVideo,
}
