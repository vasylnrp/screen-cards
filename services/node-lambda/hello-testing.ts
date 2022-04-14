import { S3 } from 'aws-sdk';

const s3Client = new S3();

async function handler(event: any, context: any) {
  const buckets = await s3Client.listBuckets().promise();
  console.log('Got an event from teting:', event);

  const result = JSON.stringify(buckets.Buckets);
  console.log('result', result);


  return {
    statusCode: 200,
    body: `Buckets: ${result}`,
  }
}

export { handler }
