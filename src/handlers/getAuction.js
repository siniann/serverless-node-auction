import AWS from 'aws-sdk';
import commonMiddleware from '../custom_lib/commonMiddleware'
import createError from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getAuction(event, context) {
    let auction;
    const {id} = event.pathParameters;
    try {
        const result = await dynamodb.get({
            TableName: process.env.AUCTIONS_TABLE_NAME,
            Key:{id}
        }).promise();

        auction = result.Item;
    } catch (error) {
        console.log(error);
        throw new createError.InternalServerError('Something went wrong!');
    }

    if(!auction) {
        throw new createError.InternalServerError('Id not found!');

    }

    return {
        statusCode: 200,
        body: JSON.stringify(auction),
    };
    }
    
export const handler = commonMiddleware(getAuction);

