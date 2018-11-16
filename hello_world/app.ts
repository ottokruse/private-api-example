export const lambdaHandler = async (event, _context) => {
    const { requestContext } = event;
    console.log(JSON.stringify({ requestContext }, undefined, 2));
    try {
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'hello world',
                requestContext,
            })
        };
    } catch (err) {
        console.log(err);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: err.message || 'Oops ... something went wrong'
            })
        };
    }
};
