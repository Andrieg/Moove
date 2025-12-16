import { AttributeMap, DocumentClient, QueryOutput } from 'aws-sdk/clients/dynamodb';
import { PromiseResult } from 'aws-sdk/lib/request';
import { AWSError } from 'aws-sdk/lib/error';
import dayjs from 'dayjs';

export interface Challange {
  PK?: string;
  SK?: string;
  id: string;
  email: string;
  status?: string;
  title?: string;
  start?: string;
  end?: string;
  price?: string;
  description?: string;
  workouts?: string[];
  notes?: string;
  updatedAt?: string;
}

interface dynamoDBChallanges {
  put: (challange: Challange) => Promise<PromiseResult<DocumentClient.PutItemOutput, AWSError> | null>;
  get: (email: string, id: string) => Promise<PromiseResult<QueryOutput, AWSError> | null>;
  getAll: (email: string) => Promise<PromiseResult<QueryOutput, AWSError> | null>;
  update: (challange: Challange, fields: string[]) => Promise<AttributeMap | null | undefined>;
  delete: (challange: any) => Promise<PromiseResult<DocumentClient.DeleteItemOutput, AWSError> | null>;
}

const challanges: (documentClient: DocumentClient) => dynamoDBChallanges = documentClient => {
  const { DYNAMO_TABLE } = process.env;

  const Challanges: dynamoDBChallanges = {
    put: async challange => {
      const params = {
        TableName: DYNAMO_TABLE || 'moovefit',
        Item: {
          PK: `USER#${challange.email}`,
          SK: `CHALLANGE#${challange.id}`,
          ...challange,
          createdAt: dayjs().toISOString(),
        }
      };

      try {
        return documentClient.put(params).promise();
      } catch (err) {
        console.error("[DDB ERROR PUT CH]", err);
        return null;
      } 
    },
    get: async (email, id) => {
      const params = {
        TableName: DYNAMO_TABLE || 'moovefit',
        ConditionExpression: "attribute_not_exists(PK)",
        KeyConditionExpression: "#cd420 = :cd420 And #cd430 = :cd430",
        ExpressionAttributeValues: {
          ':cd420': `USER#${email}`,
          ':cd430': `CHALLANGE#${id}`
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
    getAll: async email => {
      const params = {
        TableName: DYNAMO_TABLE || 'moovefit',
        ConditionExpression: "attribute_not_exists(PK)",
        KeyConditionExpression: "#cd420 = :cd420 And begins_with(#cd430, :cd430)",
        ExpressionAttributeValues: {
          ':cd420': `USER#${email}`,
          ':cd430': `CHALLANGE#`
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
    update: async (challange, fields) => {
      challange.updatedAt = dayjs().toISOString();
      fields.push('updatedAt');
      const valuesArray = fields.map(field => ({
        key: `:${field}`,
        value: challange[field]
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
          PK: challange.PK,
          SK: challange.SK
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
    delete: async challange => {
      const params = {
        TableName: DYNAMO_TABLE || 'moovefit',
        Key: {
          PK: challange.PK,
          SK: challange.SK
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

  return Challanges;
};

export { challanges };
