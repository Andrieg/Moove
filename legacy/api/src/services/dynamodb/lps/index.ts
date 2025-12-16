import { AttributeMap, DocumentClient, QueryOutput } from 'aws-sdk/clients/dynamodb';
import { PromiseResult } from 'aws-sdk/lib/request';
import { AWSError } from 'aws-sdk/lib/error';
import dayjs from 'dayjs';

export interface LandingPage {
  PK?: string;
  SK?: string;
  id?: string;
  brand: string;
  email: string;
  hero?: {
    title?: string;
    descripton?: string;
    cover?: {
      url: string;
      name: string;
      size: string;
    };
    video?: {
      url: string;
      thumnail?: string;
      size: string;
      name: string;
    };
  };
  access?: {
    title: string;
    description: string;
    cover?: {
      url: string;
      name: string;
      size: string;
    };
    reviews?: boolean;
    membership?: boolean;
  }
  reviews?: boolean;
  membership?: boolean;
  updatedAt?: string;
}

interface dynamoDBLandingPages {
  put: (lp: LandingPage) => Promise<PromiseResult<DocumentClient.PutItemOutput, AWSError> | null>;
  get: (email: string, brand: string) => Promise<PromiseResult<QueryOutput, AWSError> | null>;
  getByBrand: (brand: string) => Promise<PromiseResult<QueryOutput, AWSError> | null>;
  update: (lp: LandingPage, fields: string[]) => Promise<AttributeMap | null | undefined>;
  delete: (lp: any) => Promise<PromiseResult<DocumentClient.DeleteItemOutput, AWSError> | null>;
}

const landingpages: (documentClient: DocumentClient) => dynamoDBLandingPages = documentClient => {
  const { DYNAMO_TABLE } = process.env;

  const Landingpages: dynamoDBLandingPages = {
    put: async lp => {
      const params = {
        TableName: DYNAMO_TABLE || 'moovefit',
        Item: {
          PK: `LP#${lp.brand}`,
          SK: `USER#${lp.email}`,
          ...lp,
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
    get: async (email, brand) => {
      const params = {
        TableName: DYNAMO_TABLE || 'moovefit',
        ConditionExpression: "attribute_not_exists(PK)",
        KeyConditionExpression: "#cd420 = :cd420 And #cd430 = :cd430",
        ExpressionAttributeValues: {
          ':cd420': `LP#${brand}`,
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
        console.error("[DDB ERROR QUERY LIVES]", err);
        return null;
      } 
    },
    getByBrand: async brand => {
      const params = {
        TableName: DYNAMO_TABLE || 'moovefit',
        ConditionExpression: "attribute_not_exists(PK)",
        KeyConditionExpression: "#cd420 = :cd420 And begins_with(#cd430, :cd430)",
        ExpressionAttributeValues: {
          ':cd420': `LP#${brand}`,
          ':cd430': `USER#`
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
    update: async (lp, fields) => {
      lp.updatedAt = dayjs().toISOString();
      fields.push('updatedAt')

      const valuesArray = fields.map(field => ({
        key: `:${field}`,
        value: lp[field]
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
          PK: lp.PK,
          SK: lp.SK
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
    delete: async lp => {
      const params = {
        TableName: DYNAMO_TABLE || 'moovefit',
        Key: {
          PK: lp.PK,
          SK: lp.SK
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

  return Landingpages;
};

export { landingpages };
