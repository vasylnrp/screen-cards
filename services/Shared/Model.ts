export interface ScreenCard {
  cardId: string,
  name: string,
  location: string,
  photoUrl?: string,
}

export class MissingFieldError extends Error {}

export function validateAsScreeCardEntry(arg: any) {
  const screenCard = arg as ScreenCard;
  if (!screenCard.name) {
    throw new MissingFieldError('Value for name is required!');
  }
  if (!screenCard.location) {
    throw new MissingFieldError('Value for location is required!');
  }
  if (!screenCard.cardId) {
    throw new MissingFieldError('Value for id is required!');
  }
}
