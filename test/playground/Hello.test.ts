import { APIGatewayProxyEvent } from "aws-lambda";
import { handler } from "../../services/ScreenCardsTable/Read"

const event: APIGatewayProxyEvent = {
  queryStringParameters: {
    // cardId: 'b55ff89c-da8f-48c4-a4ea-7bda14d64eca',
    location: 'Lviv'
  }
} as any;

const result = handler(event, {} as any)
  .then(apiResult => {
    console.debug(apiResult);
    const items = JSON.parse(apiResult.body);
    console.debug(items);
  });
