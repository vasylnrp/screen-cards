import { DynamoDB } from "aws-sdk";
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";

const TABLE_NAME = process.env.TABLE_NAME;
const dbClient = new DynamoDB.DocumentClient();

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
  let result: APIGatewayProxyResult;

  try {
    const queryResult = await dbClient.scan({
      TableName: TABLE_NAME!,
    }).promise();
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
