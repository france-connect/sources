/* istanbul ignore file */

// Tested by DTO
import { ConfigParser } from '@fc/config';
import { MongooseConfig } from '@fc/mongoose';

const env = new ConfigParser(process.env, 'Mongoose');

export default {
  user: env.string('USER'),
  password: env.string('PASSWORD'),
  hosts: env.string('HOSTS'),
  database: env.string('DATABASE'),
  options: {
    authSource: env.string('DATABASE'),
    tls: env.boolean('TLS'),
    tlsInsecure: env.boolean('TLS_INSECURE'),
    tlsCAFile: env.string('TLS_CA_FILE'),
    tlsAllowInvalidHostnames: env.boolean('TLS_ALLOW_INVALID_HOST_NAME'),
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
} as MongooseConfig;
