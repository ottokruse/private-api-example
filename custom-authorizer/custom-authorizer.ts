import { ApiGatewayAuthorizer, ContextBuilderFunction } from 'aws-apigw-authorizer';
import * as AWS from 'aws-sdk';
import { Agent } from 'https';

const DB = new AWS.DynamoDB.DocumentClient({
    httpOptions: {
        agent: new Agent({ keepAlive: true })
    }
});

const getVehicleId = async(username: string) => {
    const params: AWS.DynamoDB.DocumentClient.GetItemInput = {
        TableName: process.env.USER_VEHICLE_MAPPING_TABLE,
        Key: { username },
    };
    const response = await DB.get(params).promise();
    if (!response.Item || !response.Item.vehicleId ) {
        throw new Error('Username not found!');
    }
    return response.Item.vehicleId as string;
};

const contextBuilder: ContextBuilderFunction = async (_event, _principalId, decodedToken) => {
    return {
        my_custom_claim_value: decodedToken['my_custom_claim'],
        foo: 'bar',
        vehicleId: await getVehicleId(decodedToken['email']),
    };
};

const authorizer = new ApiGatewayAuthorizer({ contextBuilder });

export const handler = authorizer.handler.bind(authorizer);
