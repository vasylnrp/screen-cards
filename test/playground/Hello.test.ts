import { APIGatewayProxyEvent } from "aws-lambda";
import { handler } from "../../services/ScreenCardsTable/Delete"

const event: APIGatewayProxyEvent = {
  queryStringParameters: {
    cardId: 'b842a1b6-35da-4bd3-b2e2-652f3aa3bbfb'
  },
} as any;

const result = handler(event, {} as any)
  .then(apiResult => {
    console.debug(apiResult);
    const items = JSON.parse(apiResult.body);
    console.debug(items);
  });
