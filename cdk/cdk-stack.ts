import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as elasticache from 'aws-cdk-lib/aws-elasticache';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as path from 'path';

export class FusionApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'FusionApiVpc', {
      maxAzs: 2,
    });

    const redisSecurityGroup = new ec2.SecurityGroup(this, 'RedisSecurityGroup', {
      vpc,
      description: 'Security group for Redis cluster',
      allowAllOutbound: true,
    });

    const fusionTable = new dynamodb.Table(this, 'FusionDataTable', {
      tableName: 'FUSION_DATA',
      partitionKey: { name: 'namePlanet', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    });

    const redisSubnetGroup = new elasticache.CfnSubnetGroup(this, 'RedisSubnetGroup', {
      description: 'Subnet group for Redis',
      subnetIds: vpc.privateSubnets.map(subnet => subnet.subnetId),
      cacheSubnetGroupName: 'redis-subnet-group',
    });

    const redisCluster = new elasticache.CfnCacheCluster(this, 'RedisCluster', {
      cacheNodeType: 'cache.t3.micro',
      engine: 'redis',
      numCacheNodes: 1,
      clusterName: 'fusion-redis',
      vpcSecurityGroupIds: [redisSecurityGroup.securityGroupId],
      cacheSubnetGroupName: redisSubnetGroup.cacheSubnetGroupName,
    });

    const userPool = new cognito.UserPool(this, 'FusionUserPool', {
      selfSignUpEnabled: true,
      signInAliases: { email: true },
    });


    const fusionLambda = new NodejsFunction(this, 'FusionFunction', {
      handler: 'main.handler', 
      code: lambda.Code.fromAsset(path.resolve(__dirname, ".."), {
        bundling: {
            command: [
                "bash",
                "-c",
                "npm install && npm run build && cp -rT /asset-input/dist/ /asset-output/",
            ],
            image: lambda.Runtime.NODEJS_20_X.bundlingImage,
            user: "root",
        },
      }),
      timeout: cdk.Duration.seconds(300),
      memorySize: 1024,
      vpc,
      environment: {
        DYNAMO_TABLE: fusionTable.tableName,
        REDIS_HOST: redisCluster.attrRedisEndpointAddress,
        REDIS_PORT: '6379',
      },
      tracing: lambda.Tracing.ACTIVE,
    });

    fusionTable.grantWriteData(fusionLambda);
    fusionTable.grantReadData(fusionLambda);

    const api = new apigateway.RestApi(this, 'FusionApi', {
      restApiName: 'Fusion API',
      description: 'API para fusionar datos de StarWars y D&D.',
    });

    const authorizer = new apigateway.CognitoUserPoolsAuthorizer(this, 'FusionApiAuthorizer', {
      cognitoUserPools: [userPool],
    });

    const lambdaIntegration = new apigateway.LambdaIntegration(fusionLambda);

    const fusionados = api.root.addResource('fusionados');
    fusionados.addMethod('GET', lambdaIntegration);

    const almacenar = api.root.addResource('almacenar');
    almacenar.addMethod('POST', lambdaIntegration, { authorizer });

    const historial = api.root.addResource('historial');
    historial.addMethod('GET', lambdaIntegration, { authorizer });
  }
}
