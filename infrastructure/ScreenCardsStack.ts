import { Stack, StackProps } from "aws-cdk-lib";
import { LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { Code, Function, Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { join } from "path";
import { AuthorizerWrapper } from "../services/Auth/AuthorizerWrapper";
import { GenericTable } from "./GenericTable";

export class ScreenCardsStack extends Stack {
  private api = new RestApi(this, 'ScreenCardsApi');
  private screenCardsTable = new GenericTable(this, {
    tableName: 'ScreenCardsTable',
    primaryKey: 'cardId',
    createLambdaPath: 'Create',
    readLambdaPath: 'Read',
    updateLambdaPath: 'Update',
    deleteLambdaPath: 'Delete',
    secondaryIndexes: ['location'],
  });
  private authorizerWrapper: AuthorizerWrapper;

  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);
    this.authorizerWrapper = new AuthorizerWrapper(this, this.api);

    // Spaces API integrations
    const spaceResource = this.api.root.addResource('cards');
    spaceResource.addMethod('POST', this.screenCardsTable.createLambdaIntegration);
    spaceResource.addMethod('PUT', this.screenCardsTable.updateLambdaIntegration);
    spaceResource.addMethod('GET', this.screenCardsTable.readLambdaIntegration);
    spaceResource.addMethod('DELETE', this.screenCardsTable.deleteLambdaIntegration);
  }
}
