import { getEndedAuctions } from '../custom_lib/getEndedAuctions';
import { closeAuction } from '../custom_lib/closeAuction';
import createError from 'http-errors';

async function processAuctions(event, context) {
    try {
        const auctionsToClose = await getEndedAuctions();
        console.log('auctionsToClose success')
        const closePromises = auctionsToClose.map(auction => closeAuction(auction));
        await Promise.all(closePromises);
        return { closed: closePromises.length };
    } catch (error) {
        console.log(error);
        throw new createError.InternalServerError('Something went wrong! OOPS!!')

    }

}
export const handler = processAuctions;

