import { handler } from "../../services/ScreenCardsTable/Create"

const event = {
  body: {
    location: 'Kyiv',
  }
}

handler(event as any, {} as any)
  .then(result => console.debug(result));
