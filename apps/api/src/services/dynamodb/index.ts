import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { billing } from './billing';
import { users } from './users';
import { classrooms } from './classrooms';
import { videos } from './videos';
import { lives } from './live';
import { categories } from './categories';
import { locations } from './locations';
import { challanges } from './challanges';
import { links } from './links';
import { landingpages } from './lps';
import { members } from './members';
import { payments } from './payments';

const { DYNAMO_ENDPOINT, AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = process.env;

const dynamoConfig = {
  endpoint: DYNAMO_ENDPOINT,
  sslEnabled: false,
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID || 'fake',
    secretAccessKey: AWS_SECRET_ACCESS_KEY || 'fake'
  }
}

const client = new DocumentClient(dynamoConfig);

const DB = {
  USERS: users(client),
  BILLING: billing(client),
  CLASSROOMS: classrooms(client),
  VIDEOS: videos(client),
  LIVES: lives(client),
  CATEGORIES: categories(client),
  LOCATIONS: locations(client),
  CHALLANGES: challanges(client),
  LINKS: links(client),
  LPS: landingpages(client),
  MEMBERS: members(client),
  PAYMENTS: payments(client),
}

export default DB;
