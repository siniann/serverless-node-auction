import AWS from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

const dynamodb = new AWS.DynamoDB.DocumentClient();

export async function closeAuction(auction) {
    console.log('close auction called');

    const params = {
        TableName: process.env.AUCTIONS_TABLE_NAME,
        Key: { id: auction.id },
        UpdateExpression: 'set #status = :status',
        ExpressionAttributeValues: {
            ':status': 'CLOSED',
        },
        ExpressionAttributeNames: {
            //# used because status is a reserved name
            '#status': 'status',
        },
    };
    console.log('before update');
    const result = await dynamodb.update(params).promise();
return result;
}

