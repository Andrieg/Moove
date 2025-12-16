import { AttributeMap, DocumentClient, QueryOutput } from 'aws-sdk/clients/dynamodb';
import { PromiseResult } from 'aws-sdk/lib/request';
import { AWSError } from 'aws-sdk/lib/error';
import dayjs from 'dayjs';
import logger from '../../../utils/logger';

export interface Member {
  PK?: string;
  SK?: string;
  id: string;
  email: string;
  coach_email: string;
  first_name?: string;
  last_name?: string;
  status?: string;
  updatedAt?: string;
}

interface dynamoDBMembers {
  put: (member: Member) => Promise<PromiseResult<DocumentClient.PutItemOutput, AWSError> | null>;
  get: (coach: string, member: string) => Promise<PromiseResult<QueryOutput, AWSError> | null>;
  getByCoach: (id: string) => Promise<PromiseResult<QueryOutput, AWSError> | null>;
  update: (member: Member, fields: string[]) =>Promise<AttributeMap | null | undefined>;
  delete: (member: {PK: string, SK: string}) => Promise<PromiseResult<DocumentClient.DeleteItemOutput, AWSError> | null>;
}

const members: (documentClient: DocumentClient) => dynamoDBMembers = documentClient => {
  const { DYNAMO_TABLE } = process.env;

  const Members: dynamoDBMembers = {
    put: async member => {
      const params = {
        TableName: DYNAMO_TABLE || 'moovefit',
        Item: {
          PK: `USER#${member.coach_email}`,
          SK: `MEMBER#${member.email}`,
          ...member,
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
    get: async (coach, member) => {
      const params = {
        TableName: DYNAMO_TABLE || 'moovefit',
        ConditionExpression: "attribute_not_exists(PK)",
        KeyConditionExpression: "#cd420 = :cd420 And #cd430 = :cd430",
        ExpressionAttributeValues: {
          ':cd420': `USER#${coach}`,
          ':cd430': `MEMBER#${member}`
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
    getByCoach: async id => {
      const params = {
        TableName: DYNAMO_TABLE || 'moovefit',
        ConditionExpression: "attribute_not_exists(PK)",
        KeyConditionExpression: "#cd420 = :cd420 And begins_with(#cd430, :cd430)",
        ExpressionAttributeValues: {
          ':cd420': `USER#${id}`,
          ':cd430': `MEMBER#`
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
    update: async (member, fields) => {
      member.updatedAt = dayjs().toISOString();
      fields.push('updatedAt')

      const valuesArray = fields.map(field => ({
        key: `:${field}`,
        value: member[field]
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
          PK: member.PK,
          SK: member.SK
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
        logger.error('[MEMBER UPDATE]', { err })
        console.error("[err]", err);
        return null;
      }
    },
    delete: async member => {
      const params = {
        TableName: DYNAMO_TABLE || 'moovefit',
        Key: {
          PK: member.PK,
          SK: member.SK
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

  return Members;
};

export { members };
