const path = require('path');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const PROTO_PATH = path.join(__dirname, '../gRPC/fingerprint.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const proto = grpc.loadPackageDefinition(packageDefinition);
const FingerprintService = proto.FingerPrint.FingerprintService;


const client = new FingerprintService('localhost:4134', grpc.credentials.createInsecure());

module.exports = client;
