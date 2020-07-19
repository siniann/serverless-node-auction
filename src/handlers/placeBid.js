import AWS from 'aws-sdk';
import createError from 'http-errors';
import {getAuctionById} from './getAuction'
import validator from '@middy/validator';
import placeBidSchema from '../custom_lib/schemas/placeBidSchema'
import commonMiddleware from '../custom_lib/commonMiddleware'

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function placeBid(event, context) {
    const { id } = event.pathParameters;
    const { amount } = event.body;

const auction = await getAuctionById(id);
if(auction.status !='OPEN' ){
    throw new createError.InternalServerError(`You cannot bid on a closed auction!`);

}
if(amount <= auction.highestBid.amount){
    throw new createError.InternalServerError(`Bid value must be greater than ${auction.highestBid.amount}!`);

}

    const params = {
        TableName: process.env.AUCTIONS_TABLE_NAME,
        Key: { id },
        UpdateExpression: 'set highestBid.amount = :amount',
        ExpressionAttributeValues: {
            ':amount': amount,
        },
        ReturnValues: 'ALL_NEW',
    };

    let updatedAuction;

    try {
        const result = await dynamodb.update(params).promise();
        updatedAuction = result.Attributes;
    } catch (error) {
        console.log(error);
        throw new createError.InternalServerError('Something went wrong!');
    }

    return {
        statusCode: 200,
        body: JSON.stringify(updatedAuction),
    };
}

export const handler = commonMiddleware(placeBid)
.use(validator({
    inputSchema: placeBidSchema
}));