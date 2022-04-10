import { App } from "aws-cdk-lib";
import { ScreenCardsStack } from "./ScreenCardsStack";

const app = new App();
const screenCardsStack = new ScreenCardsStack(app, 'ScreenCards', {
  stackName: 'ScreenCards',
});
