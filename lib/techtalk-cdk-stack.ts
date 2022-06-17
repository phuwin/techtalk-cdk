import { Duration, Stack, StackProps, Stage, StageProps } from 'aws-cdk-lib';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';
import { Construct } from 'constructs';
import { join } from 'path';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class TechtalkCdkStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'TechtalkCdkQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });

    const bucket = new Bucket(this, 'TechtalkCdkTestBucket');

    const pipeline = new CodePipeline(this, 'Pipeline', {
      pipelineName: 'MyPipelineOfficial',
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.gitHub('phuwin95/techtalk-cdk', 'main'),
        commands: ['npm ci', 'npm run build', 'npx cdk synth'],
      }),
      dockerEnabledForSynth: true,
    });

    const lambdaStage = new MyStage(this, 'LambdaStage2');
    pipeline.addStage(lambdaStage);
  }
};

class MyStage extends Stage {
    
  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);

    const stack = new MyStack(this, 'LambdaDynamodbStack2');      
  }
}

class MyStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const myFunction = new NodejsFunction(this, 'my-function-2', {
      memorySize: 256,
      timeout: Duration.seconds(5),
      runtime: Runtime.NODEJS_14_X,
      handler: 'main',
      entry: join(__dirname, `/../src/index.ts`),
    });
  }
}
