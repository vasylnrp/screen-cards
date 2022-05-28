import { CfnOutput, Fn, Stack, StackProps } from "aws-cdk-lib";
import { AuthorizationType, MethodOptions, RestApi } from "aws-cdk-lib/aws-apigateway";
import { Bucket, HttpMethods } from "aws-cdk-lib/aws-s3";
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
  private suffix: string;
  private cardsPhotosBucket: Bucket;

  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    this.initializeSuffix();
    this.initializeCardsPhotosBucket();
    this.authorizerWrapper = new AuthorizerWrapper(
      this,
      this.api,
      this.cardsPhotosBucket.bucketArn + '/*',
    );

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

  private initializeSuffix() {
    const shortStackId = Fn.select(2, Fn.split('/', this.stackId));
    const Suffix = Fn.select(4, Fn.split('-', shortStackId));
    this.suffix = Suffix;
  }

  private initializeCardsPhotosBucket() {
    this.cardsPhotosBucket = new Bucket(this, 'cards-photos', {
      bucketName: 'cards-photos-' + this.suffix,
      cors: [{
        allowedMethods: [
          HttpMethods.HEAD,
          HttpMethods.GET,
          HttpMethods.PUT
        ],
        allowedOrigins: ['*'],
        allowedHeaders: ['*']
      }]
    });
    new CfnOutput(this, 'cards-photos-bucket-name', {
      value: this.cardsPhotosBucket.bucketName
    })
  }
}
