import { AttributeMap, DocumentClient, QueryOutput } from 'aws-sdk/clients/dynamodb';
import { PromiseResult } from 'aws-sdk/lib/request';
import { AWSError } from 'aws-sdk/lib/error';
import dayjs from 'dayjs';

export interface Live {
  PK?: string;
  SK?: string;
  id: string;
  status: string;
  email: string;
  title?: string;
  description?: string;
  price?: number;
  date?: string;
  start?: string;
  link?: string;
  category?: string[];
  notes?: string;
  capacity?: number;
  location?: {
    name: string;
    address: string;
    postcode: string;
  }
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
  target?: string;
  goal?: string;
  type?: string;
  featured?: boolean;
  updatedAt?: string;
}

interface dynamoDBLives {
  put: (live: Live) => Promise<PromiseResult<DocumentClient.PutItemOutput, AWSError> | null>;
  get: (email: string) => Promise<PromiseResult<QueryOutput, AWSError> | null>;
  getById: (email: string, id: string) => Promise<PromiseResult<QueryOutput, AWSError> | null>;
  update: (live: Live, fields: string[]) => Promise<AttributeMap | null | undefined>;
  delete: (live: any) => Promise<PromiseResult<DocumentClient.DeleteItemOutput, AWSError> | null>;
}

const lives: (documentClient: DocumentClient) => dynamoDBLives = documentClient => {
  const { DYNAMO_TABLE } = process.env;

  const Lives: dynamoDBLives = {
    put: async live => {
      const params = {
        TableName: DYNAMO_TABLE || 'moovefit',
        Item: {
          PK: `USER#${live.email}`,
          SK: `LIVE#${live.id}`,
          ...live,
          createdAt: dayjs().toISOString(),
        }
      };

      try {
        return documentClient.put(params).promise();
      } catch (err) {
        console.error("[DDB ERROR PUT LIVE]", err);
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
          ':cd430': `LIVE#`
        },
        ExpressionAttributeNames: {
          '#cd420': 'PK',
          '#cd430': 'SK'
        }
      };

      try {
        return documentClient.query(params).promise();
      } catch (err) {
        console.error("[DDB ERROR QUERY LIVES]", err);
        return null;
      } 
    },
    getById: async (email, id) => {
      const params = {
        TableName: DYNAMO_TABLE || 'moovefit',
        ConditionExpression: "attribute_not_exists(PK)",
        KeyConditionExpression: "#cd420 = :cd420 AND #cd430 = :cd430",
        ExpressionAttributeValues: {
          ':cd420': `USER#${email}`,
          ':cd430': `LIVE#${id}`
        },
        ExpressionAttributeNames: {
          '#cd420': 'PK',
          '#cd430': 'SK'
        }
      };

      try {
        return documentClient.query(params).promise();
      } catch (err) {
        console.error("[DDB ERROR QUERY LIVES]", err);
        return null;
      } 
    },
    update: async (live, fields) => {
      live.updatedAt = dayjs().toISOString();
      fields.push('updatedAt')

      const valuesArray = fields.map(field => ({
        key: `:${field}`,
        value: live[field]
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
          PK: live.PK,
          SK: live.SK
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
    delete: async live => {
      const params = {
        TableName: DYNAMO_TABLE || 'moovefit',
        Key: {
          PK: live.PK,
          SK: live.SK
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

  return Lives;
};

export { lives };
