import { DynamoDB } from "aws-sdk";
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";

const TABLE_NAME = process.env.TABLE_NAME!;
const PRIMARY_KEY = process.env.PRIMARY_KEY;
const dbClient = new DynamoDB.DocumentClient();

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
  let result: APIGatewayProxyResult = {
    body: '',
    statusCode: 200,
  };

  const cardId = event.queryStringParameters?.[PRIMARY_KEY!]
  const requestBody = typeof event.body == 'object' ? event.body : JSON.parse(event.body);
  try {
    if (cardId && requestBody) {
      const requestBodyKey = Object.keys(requestBody)[0];
      const requestBodyValue = requestBody[requestBodyKey];
      const updateResult = await dbClient.update({
        TableName: TABLE_NAME,
        Key: {
          'cardId': cardId,
        },
        UpdateExpression: 'set #updateName = :updateValue',
        ExpressionAttributeNames: {
          '#updateName': requestBodyKey,
        },
        ExpressionAttributeValues: {
          ':updateValue': requestBodyValue,
        },
        ReturnValues: 'UPDATED_NEW'
      }).promise();

      result.body = JSON.stringify(updateResult);
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
