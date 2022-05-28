import { DynamoDB } from "aws-sdk";
import { APIGatewayProxyEvent, APIGatewayProxyEventQueryStringParameters, APIGatewayProxyResult, Context } from "aws-lambda";
import { addCorsHeader } from "../Shared/Utils";

const TABLE_NAME = process.env.TABLE_NAME;
const PRIMARY_KEY = process.env.PRIMARY_KEY;
const dbClient = new DynamoDB.DocumentClient();

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
  let result: APIGatewayProxyResult;

  if (!isAuthorized(event)) {
    return {
      statusCode: 401,
      // TODO: need stringify?
      body: 'You are not authorized',
    }
  }

  try {
    let queryResult;
    if (event.queryStringParameters) {
      if (PRIMARY_KEY! in event.queryStringParameters) {
        queryResult = await queryWithPrimaryPartition(event.queryStringParameters)
      } else {
        queryResult = await queryWithSecondaryPartition(event.queryStringParameters)
      }
    } else {
      queryResult = await dbClient.scan({
        TableName: TABLE_NAME!,
      }).promise();
    }
    result = {
      body: JSON.stringify(queryResult),
      statusCode: 200,
    }
  } catch (error: any) {
    result = {
      body: error.message,
      statusCode: 500,
    }
  }
  addCorsHeader(result);
  return result;
}

function isAuthorized(event: APIGatewayProxyEvent) {
  const groups = event.requestContext.authorizer?.claims['cognito:groups'];
  return (groups && (groups as string).includes('admins'));
}

async function queryWithPrimaryPartition(query: APIGatewayProxyEventQueryStringParameters) {
  const keyValue = query[PRIMARY_KEY!];
  return await dbClient.query({
    TableName: TABLE_NAME!,
    KeyConditionExpression: '#key = :value',
    ExpressionAttributeNames: {
      '#key': PRIMARY_KEY!
    },
    ExpressionAttributeValues: {
      ':value': keyValue
    }
  }).promise();
}

async function queryWithSecondaryPartition(query: APIGatewayProxyEventQueryStringParameters) {
  const queryKey = Object.keys(query)[0];
  const queryValue = query[queryKey];
  return await dbClient.query({
    TableName: TABLE_NAME!,
    IndexName: queryKey,
    KeyConditionExpression: '#key = :value',
    ExpressionAttributeNames: {
      '#key': queryKey
    },
    ExpressionAttributeValues: {
      ':value': queryValue
    }
  }).promise();
}

export { handler }
