import { Stack } from "aws-cdk-lib";
import { LambdaIntegration } from "aws-cdk-lib/aws-apigateway";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import { LambdaFunction } from "aws-cdk-lib/aws-events-targets";

export class ScreenCardsTable {
  private stack: Stack;
  private screenCardsTable: Table;
  private createScreenCardLambda: LambdaFunction;
  private readScreenCardLambda: LambdaFunction;
  public createScreenCardLambdaIntegration: LambdaIntegration;
  public readScrenCardLambdaIntegration: LambdaIntegration;

  constructor(stack: Stack) {
    this.stack = stack;
    this.initializeScreenCardsTable();
    this.initializeLambdas();
    this.grantTableRights();
    this.initializeLambdasIntegrations();
  }
}
