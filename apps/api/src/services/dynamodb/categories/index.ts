import { AttributeMap, DocumentClient, QueryOutput } from 'aws-sdk/clients/dynamodb';
import { PromiseResult } from 'aws-sdk/lib/request';
import { AWSError } from 'aws-sdk/lib/error';
import dayjs from 'dayjs';

export interface Category {
  PK?: string;
  SK?: string;
  id: string;
  email: string;
  status: string;
  name: string;
  count: number;
  updatedAt?: string;
}

interface dynamoDBCategories {
  put: (category: Category) => Promise<PromiseResult<DocumentClient.PutItemOutput, AWSError> | null>;
  get: (email: string) => Promise<PromiseResult<QueryOutput, AWSError> | null>;
  update: (category: Category, fields: string[]) => Promise<AttributeMap | null | undefined>;
  delete: (category: any) => Promise<PromiseResult<DocumentClient.DeleteItemOutput, AWSError> | null>;
}

const categories: (documentClient: DocumentClient) => dynamoDBCategories = documentClient => {
  const { DYNAMO_TABLE } = process.env;

  const Categories: dynamoDBCategories = {
    put: async category => {
      const params = {
        TableName: DYNAMO_TABLE || 'moovefit',
        Item: {
          PK: `USER#${category.email}`,
          SK: `CATEGORY#${category.id}`,
          ...category,
          createdAt: dayjs().toISOString(),
        }
      };

      try {
        return documentClient.put(params).promise();
      } catch (err) {
        console.error("[DDB ERROR PUT CATS]", err);
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
          ':cd430': `CATEGORY#`
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
    update: async (category, fields) => {
      category.updatedAt = dayjs().toISOString();
      fields.push('updatedAt');
      const valuesArray = fields.map(field => ({
        key: `:${field}`,
        value: category[field]
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
          PK: category.PK,
          SK: category.SK
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
    delete: async category => {
      const params = {
        TableName: DYNAMO_TABLE || 'moovefit',
        Key: {
          PK: category.PK,
          SK: category.SK
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

  return Categories;
};

export { categories };
