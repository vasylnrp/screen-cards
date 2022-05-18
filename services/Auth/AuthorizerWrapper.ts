import { CfnOutput } from "aws-cdk-lib";
import { CognitoUserPoolsAuthorizer, RestApi } from "aws-cdk-lib/aws-apigateway";
import { CfnUserPoolGroup, UserPool, UserPoolClient } from "aws-cdk-lib/aws-cognito";
import { Construct } from "constructs";
import { IdentityPoolWrapper } from "../../infrastructure/auth/IdentityPoolWrapper";

export class AuthorizerWrapper {
  private scope: Construct;
  private api: RestApi;
  private userPool: UserPool;
  private userPoolClient: UserPoolClient;
  private identityPoolWrapper: IdentityPoolWrapper
  public authorizer: CognitoUserPoolsAuthorizer;

  constructor(scope: Construct, api: RestApi) {
    this.scope = scope;
    this.api = api;
    this.initialize();
  }

  private initialize() {
    this.createUserPool();
    this.addUserPoolClient();
    this.createAuthorizer();
    this.initializeIdentityPoolWrapper();
    this.createAdminsGroup();
  }

  private createUserPool() {
    this.userPool = new UserPool(this.scope, 'ScreenCardsUserPool', {
      userPoolName: 'ScreenCardsUserPool',
      selfSignUpEnabled: true,
      signInAliases: {
        username: true,
      }
    });
    new CfnOutput(this.scope, 'UserPoolId', {
      value: this.userPool.userPoolId
    })
  }

  private initializeIdentityPoolWrapper() {
    this.identityPoolWrapper = new IdentityPoolWrapper(
      this.scope,
      this.userPool,
      this.userPoolClient,
    );
  }

  private addUserPoolClient() {
    this.userPoolClient = this.userPool.addClient('ScreenCardsPool-client', {
      userPoolClientName: 'ScreenCardsPool-client',
      authFlows: {
        adminUserPassword: true,
        custom: true,
        userPassword: true,
        userSrp: true,
      },
      generateSecret: false
    })

    new CfnOutput(this.scope, 'UserPoolClientId', {
      value: this.userPoolClient.userPoolClientId
    })
  }

  private createAuthorizer() {
    this.authorizer = new CognitoUserPoolsAuthorizer(this.scope, 'ScreenCardAuthorizer', {
      cognitoUserPools: [this.userPool],
      authorizerName: 'ScreenCardAuthorizer',
      identitySource: 'method.request.header.Authorization'
    })
    this.authorizer._attachToApi(this.api);
  }

  private createAdminsGroup() {
    new CfnUserPoolGroup(this.scope, 'admins', {
      groupName: 'admins',
      userPoolId: this.userPool.userPoolId,
      roleArn: this.identityPoolWrapper.adminRole.roleArn
    })
  }
}
