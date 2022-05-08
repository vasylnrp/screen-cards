import { Stack, StackProps } from "aws-cdk-lib";
import { AuthorizationType, MethodOptions, RestApi } from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";
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

    const optionsWithAuthorizer: MethodOptions = {
      authorizationType: AuthorizationType.COGNITO,
      authorizer: {
        authorizerId: this.authorizerWrapper.authorizer.authorizerId,
      }
    }

    // Spaces API integrations
    const spaceResource = this.api.root.addResource('cards');
    spaceResource.addMethod('GET', this.screenCardsTable.readLambdaIntegration, optionsWithAuthorizer);
    spaceResource.addMethod('POST', this.screenCardsTable.createLambdaIntegration);
    spaceResource.addMethod('PUT', this.screenCardsTable.updateLambdaIntegration);
    spaceResource.addMethod('DELETE', this.screenCardsTable.deleteLambdaIntegration);
  }
}
