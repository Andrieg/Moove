import { AttributeMap, DocumentClient, ItemList, QueryOutput } from 'aws-sdk/clients/dynamodb';
import { PromiseResult } from 'aws-sdk/lib/request';
import { AWSError } from 'aws-sdk/lib/error';
import dayjs from 'dayjs';

export interface User {
  PK?: string;
  SK?: string;
  email: string;
  id: string;
  role?: string;
  first_name?: string;
  last_name?: string;
  brands?: string[];
  theme_color?: string;
  about?: string;
  settings?: any;
  acc_stripe_id?: string;
  stripe_connected?: boolean;
  favourites?: { PK: string, SK: string }[]
  updatedAt?: string;
  avatar?: string;
}

export interface Trainer {
  PK?: string;
  SK?: string;
  email: string;
  coach_email: string;
  id: string;
  first_name: string;
  last_name: string;
  about?: string;
  social_links?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  }
  intro_video?: string;
  brand_name?: string;
  brand_domain?: string;
  updatedAt?: string;
}

interface dynamoDBUsers {
  put: (user: User) => Promise<PromiseResult<DocumentClient.PutItemOutput, AWSError> | null>;
  get: (email: string) => Promise<PromiseResult<QueryOutput, AWSError> | null>;
  update: (user: User, fields: string[]) =>Promise<AttributeMap | null | undefined>;
  putTrainer: (trainer: Trainer) => Promise<PromiseResult<DocumentClient.PutItemOutput, AWSError> | null>;
  getTrainers: (email: string) => Promise<ItemList>;
}

const users: (documentClient: DocumentClient) => dynamoDBUsers = documentClient => {
  const { DYNAMO_TABLE } = process.env;

  const Users: dynamoDBUsers = {
    put: async user => {
      const params = {
        TableName: DYNAMO_TABLE || 'moovefit',
        Item: {
          PK: `USER#${user.email}`,
          SK: `USER#${user.email}`,
          ...user,
          createdAt: dayjs().toISOString(),
        }
      };

      try {
        return documentClient.put(params).promise();
      } catch (err) {
        console.error("[DDB ERROR PUT USERS]", err);
        return null;
      } 
    },
    get: async email => {
      const params = {
        TableName: DYNAMO_TABLE || 'moovefit',
        ConditionExpression: "attribute_not_exists(PK)",
        KeyConditionExpression: '#cd420 = :cd420 And #cd430 = :cd430',
        ExpressionAttributeValues: {
          ':cd420': `USER#${email}`,
          ':cd430': `USER#${email}`
        },
        ExpressionAttributeNames: {
          '#cd420': 'PK',
          '#cd430': 'SK'
        }
      };

      try {
        return documentClient.query(params).promise();
      } catch (err) {
        console.error("[DDB ERROR QUERY USERS]", err);
        return null;
      } 
    },
    update: async (user, fields) => {
      user.updatedAt = dayjs().toISOString();
      fields.push('updatedAt')

      const valuesArray = fields.map(field => ({
        key: `:${field}`,
        value: user[field]
      }));
    
      const namesArray = fields.map(field => ({
        key: `#${field}`,
        value: field
      }));
    
      const query = `set ${fields.map(field => ` #${field} = :${field}`)}`;
      const values = valuesArray.reduce(
        (obj, item) => Object.assign(obj, { [item.key]: item.value }),
        {}
      );
      const names = namesArray.reduce(
        (obj, item) => Object.assign(obj, { [item.key]: item.value }),
        {}
      );
    
      const params = {
        TableName: DYNAMO_TABLE || 'moovefit',
        Key: {
          PK: user.PK,
          SK: user.SK
        },
        UpdateExpression: query,
        ExpressionAttributeValues: {
          ...values
        },
        ExpressionAttributeNames: {
          ...names
        },
        ReturnValues: "ALL_NEW"
      };
    
      try {
        const result = await documentClient.update(params).promise();
        return result.Attributes;
      } catch (err) {
        console.error("[err]", err);
        return null;
      }
    },
    putTrainer: async trainer => {
      const params = {
        TableName: DYNAMO_TABLE || 'moovefit',
        Item: {
          PK: `USER#${trainer.coach_email}`,
          SK: `TRAINER#${trainer.email}`,
          ...trainer,
          createdAt: dayjs().toISOString(),
        }
      };

      try {
        return documentClient.put(params).promise();
      } catch (err) {
        console.error("[DDB ERROR PUT USERS]", err);
        return null;
      } 
    },
    getTrainers: async email => {
      const params = {
        TableName: DYNAMO_TABLE || 'moovefit',
        KeyConditionExpression: "#cd420 = :cd420 And begins_with(#cd421, :cd421)",
        ExpressionAttributeNames: {
          "#cd420": "PK",
          "#cd421": "SK"
        },
        ExpressionAttributeValues: {
          ":cd420": `USER#${email}`,
          ":cd421": "TRAINER#"
        }
      };
    
      try {
        const result = await documentClient.query(params).promise();
        return result.Items || [];
      } catch (err) {
        console.error("[WEBSITES QUERY]", err);
        return [];
      }
    }
  };

  return Users;
};

export { users };