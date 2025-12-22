import { AttributeMap, DocumentClient, QueryOutput } from 'aws-sdk/clients/dynamodb';
import { PromiseResult } from 'aws-sdk/lib/request';
import { AWSError } from 'aws-sdk/lib/error';
import dayjs from 'dayjs';

export interface Payment {
  PK?: string;
  SK?: string;
  id: string;
  email: string;
  coach_email: string;
  type: string;
  status: string;
  updatedAt?: string;
}

interface dynamoDBPayments {
  put: (payment: Payment) => Promise<PromiseResult<DocumentClient.PutItemOutput, AWSError> | null>;
  get: (id: string) => Promise<PromiseResult<QueryOutput, AWSError> | null>;
  update: (paymeny: Payment, fields: string[]) =>Promise<AttributeMap | null | undefined>;
}

const payments: (documentClient: DocumentClient) => dynamoDBPayments = documentClient => {
  const { DYNAMO_TABLE } = process.env;

  const Payments: dynamoDBPayments = {
    put: async payment => {
      const params = {
        TableName: DYNAMO_TABLE || 'moovefit',
        Item: {
          PK: `PAYMENT#${payment.id}`,
          SK: `PAYMENT#${payment.id}`,
          ...payment,
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
        KeyConditionExpression: "#cd420 = :cd420 And #cd430 = :cd430",
        ExpressionAttributeValues: {
          ':cd420': `PAYMENT#${id}`,
          ':cd430': `PAYMENT#${id}`
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
    update: async (payment, fields) => {
      payment.updatedAt = dayjs().toISOString();
      fields.push('updatedAt')

      const valuesArray = fields.map(field => ({
        key: `:${field}`,
        value: payment[field]
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
          PK: payment.PK,
          SK: payment.SK
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

  return Payments;
};

export { payments };
