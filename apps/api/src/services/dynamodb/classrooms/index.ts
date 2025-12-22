import { AttributeMap, DocumentClient, QueryOutput } from 'aws-sdk/clients/dynamodb';
import { PromiseResult } from 'aws-sdk/lib/request';
import { AWSError } from 'aws-sdk/lib/error';
import dayjs from 'dayjs';

export interface Classroom {
  PK?: string;
  SK?: string;
  id: string;
  status: string;
  email: string;
  title?: string;
  description?: string;
  duration?: number;
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
  target?: string;
  goal?: string;
  type?: string;
  featured?: boolean;
  watched?: number;
  updatedAt?: string;
}

interface dynamoDBClassroom {
  put: (classroom: Classroom) => Promise<PromiseResult<DocumentClient.PutItemOutput, AWSError> | null>;
  get: (email: string) => Promise<PromiseResult<QueryOutput, AWSError> | null>;
  getById: (email: string, id: string) => Promise<PromiseResult<QueryOutput, AWSError> | null>;
  update: (classroom: Classroom, fields: string[]) => Promise<AttributeMap | null | undefined>;
  delete: (classroom: any) => Promise<PromiseResult<DocumentClient.DeleteItemOutput, AWSError> | null>;
}

const classrooms: (documentClient: DocumentClient) => dynamoDBClassroom = documentClient => {
  const { DYNAMO_TABLE } = process.env;

  const Classrooms: dynamoDBClassroom = {
    put: async classroom => {
      const params = {
        TableName: DYNAMO_TABLE || 'moovefit',
        Item: {
          PK: `USER#${classroom.email}`,
          SK: `CLASSROOM#${classroom.id}`,
          ...classroom,
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
          ':cd430': `CLASSROOM#`
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
        KeyConditionExpression: "#cd420 = :cd420 And #cd430 = :cd430",
        ExpressionAttributeValues: {
          ':cd420': `USER#${email}`,
          ':cd430': `CLASSROOM#${id}`
        },
        ExpressionAttributeNames: {
          '#cd420': 'PK',
          '#cd430': 'SK'
        }
      };

      try {
        return documentClient.query(params).promise();
      } catch (err) {
        console.error("[DDB ERROR]", err);
        return null;
      } 
    },
    update: async (classroom, fields) => {
      classroom.updatedAt = dayjs().toISOString();
      fields.push('updatedAt');

      const valuesArray = fields.map(field => ({
        key: `:${field}`,
        value: classroom[field]
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
          PK: classroom.PK,
          SK: classroom.SK
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
    delete: async classroom => {
      const params = {
        TableName: DYNAMO_TABLE || 'moovefit',
        Key: {
          PK: classroom.PK,
          SK: classroom.SK
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

  return Classrooms;
};

export { classrooms };
