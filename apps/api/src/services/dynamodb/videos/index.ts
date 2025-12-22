import { AttributeMap, DocumentClient, QueryOutput } from 'aws-sdk/clients/dynamodb';
import { PromiseResult } from 'aws-sdk/lib/request';
import { AWSError } from 'aws-sdk/lib/error';
import dayjs from 'dayjs';

export interface Video {
  PK?: string;
  SK?: string;
  id: string;
  status: string;
  email: string;
  title?: string;
  description?: string;
  price?: number;
  category?: string[];
  notes?: string;
  video?: {
    url: string;
    thumnail: string;
    size: string;
    name: string;
  };
  cover?: {
    url: string;
    name: string;
    size: string;
  };
  featured?: boolean;
  watched?: number;
  updatedAt?: string;
}

interface dynamoDBVideos {
  put: (video: Video) => Promise<PromiseResult<DocumentClient.PutItemOutput, AWSError> | null>;
  get: (email: string) => Promise<PromiseResult<QueryOutput, AWSError> | null>;
  getById: (email: string, id: string) => Promise<PromiseResult<QueryOutput, AWSError> | null>;
  update: (video: Video, fields: string[]) => Promise<AttributeMap | null | undefined>;
  delete: (video: any) => Promise<PromiseResult<DocumentClient.DeleteItemOutput, AWSError> | null>;
}

const videos: (documentClient: DocumentClient) => dynamoDBVideos = documentClient => {
  const { DYNAMO_TABLE } = process.env;

  const Videos: dynamoDBVideos = {
    put: async video => {
      const params = {
        TableName: DYNAMO_TABLE || 'moovefit',
        Item: {
          PK: `USER#${video.email}`,
          SK: `VIDEOS#${video.id}`,
          ...video,
          createdAt: dayjs().toISOString(),
        }
      };

      try {
        return documentClient.put(params).promise();
      } catch (err) {
        console.error("[DDB ERROR PUT CLASSES]", err);
        return null;
      } 
    },
    get: async email => {
      const params = {
        TableName: DYNAMO_TABLE || 'moovefit',
        ConditionExpression: "attribute_not_exists(PK)",
        KeyConditionExpression: "#cd420 = :cd420 And begins_with(#cd430, :cd430)",
        ExpressionAttributeValues: {
          ':cd420': `USER#${email}`,
          ':cd430': `VIDEOS#`
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
    getById: async (email, id) => {
      const params = {
        TableName: DYNAMO_TABLE || 'moovefit',
        ConditionExpression: "attribute_not_exists(PK)",
        KeyConditionExpression: "#cd420 = :cd420 And begins_with(#cd430, :cd430)",
        ExpressionAttributeValues: {
          ':cd420': `USER#${email}`,
          ':cd430': `VIDEOS#${id}`
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
    update: async (video, fields) => {
      video.updatedAt = dayjs().toISOString();
      fields.push('updatedAt')

      const valuesArray = fields.map(field => ({
        key: `:${field}`,
        value: video[field]
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
          PK: video.PK,
          SK: video.SK
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
    delete: async video => {
      const params = {
        TableName: DYNAMO_TABLE || 'moovefit',
        Key: {
          PK: video.PK,
          SK: video.SK
        },
      }
      
      try {
        return documentClient.delete(params).promise();
      } catch (err) {
        console.error("[err]", err);
        return null;
      }
    }
  };

  return Videos;
};

export { videos };
