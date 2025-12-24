import fp from 'fastify-plugin';
import { registerUser } from '../modules/auth/resgistration';
import { loginUser } from '../modules/auth/login';
import { registerMemberUser } from '../modules/auth/registerMember';
import { createTrainer, getTrainersbyCoach, updateUser, whoAmI } from '../modules/users';
import { uploadAvatar, uploadVideo } from '../modules/media';
import { onBoarding, onBoardingRefresh } from '../modules/billing/onboarding';
import { webhook } from '../modules/billing/webhook';
import { createMembership, updateMembership, getBilling, getMembershipPlan, cancelMembership, createCheckoutSession, getCheckoutStatus } from '../modules/billing';
import { createClassroom, deleteClassroom, getClassrooms, updateClassroom } from '../modules/classrooms';
import { createVideo, deleteVideo, getVideos, getVideoById, updateVideo } from '../modules/videos';
import { createLiveClass, deleteLiveClass, getLiveClass, updateLiveClass } from '../modules/lives';
import { createCategory, getCategories } from '../modules/categories';
import { createLocation, getLocations } from '../modules/locations';
import { createChallange, deleteChallange, getAllChallanges, getChallangeById, updateChallange, addVideoToChallenge, removeVideoFromChallenge } from '../modules/challanges';
import { createLink, deleteLink, getLinks, updateLink } from '../modules/links';
import { createLandingpage, getLandingpage, getLandingpageByBrand, updateLandingpage } from '../modules/landingpages';
import { generateSessionCheckout } from '../modules/billing/checkout';
import { getMembersByCoach, updateMember, getMemberById, getMemberProgress, updateMemberProgress } from '../modules/members';
import { getContent, postChallangeCompleted, postChallangeViewEnded, postChallangeViewStarted, postFavourite, postJoinChallange, postJoinLiveClass, postViewContent, postViewContentTime, postViewEnded } from '../modules/content';

const registerSchema = {
  type: 'object',
  required: ['email'],
  properties: {
    email: {
      type: 'string'
    }
  }
}

const registerMemberSchema = {
  type: 'object',
  required: ['email', 'brand'],
  properties: {
    email: {
      type: 'string'
    },
    brand: {
      type: 'string'
    }
  }
}

const routes = fp(async (server, opts, next) => {
  // System Routes
  server.route({
    url: '/',
    logLevel: 'warn',
    method: ['GET', 'HEAD'],
    handler: async (request, reply) => {
      return reply.send('OK')
    }
  });

  server.route({
    url: '/heartbeat',
    logLevel: 'warn',
    method: ['GET', 'HEAD'],
    handler: async (request, reply) => {
      return reply.send('OK')
    }
  });

  // Auth Routes
  server.route({
    schema: {
      body: {
        parsed: registerMemberSchema
      }
    },
    url: '/users/member/register',
    logLevel: 'warn',
    method: ['POST'],
    handler: (request, reply) => registerMemberUser(server, request, reply)
  });

  server.route({
    schema: {
      body: {
        parsed: registerSchema
      }
    },
    url: '/users/register',
    logLevel: 'warn',
    method: ['POST'],
    handler: (request, reply) => registerUser(server, request, reply)
  });

  server.route({
    schema: {
      body: {
        parsed: registerSchema
      }
    },
    url: '/users/login',
    logLevel: 'warn',
    method: ['POST'],
    handler: (request, reply) => loginUser(server, request, reply)
  });

  server.route({
    url: '/users/me',
    logLevel: 'warn',
    method: ['GET'],
    preValidation: [server.authenticate],
    handler: (request, reply) => whoAmI(request, reply)
  });

  server.route({
    url: '/users/me',
    logLevel: 'warn',
    method: ['PATCH'],
    preValidation: [server.authenticate],
    handler: (request, reply) => updateUser(request, reply)
  });

  // Trainers Routes
  server.route({
    url: '/users/:userID/trainers',
    logLevel: 'warn',
    method: ['POST'],
    preValidation: [server.authenticate],
    handler: (request, reply) => createTrainer(request, reply)
  });

  server.route({
    url: '/users/:userID/trainers',
    logLevel: 'warn',
    method: ['GET'],
    preValidation: [server.authenticate],
    handler: (request, reply) => getTrainersbyCoach(request, reply)
  });

  // Media Routes
  server.route({
    url: '/media/avatar',
    logLevel: 'warn',
    method: ['POST'],
    preValidation: [server.authenticate],
    handler: (request, reply) => uploadAvatar(server, request, reply)
  });

  server.route({
    url: '/media/video',
    logLevel: 'warn',
    method: ['POST'],
    preValidation: [server.authenticate],
    handler: (request, reply) => uploadVideo(server, request, reply)
  });

  // Billing Routes
  server.route({
    url: '/billing',
    logLevel: 'warn',
    method: ['GET'],
    preValidation: [server.authenticate],
    handler: (request, reply) => getBilling(request, reply)
  });

  server.route({
    url: '/billing/onboarding',
    logLevel: 'warn',
    method: ['GET'],
    preValidation: [server.authenticate],
    handler: (request, reply) => onBoarding(request, reply)
  });

  server.route({
    url: '/billing/onboarding/refresh',
    logLevel: 'warn',
    method: ['GET'],
    preValidation: [server.authenticate],
    handler: (request, reply) => onBoardingRefresh(request, reply)
  });

  server.route({
    url: '/billing/webhook',
    logLevel: 'warn',
    method: ['POST'],
    handler: (request, reply) => webhook(request, reply)
  });

  server.route({
    url: '/billing/membership',
    logLevel: 'warn',
    method: ['GET'],
    preValidation: [server.authenticate],
    handler: (request, reply) => getMembershipPlan(request, reply)
  });

  server.route({
    url: '/billing/membership',
    logLevel: 'warn',
    method: ['POST'],
    preValidation: [server.authenticate],
    handler: (request, reply) => createMembership(request, reply)
  });

  server.route({
    url: '/billing/membership',
    logLevel: 'warn',
    method: ['PATCH'],
    preValidation: [server.authenticate],
    handler: (request, reply) => updateMembership(request, reply)
  });

  server.route({
    url: '/billing/membership',
    logLevel: 'warn',
    method: ['DELETE'],
    preValidation: [server.authenticate],
    handler: (request, reply) => cancelMembership(request, reply)
  });

  server.route({
    url: '/billing/checkout/session',
    logLevel: 'warn',
    method: ['POST'],
    handler: (request, reply) => generateSessionCheckout(request, reply)
  });

  // Classes Routes
  server.route({
    url: '/classrooms',
    logLevel: 'warn',
    method: ['GET'],
    preValidation: [server.authenticate],
    handler: (request, reply) => getClassrooms(request, reply)
  });

  server.route({
    url: '/classrooms',
    logLevel: 'warn',
    method: ['POST'],
    preValidation: [server.authenticate],
    handler: (request, reply) => createClassroom(request, reply)
  });

  server.route({
    url: '/classrooms',
    logLevel: 'warn',
    method: ['PATCH'],
    preValidation: [server.authenticate],
    handler: (request, reply) => updateClassroom(request, reply)
  });

  server.route({
    url: '/classrooms/:id',
    logLevel: 'warn',
    method: ['DELETE'],
    preValidation: [server.authenticate],
    handler: (request, reply) => deleteClassroom(request, reply)
  });

  // Videos Routes
  server.route({
    url: '/videos',
    logLevel: 'warn',
    method: ['GET'],
    preValidation: [server.authenticate],
    handler: (request, reply) => getVideos(request, reply)
  });

  server.route({
    url: '/videos',
    logLevel: 'warn',
    method: ['POST'],
    preValidation: [server.authenticate],
    handler: (request, reply) => createVideo(request, reply)
  });

  server.route({
    url: '/videos/:id',
    logLevel: 'warn',
    method: ['PATCH'],
    preValidation: [server.authenticate],
    handler: (request, reply) => updateVideo(request, reply)
  });

  server.route({
    url: '/videos/:id',
    logLevel: 'warn',
    method: ['GET'],
    preValidation: [server.authenticate],
    handler: (request, reply) => getVideoById(request, reply)
  });

  server.route({
    url: '/videos/:id',
    logLevel: 'warn',
    method: ['DELETE'],
    preValidation: [server.authenticate],
    handler: (request, reply) => deleteVideo(request, reply)
  });

  // Live Classes Routes
  server.route({
    url: '/live',
    logLevel: 'warn',
    method: ['GET'],
    preValidation: [server.authenticate],
    handler: (request, reply) => getLiveClass(request, reply)
  });

  server.route({
    url: '/live',
    logLevel: 'warn',
    method: ['POST'],
    preValidation: [server.authenticate],
    handler: (request, reply) => createLiveClass(request, reply)
  });

  server.route({
    url: '/live',
    logLevel: 'warn',
    method: ['PATCH'],
    preValidation: [server.authenticate],
    handler: (request, reply) => updateLiveClass(request, reply)
  });

  server.route({
    url: '/live/:id',
    logLevel: 'warn',
    method: ['DELETE'],
    preValidation: [server.authenticate],
    handler: (request, reply) => deleteLiveClass(request, reply)
  });

  // Categories Routes
  server.route({
    url: '/categories',
    logLevel: 'warn',
    method: ['GET'],
    preValidation: [server.authenticate],
    handler: (request, reply) => getCategories(request, reply)
  });

  server.route({
    url: '/categories',
    logLevel: 'warn',
    method: ['POST'],
    preValidation: [server.authenticate],
    handler: (request, reply) => createCategory(request, reply)
  });

  // Locations Routes
  server.route({
    url: '/locations',
    logLevel: 'warn',
    method: ['GET'],
    preValidation: [server.authenticate],
    handler: (request, reply) => getLocations(request, reply)
  });

  server.route({
    url: '/locations',
    logLevel: 'warn',
    method: ['POST'],
    preValidation: [server.authenticate],
    handler: (request, reply) => createLocation(request, reply)
  });

  // Challanges Routes
  server.route({
    url: '/challenges',
    logLevel: 'warn',
    method: ['GET'],
    preValidation: [server.authenticate],
    handler: (request, reply) => getAllChallanges(request, reply)
  });

  server.route({
    url: '/challenges',
    logLevel: 'warn',
    method: ['POST'],
    preValidation: [server.authenticate],
    handler: (request, reply) => createChallange(request, reply)
  });

  server.route({
    url: '/challenges/:id',
    logLevel: 'warn',
    method: ['PATCH'],
    preValidation: [server.authenticate],
    handler: (request, reply) => updateChallange(request, reply)
  });

  server.route({
    url: '/challenges/:id',
    logLevel: 'warn',
    method: ['GET'],
    preValidation: [server.authenticate],
    handler: (request, reply) => getChallangeById(request, reply)
  });

  server.route({
    url: '/challenges/:id',
    logLevel: 'warn',
    method: ['DELETE'],
    preValidation: [server.authenticate],
    handler: (request, reply) => deleteChallange(request, reply)
  });

  server.route({
    url: '/challenges/:id/videos',
    logLevel: 'warn',
    method: ['POST'],
    preValidation: [server.authenticate],
    handler: (request, reply) => addVideoToChallenge(request, reply)
  });

  server.route({
    url: '/challenges/:id/videos/:videoId',
    logLevel: 'warn',
    method: ['DELETE'],
    preValidation: [server.authenticate],
    handler: (request, reply) => removeVideoFromChallenge(request, reply)
  });

  // Links Routes
  server.route({
    url: '/links',
    logLevel: 'warn',
    method: ['GET'],
    preValidation: [server.authenticate],
    handler: (request, reply) => getLinks(request, reply)
  });

  server.route({
    url: '/links',
    logLevel: 'warn',
    method: ['POST'],
    preValidation: [server.authenticate],
    handler: (request, reply) => createLink(request, reply)
  });


  server.route({
    url: '/links',
    logLevel: 'warn',
    method: ['PATCH'],
    preValidation: [server.authenticate],
    handler: (request, reply) => updateLink(request, reply)
  });

  server.route({
    url: '/links/:id',
    logLevel: 'warn',
    method: ['DELETE'],
    preValidation: [server.authenticate],
    handler: (request, reply) => deleteLink(request, reply)
  });

  // LPs Routes
  server.route({
    url: '/landingpage/:id',
    logLevel: 'warn',
    method: ['GET'],
    preValidation: [server.authenticate],
    handler: (request, reply) => getLandingpage(request, reply)
  });

    // LPs Routes
    server.route({
      url: '/landingpage/brand/:id',
      logLevel: 'warn',
      method: ['GET'],
      handler: (request, reply) => getLandingpageByBrand(request, reply)
    });

  server.route({
    url: '/landingpage',
    logLevel: 'warn',
    method: ['POST'],
    preValidation: [server.authenticate],
    handler: (request, reply) => createLandingpage(request, reply)
  });


  server.route({
    url: '/landingpage',
    logLevel: 'warn',
    method: ['PATCH'],
    preValidation: [server.authenticate],
    handler: (request, reply) => updateLandingpage(request, reply)
  });

  // Members Routes

  server.route({
    url: '/members',
    logLevel: 'warn',
    method: ['GET'],
    preValidation: [server.authenticate],
    handler: (request, reply) => getMembersByCoach(request, reply)
  });

  server.route({
    url: '/members',
    logLevel: 'warn',
    method: ['PATCH'],
    preValidation: [server.authenticate],
    handler: (request, reply) => updateMember(request, reply)
  });

  server.route({
    url: '/members/:id',
    logLevel: 'warn',
    method: ['GET'],
    preValidation: [server.authenticate],
    handler: (request, reply) => getMemberById(request, reply)
  });

  server.route({
    url: '/members/progress',
    logLevel: 'warn',
    method: ['GET'],
    preValidation: [server.authenticate],
    handler: (request, reply) => getMemberProgress(request, reply)
  });

  server.route({
    url: '/members/progress',
    logLevel: 'warn',
    method: ['POST'],
    preValidation: [server.authenticate],
    handler: (request, reply) => updateMemberProgress(request, reply)
  });

  // Content Routes

  server.route({
    url: '/content',
    logLevel: 'warn',
    method: ['GET'],
    preValidation: [server.authenticate],
    handler: (request, reply) => getContent(request, reply)
  });

  server.route({
    url: '/content/view',
    logLevel: 'warn',
    method: ['POST'],
    preValidation: [server.authenticate],
    handler: (request, reply) => postViewContent(request, reply)
  });

  server.route({
    url: '/content/join',
    logLevel: 'warn',
    method: ['POST'],
    preValidation: [server.authenticate],
    handler: (request, reply) => postJoinLiveClass(request, reply)
  });

  server.route({
    url: '/content/challenge/join',
    logLevel: 'warn',
    method: ['POST'],
    preValidation: [server.authenticate],
    handler: (request, reply) => postJoinChallange(request, reply)
  });

  server.route({
    url: '/content/view/time',
    logLevel: 'warn',
    method: ['POST'],
    preValidation: [server.authenticate],
    handler: (request, reply) => postViewContentTime(request, reply)
  });

  server.route({
    url: '/content/view/end',
    logLevel: 'warn',
    method: ['POST'],
    preValidation: [server.authenticate],
    handler: (request, reply) => postViewEnded(request, reply)
  });

  server.route({
    url: '/content/challange/completed',
    logLevel: 'warn',
    method: ['POST'],
    preValidation: [server.authenticate],
    handler: (request, reply) => postChallangeCompleted(request, reply)
  });

  server.route({
    url: '/content/challange/view',
    logLevel: 'warn',
    method: ['POST'],
    preValidation: [server.authenticate],
    handler: (request, reply) => postChallangeViewStarted(request, reply)
  });

  server.route({
    url: '/content/challange/view/end',
    logLevel: 'warn',
    method: ['POST'],
    preValidation: [server.authenticate],
    handler: (request, reply) => postChallangeViewEnded(request, reply)
  });

  server.route({
    url: '/content/favourite',
    logLevel: 'warn',
    method: ['POST'],
    preValidation: [server.authenticate],
    handler: (request, reply) => postFavourite(request, reply)
  });

  // Billing checkout routes
  server.route({
    url: '/billing/checkout',
    logLevel: 'warn',
    method: ['POST'],
    handler: (request: any, reply: any) => createCheckoutSession(request, reply)
  });

  server.route({
    url: '/billing/checkout/status/:sessionId',
    logLevel: 'warn',
    method: ['GET'],
    handler: (request: any, reply: any) => getCheckoutStatus(request, reply)
  });
});

export default routes;
