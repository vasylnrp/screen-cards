import { handler } from "../../services/ScreenCardsTable/Read"

// const event = {
//   body: {
//     location: 'Kyiv',
//   }
// }

// handler(event as any, {} as any)
//   .then(result => console.debug(result));

const result = handler({} as any, {} as any)
  .then(apiResult => {
    console.debug(apiResult);
    const items = JSON.parse(apiResult.body);
    console.debug(items);
  });
