import { AttributeMap, DocumentClient, QueryOutput } from 'aws-sdk/clients/dynamodb';
import { PromiseResult } from 'aws-sdk/lib/request';
import { AWSError } from 'aws-sdk/lib/error';
import dayjs from 'dayjs';

export interface Location {
  PK?: string;
  SK?: string;
  id: string;
  email: string;
  name: string;
  address: string;
  postcode: string;
  createdAt?: string; 
  updatedAt?: string;
}

interface dynamoDBLocations {
  put: (location: Location) => Promise<Location | null>;
  get: (email: string) => Promise<PromiseResult<QueryOutput, AWSError> | null>;
  update: (location: Location, fields: string[]) => Promise<AttributeMap | null | undefined>;
  delete: (location: any) => Promise<PromiseResult<DocumentClient.DeleteItemOutput, AWSError> | null>;
}

const locations: (documentClient: DocumentClient) => dynamoDBLocations = documentClient => {
  const { DYNAMO_TABLE } = process.env;

  const Locations: dynamoDBLocations = {
    put: async location => {
      const params = {
        TableName: DYNAMO_TABLE || 'moovefit',
        Item: {
          PK: `USER#${location.email}`,
          SK: `LOCATION#${location.id}`,
          ...location,
          createdAt: dayjs().toISOString(),
        },
        ReturnValues: "ALL_OLD"
      };

      try {
        const result = await documentClient.put(params).promise();

        if (result) {
          return params.Item;
        }
        return null;
      } catch (err) {
        console.error("[DDB ERROR PUT LOCATIONS]", err);
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
          ':cd430': `LOCATION#`
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
    update: async (location, fields) => {
      location.updatedAt = dayjs().toISOString();
      fields.push('updatedAt')

      const valuesArray = fields.map(field => ({
        key: `:${field}`,
        value: location[field]
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
          PK: location.PK,
          SK: location.SK
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
    delete: async location => {
      const params = {
        TableName: DYNAMO_TABLE || 'moovefit',
        Key: {
          PK: location.PK,
          SK: location.SK
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

  return Locations;
};

export { locations };
