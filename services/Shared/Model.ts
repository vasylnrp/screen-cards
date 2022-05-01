export interface ScreenCard {
  cardId: string,
  name: string,
  location: string,
  photoUrl?: string,
}

export class MissingFieldError extends Error {}

export function validateAsScreeCardEntry(arg: any) {
  // return
}
