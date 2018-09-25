const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
require('dotenv').config();

const authorizations = require('./controllers/authorizations');

const server = new grpc.Server();
const packageDefinition = protoLoader.loadSync(process.env.PROTO_LOCATION);
const { service } = grpc.loadPackageDefinition(packageDefinition).pijin.Auth;

server.addService(service, authorizations);

server.bind(`0.0.0.0:${process.env.SERVICE_PORT}`, grpc.ServerCredentials.createInsecure());
server.start();
console.info(`Pijin Pijin service started successfully on port ${process.env.SERVICE_PORT}`);
