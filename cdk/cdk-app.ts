import * as cdk from 'aws-cdk-lib';
import { FusionApiStack } from './cdk-stack';

const app = new cdk.App();
new FusionApiStack(app, 'FusionApiStack');
