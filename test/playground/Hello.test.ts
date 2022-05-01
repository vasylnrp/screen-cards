import { APIGatewayProxyEvent } from "aws-lambda";
import { handler } from "../../services/ScreenCardsTable/Read"

const event: APIGatewayProxyEvent = {
  // queryStringParameters: {
  //   cardId: '0ab83c4f-9be5-4d0f-91e7-6d872e1bd069'
  // },
  body: {
    name: 'test name 4',
    location: 'Levandivka',
  }
} as any;

const result = handler(event, {} as any)
  .then(apiResult => {
    console.debug(apiResult);
    const items = JSON.parse(apiResult.body);
    console.debug(items);
  });
