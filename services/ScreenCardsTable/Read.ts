import { DynamoDB } from "aws-sdk";
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";

const TABLE_NAME = process.env.TABLE_NAME;
const PRIMARY_KEY = process.env.PRIMARY_KEY;
const dbClient = new DynamoDB.DocumentClient();

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
  let result: APIGatewayProxyResult;

  try {
    let queryResult;
    if (event.queryStringParameters) {
      if (PRIMARY_KEY! in event.queryStringParameters) {
        const keyValue = event.queryStringParameters[PRIMARY_KEY!];
        queryResult = await dbClient.query({
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
  return result;
}

export { handler }
