import { DynamoDB } from "aws-sdk";
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { MissingFieldError, validateAsScreeCardEntry } from "../Shared/Model";
import { generateRandomId, getEventBody } from "../Shared/Utils";

const TABLE_NAME = process.env.TABLE_NAME;
const dbClient = new DynamoDB.DocumentClient();

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
  const item = getEventBody(event);
  item.cardId = generateRandomId();

  const result: APIGatewayProxyResult = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Item created',
      id: item.cardId,
    })
  }

  try {
    validateAsScreeCardEntry(item);
    await dbClient.put({
      TableName: TABLE_NAME!,
      Item: item
    }).promise()
  } catch (error: any) {
    if (error instanceof MissingFieldError) {
      result.statusCode = 422;
    } else {
      result.statusCode = 500;
    }

    result.body = error.message
  }
  return result;
}

export { handler }
