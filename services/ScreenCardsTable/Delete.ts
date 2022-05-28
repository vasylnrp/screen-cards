import { DynamoDB } from "aws-sdk";
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { addCorsHeader } from "../Shared/Utils";

const TABLE_NAME = process.env.TABLE_NAME!;
const PRIMARY_KEY = process.env.PRIMARY_KEY;
const dbClient = new DynamoDB.DocumentClient();

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
  let result: APIGatewayProxyResult = {
    body: 'Success',
    statusCode: 204,
  };
  addCorsHeader(result)

  const cardId = event.queryStringParameters?.[PRIMARY_KEY!]
  try {
    if (cardId) {
      const dynamoResult = await dbClient.delete({
        TableName: TABLE_NAME,
        Key: {
          'cardId': cardId,
        },
      }).promise();

      result.body = JSON.stringify(dynamoResult);
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
