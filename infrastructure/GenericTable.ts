import { Stack } from "aws-cdk-lib";
import { AttributeType, Table } from "aws-cdk-lib/aws-dynamodb";

export interface TableProps {
  tableName: string,
  primaryKey: string,

  createLambdaPath?: string,
  readLambdaPath?: string,
  updateLambdaPath?: string,
  deleteLambdaPath?: string,
}

export class GenericTable {
  private name: string;
  private primaryKey: string;

  private stack: Stack;
  private table: Table;

  public constructor(stack: Stack, name: string, primaryKey: string) {
    this.primaryKey = primaryKey;
    this.name = name;
    this.stack = stack;
    this.initialize();
  }

  private initialize() {
    this.createTable();
    this.addSecondaryIndex();
    this.createLambdas();
    this.grantTableRights();
  }
  private createTable() {
    this.table = new Table(this.stack, this.name, {
      partitionKey: {
        name: this.primaryKey,
        type: AttributeType.STRING,
      },
      tableName: this.name,
    })
  }
}
