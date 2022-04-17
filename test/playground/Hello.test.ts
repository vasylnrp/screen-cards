import { handler } from "../../services/ScreenCardsTable/Create"

const event = {
  body: {
    location: 'Kyiv',
  }
}

const result = handler(event as any, {} as any);
console.debug(result);
console.log('step 3')
