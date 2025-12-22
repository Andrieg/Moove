import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import DB from "../../services/dynamodb";
import { ContentType, getContentType, UserClassStatus } from "../../utils/data";

dayjs.extend(isBetween)

const getContent = async (request: any, reply: any) => {
  const { user } = request;
  const { email } = request.query;
  let totalViewTime = 0;
  const challangesResult = await DB.CHALLANGES.getAll(email);
  const userChallangesResult = await DB.CHALLANGES.getAll(user.email);
  const categoriesResult = await DB.CATEGORIES.get(email);
  const liveResult = await DB.LIVES.get(email);
  const userLiveResult = await DB.LIVES.get(user.email);
  const classroomsResults = await DB.CLASSROOMS.get(email);
  const userClassroomsResults = await DB.CLASSROOMS.get(user.email);
  const videosResults = await DB.VIDEOS.get(email);
  const userVideosResults = await DB.VIDEOS.get(user.email);

  const lives = liveResult?.Items?.map(item => {
    const exists = userLiveResult?.Items?.find(userItem => userItem.SK === item.SK);
    if (exists) {
      return {
        ...item,
        userStatus: exists.status,
      }
    }

    return item;
  }).filter(item => item.status === 'Publish');

  const challanges = challangesResult?.Items?.map(item => {
    const exists = userChallangesResult?.Items?.find(userItem => userItem.SK === item.SK);
    if (exists) {
      return {
        ...item,
        userStatus: exists.status,
        workouts: exists.workouts,
      }
    }
    return item;
  }).filter((item: any) => dayjs().isBetween(dayjs(item.start), dayjs(item.end)));

  const classrooms = classroomsResults?.Items?.map(item => {
    const exists: any = userClassroomsResults?.Items?.find(userItem => userItem.SK === item.SK);

    if (exists) {
      if (exists?.watched) {
        totalViewTime = totalViewTime + exists.watched as number;
      }
      return {
        ...item,
        userStatus: exists.status,
      }
    }

    return item;
  }).filter((item: any) => item.status === 'Publish');

  const videos = videosResults?.Items?.map(item => {
    const exists: any = userVideosResults?.Items?.find(userItem => userItem.SK === item.SK);

    if (exists) {
      if (exists?.watched) {
        totalViewTime = totalViewTime + exists.watched as number;
      }
      return {
        ...item,
        status: exists.status,
      }
    }

    return item;
  }).filter((item: any) => item.status === 'Publish');

  return reply.send({
    status: 'SUCCESS',
    data: {
      lives,
      challanges,
      categories: categoriesResult?.Items,
      classrooms,
      videos,
      totalViewTime,
    }
  });
};

const postViewContent = async (request: any, reply: any) => {
  const { user } = request;
  const { classroom } = request.body.parsed;

  const exists = await DB.USERS.get(user.email);

  const started = {
    email: user.email,
    id: classroom.id,
    status: 'started',
  };

  classroom.views = classroom.views ? classroom.views + 1 : 1;
  if (!!exists?.Items?.length) {
    const userResult: any = exists.Items[0];
    if (!userResult.role || userResult.role !== 'member' ) {
      return reply.send({
        status: 'SUCCESS',
      });
    }

    const contentType = getContentType(classroom.SK);

    if (contentType === ContentType.CLASSROOM) {
      await DB.CLASSROOMS.update(classroom, ['views']);
      const classResult = await DB.CLASSROOMS.get(user.email);
      const existsClass = classResult?.Items?.find(item => item.id === started.id);
      if (!existsClass) {
        await DB.CLASSROOMS.put(started);
      }
    } else if (contentType === ContentType.CHALLANGE) {
      await DB.CHALLANGES.update(classroom, ['views']);
      const classResult = await DB.CHALLANGES.getAll(user.email);
      const existsClass = classResult?.Items?.find(item => item.id === started.id);
      if (!existsClass) {
        await DB.CHALLANGES.put(started);
      }
    } else if (contentType === ContentType.LIVE) {
      await DB.LIVES.update(classroom, ['views']);
      const classLive = await DB.LIVES.get(user.email);
      const existsLive = classLive?.Items?.find(item => item.id === started.id);
      if (!existsLive) {
        await DB.LIVES.put(started);
      }
    } else if (contentType === ContentType.VIDEO) {
      await DB.VIDEOS.update(classroom, ['views']);
      const classVideo = await DB.VIDEOS.get(user.email);
      const existsVideo = classVideo?.Items?.find(item => item.id === started.id);
      if (!existsVideo) {
        await DB.VIDEOS.put(started);
      }
    }
  }

  return reply.send({
    status: 'SUCCESS',
  });
};

const postViewContentTime = async (request: any, reply: any) => {
  const { user } = request;
  const { classroom, watched } = request.body.parsed;

  const exists = await DB.USERS.get(user.email);

  classroom.watched = !!classroom.watched ? classroom.watched + watched : watched;
  const owned = {
    PK: `USER#${user.email}`,
    SK: `CLASSROOM#${classroom.id}`,
    id: classroom.id,
    status: 'started',
    email: user.email,
    watched: watched,
  };

  if (!!exists?.Items?.length) {
    const userResult: any = exists.Items[0];
    if (!userResult.role || userResult.role !== 'member' ) {
      return reply.send({
        status: 'SUCCESS',
      });
    }

    const contentType = getContentType(classroom.SK);

    if (contentType === ContentType.CLASSROOM) {
      await DB.CLASSROOMS.update(classroom, ['watched']);
      await DB.CLASSROOMS.update(owned, ['watched']);
    } else if (contentType === ContentType.CHALLANGE) {
      await DB.CHALLANGES.update(classroom, ['watched']);
      await DB.CHALLANGES.update(owned, ['watched']);
    } else if (contentType === ContentType.LIVE) {
      await DB.LIVES.update(classroom, ['watched']);
      await DB.LIVES.update(owned, ['watched']);
    } else if (contentType === ContentType.VIDEO) {
      await DB.VIDEOS.update(classroom, ['watched']);
      await DB.VIDEOS.update(owned, ['watched']);
    }
  }

  return reply.send({
    status: 'SUCCESS',
  });
};

const postFavourite = async (request: any, reply: any) => {
  const { user } = request;
  const { classroom } = request.body.parsed;
  const contentType = getContentType(classroom.SK);

  const exists = await DB.USERS.get(user.email);

  if (!!exists?.Items?.length) {
    const savedUser: any = exists.Items[0];

    if (!savedUser.favourites) {
      savedUser.favourites = [{
        PK: classroom.PK,
        SK: classroom.SK
      }];
    } else {
      const found = savedUser.favourites.find(fav => fav.PK === classroom.PK && fav.SK === classroom.SK);
      if (found) {
        savedUser.favourites = savedUser.favourites.filter(fav => fav.SK !== classroom.SK);
        if (!!classroom?.favourites) {
          classroom.favourites = classroom.favourites - 1;
        }
      } else {
        savedUser.favourites.push({
          PK: classroom.PK,
          SK: classroom.SK,
        });

        if (!!classroom?.favourites) {
          classroom.favourites = classroom.favourites = 1;
        } else {
          classroom.favourites = 1;
        }
      }
    }

    const result = await DB.USERS.update(savedUser, ['favourites']);

    if (contentType === ContentType.CLASSROOM) {
      await DB.CLASSROOMS.update(classroom, ['favourites']);
    } else if (contentType === ContentType.CHALLANGE) {
      await DB.CHALLANGES.update(classroom, ['favourites']);
    } else if (contentType === ContentType.LIVE) {
      await DB.LIVES.update(classroom, ['favourites']);
    } else if (contentType === ContentType.VIDEO) {
      await DB.VIDEOS.update(classroom, ['favourites']);
    }

    if (!!result) {
      return reply.send({
        status: 'SUCCESS',
        user: result,
      });
    }
  
    return reply.send({
      status: 'FAIL',
      error: 'wrong'
    });
  }
};

const postViewEnded = async (request: any, reply: any) => {
  const { user } = request;
  const { classroom } = request.body.parsed;

  const exists = await DB.USERS.get(user.email);
  if (!!exists?.Items?.length) {
    const userResult: any = exists.Items[0];
    if (!userResult.role || userResult.role !== 'member' ) {
      return reply.send({
        status: 'SUCCESS',
      });
    }

    const contentType = getContentType(classroom.SK);

    if (contentType === ContentType.CLASSROOM) {
      const targetResult: any = await DB.CLASSROOMS.getById(user.email, classroom.id);
      if (!!targetResult?.Items?.length) {
        const target: any = targetResult.Items[0];
        target.status = 'completed';
        await DB.CLASSROOMS.update(target, ['status'])
      }
    } else if (contentType === ContentType.VIDEO) {
      const targetResult: any = await DB.VIDEOS.getById(user.email, classroom.id);
      if (!!targetResult?.Items?.length) {
        const target: any = targetResult.Items[0];
        target.status = 'completed';
        await DB.VIDEOS.update(target, ['status'])
      }
    }
  }

  return reply.send({
    status: 'SUCCESS',
  });
};

const postChallangeCompleted = async (request: any, reply: any) => {
  const { user } = request;
  const { challange } = request.body.parsed;

  const exists = await DB.USERS.get(user.email);
  if (!!exists?.Items?.length) {
    const userResult: any = exists.Items[0];
    if (!userResult.role || userResult.role !== 'member' ) {
      return reply.send({
        status: 'SUCCESS',
      });
    }

    const target: any = await DB.CHALLANGES.get(user.email, challange.id);
    target.status = UserClassStatus.COMPLETED;
    await DB.CHALLANGES.update(target, ['status']);
  }

  return reply.send({
    status: 'SUCCESS',
  });
};

const postChallangeViewEnded = async (request: any, reply: any) => {
  const { user } = request;
  const { challange, video } = request.body.parsed;
  const videoContentType = getContentType(video.SK);
  const exists = await DB.USERS.get(user.email);
  if (!!exists?.Items?.length) {
    const userResult: any = exists.Items[0];
    if (!userResult.role || userResult.role !== 'member' ) {
      return reply.send({
        status: 'SUCCESS',
      });
    }

    const targetResult = await DB.CHALLANGES.get(user.email, challange.id);
    if (!!targetResult?.Items?.length) {
      const target: any = targetResult.Items[0];
      if (!target.workouts) {
        target.workouts = challange.workouts;
      }
      if (videoContentType === ContentType.CLASSROOM) {
        target.workouts.classes = target.workouts.classes.map(classroom => {
          if (classroom.id === video.id) {
            classroom.userStatus = UserClassStatus.COMPLETED;
          }

          return classroom;
        })
      }

      if (videoContentType === ContentType.VIDEO) {
        target.workouts.videos = target.workouts.videos.map(classroom => {
          if (classroom.id === video.id) {
            classroom.userStatus = UserClassStatus.COMPLETED;
          }

          return classroom;
        });
      }

      await DB.CHALLANGES.update(target, ['workouts'])
    }
  }

  return reply.send({
    status: 'SUCCESS',
  });
};

const postChallangeViewStarted = async (request: any, reply: any) => {
  const { user } = request;
  const { challange, video } = request.body.parsed;
  const videoContentType = getContentType(video.SK);
  const exists = await DB.USERS.get(user.email);
  if (!!exists?.Items?.length) {
    const userResult: any = exists.Items[0];
    if (!userResult.role || userResult.role !== 'member' ) {
      return reply.send({
        status: 'SUCCESS',
      });
    }

    const target: any = await DB.CHALLANGES.get(user.email, challange.id);

    if (videoContentType === ContentType.CLASSROOM) {
      target.workouts.classes = target.workouts.classes.map(classroom => {
        if (classroom.id === video.id) {
          classroom.userStatus = UserClassStatus.STARTED;
        }

        return classroom;
      })
    }

    if (videoContentType === ContentType.VIDEO) {
      target.workouts.videos = target.workouts.videos.map(classroom => {
        if (classroom.id === video.id) {
          classroom.userStatus = UserClassStatus.STARTED;
        }

        return classroom;
      });
    }

    await DB.CHALLANGES.update(target, ['workouts'])
  }

  return reply.send({
    status: 'SUCCESS',
  });
};


const postJoinLiveClass = async (request: any, reply: any) => {
  const { user } = request;
  const { classroom } = request.body.parsed;

  const exists = await DB.USERS.get(user.email);

  if (!!exists?.Items?.length) {
    const savedUser = exists.Items[0];

    if (!savedUser.role || savedUser.role !== 'member' ) {
      return reply.send({
        status: 'SUCCESS',
      });
    }

    const liveClassResult = await DB.LIVES.getById(classroom.email, classroom.id);

    if (!!liveClassResult?.Items?.length) {
      const mainClass: any = liveClassResult.Items[0];
      const classLive = await DB.LIVES.get(user.email);
      const existsLive: any = classLive?.Items?.find(item => item.id === mainClass.id);
  
      if (!existsLive) {
        const started = {
          email: savedUser.email as string,
          id: mainClass.id,
          status: UserClassStatus.JOINED,
        };

        await DB.LIVES.put(started);
      } else if (existsLive.status !== UserClassStatus.JOINED) {
        existsLive.status = UserClassStatus.JOINED;
        await DB.LIVES.update(existsLive, ['status']);
      } else {
        return reply.send({
          status: 'SUCCESS',
        });
      }

      const fields: string[] = [];

      if (!!mainClass.members?.length) {
        mainClass.members = [
          ...classroom.members,
          {
            name: `${savedUser.first_name} ${savedUser.last_name}`,
            avatar: savedUser.avatar,
          }
        ]
      } else {
        mainClass.members = [{
          name: `${savedUser.first_name} ${savedUser.last_name}`,
          avatar: savedUser.avatar,
        }];
      }

      fields.push('members');

      if (!!mainClass?.places) {
        mainClass.places = mainClass.places - 1;
        fields.push('places');
      } else if (!!mainClass?.capacity) {
        mainClass.places = parseInt(mainClass.capacity, 10) - 1;
        fields.push('places');
      }

      await DB.LIVES.update(mainClass, fields);
    }
  }

  return reply.send({
    status: 'SUCCESS',
  });
};


const postJoinChallange = async (request: any, reply: any) => {
  const { user } = request;
  const { classroom } = request.body.parsed;

  const exists = await DB.USERS.get(user.email);

  if (!!exists?.Items?.length) {
    const savedUser = exists.Items[0];

    if (!savedUser.role || savedUser.role !== 'member' ) {
      return reply.send({
        status: 'SUCCESS',
      });
    }

    const challangeResult = await DB.CHALLANGES.get(classroom.email, classroom.id);
 
    if (!!challangeResult?.Items?.length) {
      const challange: any = challangeResult.Items[0];
      const userChallangesResult = await DB.CHALLANGES.getAll(user.email);
      const userChallange: any = userChallangesResult?.Items?.find(item => item.id === challange.id);
  
      if (!userChallange) {
        const started = {
          email: savedUser.email as string,
          id: challange.id,
          status: UserClassStatus.JOINED,
          workouts: challange.workouts,
        };

        await DB.CHALLANGES.put(started);
      } else if (userChallange.status !== UserClassStatus.JOINED) {
        userChallange.status = UserClassStatus.JOINED;
        await DB.CHALLANGES.update(userChallange, ['status']);
      } else {
        return reply.send({
          status: 'SUCCESS',
        });
      }

      const fields: string[] = [];

      if (!!challange.members?.length) {
        challange.members = [
          ...classroom.members,
          {
            name: `${savedUser.first_name} ${savedUser.last_name}`,
            avatar: savedUser.avatar,
          }
        ]
      } else {
        challange.members = [{
          name: `${savedUser.first_name} ${savedUser.last_name}`,
          avatar: savedUser.avatar,
        }];
      }

      fields.push('members');
      await DB.CHALLANGES.update(challange, fields);
    }
  }

  return reply.send({
    status: 'SUCCESS',
  });
};


export {
  getContent,
  postViewContent,
  postFavourite,
  postViewContentTime,
  postViewEnded,
  postJoinLiveClass,
  postJoinChallange,
  postChallangeViewEnded,
  postChallangeViewStarted,
  postChallangeCompleted,
}