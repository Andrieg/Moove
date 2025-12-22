import { AttributeMap, DocumentClient, QueryOutput } from 'aws-sdk/clients/dynamodb';
import { PromiseResult } from 'aws-sdk/lib/request';
import { AWSError } from 'aws-sdk/lib/error';
import dayjs from 'dayjs';

export interface Billing {
  PK?: string;
  SK?: string;
  id: string;
  email: string;
  connected?: boolean;
  membership?: {
    title: string;
    benefits: string[];
    price: string;
    price_id: string;
    product_id: string;
  }
  updatedAt?: string;
}

interface dynamoDBBilling {
  put: (billing: Billing) => Promise<PromiseResult<DocumentClient.PutItemOutput, AWSError> | null>;
  get: (id: string) => Promise<PromiseResult<QueryOutput, AWSError> | null>;
  update: (billing: Billing, fields: string[]) =>Promise<AttributeMap | null | undefined>;
}

const billing: (documentClient: DocumentClient) => dynamoDBBilling = documentClient => {
  const { DYNAMO_TABLE } = process.env;

  const Billing: dynamoDBBilling = {
    put: async billing => {
      const params = {
        TableName: DYNAMO_TABLE || 'moovefit',
        Item: {
          PK: `BILLING#${billing.id}`,
          SK: `USER#${billing.email}`,
          ...billing,
          createdAt: dayjs().toISOString(),
        }
      };

      try {
        return documentClient.put(params).promise();
      } catch (err) {
        console.error("[DDB ERROR PUT BILLING]", err);
        return null;
      } 
    },
    get: async id => {
      const params = {
        TableName: DYNAMO_TABLE || 'moovefit',
        ConditionExpression: "attribute_not_exists(PK)",
        KeyConditionExpression: "#cd420 = :cd420 And begins_with(#cd430, :cd430)",
        ExpressionAttributeValues: {
          ':cd420': `BILLING#${id}`,
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
        console.error("[DDB ERROR QUERY USERS]", err);
        return null;
      } 
    },
    update: async (billing, fields) => {
      billing.updatedAt = dayjs().toISOString();
      fields.push('updatedAt');
      const valuesArray = fields.map(field => ({
        key: `:${field}`,
        value: billing[field]
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
          PK: billing.PK,
          SK: billing.SK
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
  };

  return Billing;
};

export { billing };
