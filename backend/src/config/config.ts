import dotenv from 'dotenv';

dotenv.config({ quiet: true });

interface Config {
  port: number;
  nodeEnv: string;
  incusServerAdress: string;
}

const config: Config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  incusServerAdress: process.env.INCUS_SERVER_ADDRESS || 'https://172.16.1.100:8443',
};

export default config;