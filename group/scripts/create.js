'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.create = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    AttributeDefinitions:[
        {
            AttributeName: "members",
            AttributeType: "SS"
        },
        {
            AttributeName: "prayers",
            AttributeType: "SS"
        }
    ],
    Item: {
      id: uuid.v1(),
      name: data.name,
      public: false,
      members: data.members,
      createdAt: timestamp,
      updatedAt: timestamp,
      owner: data.owner,
      prayers: data.prayers
    }
  };
   // write the todo to the database
   dynamoDb.put(params, (error, result) => {
      // handle potential errors
      if (error) {

         console.error(error); // eslint-disable-line no-console
         callback(new Error('Couldn\'t create the group.'));
         return;
      }

      // create a response
      const response = {
         statusCode: 200,
         body: JSON.stringify(result.Item),
      };
   callback(null, response);
});
};
