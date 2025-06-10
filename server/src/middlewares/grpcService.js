const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

class GrpcService {
  constructor() {
    this.loadProto();
  }

  loadProto() {
    const PROTO_PATH = path.resolve(__dirname, '../grpc/fingerprint.proto');
    
    const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true
    });

    const { fingerprint } = grpc.loadPackageDefinition(packageDefinition);
    this.FingerprintService = fingerprint.FingerprintService;
  }

  getClient() {
    if (!this.client) {
      this.client = new this.FingerprintService(
        'localhost:5000',
        grpc.credentials.createInsecure()
      );
    }
    return this.client;
  }

  enrollFingerprint(name, samples) {
    return new Promise((resolve, reject) => {
      const client = this.getClient();
      client.Enroll({ name, samples }, (error, response) => {
        if (error) {
          console.error('gRPC Enroll error:', error);
          reject(error);
        } else {
          resolve(response);
        }
      });
    });
  }

  identifyFingerprint(sample) {
    return new Promise((resolve, reject) => {
      const client = this.getClient();
      client.Identify({ sample }, (error, response) => {
        if (error) {
          console.error('gRPC Identify error:', error);
          reject(error);
        } else {
          resolve(response);
        }
      });
    });
  }
}

module.exports = new GrpcService();