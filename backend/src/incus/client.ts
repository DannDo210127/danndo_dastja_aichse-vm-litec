import axios from "axios";
import https from "https";
import fs from "fs";
import config from "../config/config";

const agent = new https.Agent({
  cert: fs.readFileSync(`../backend/cert/client.crt`),

  key: fs.readFileSync(`../backend/cert/client.key`),
  rejectUnauthorized: false 
});

export const Incus = axios.create({
  baseURL: config.incusServerAdress,
  httpsAgent: agent,
  proxy: false,
});

export const testIncusConnection = async () => {
  try {
    const response = await Incus.get('/certificates');
    console.log('\x1b[36m✓ \x1b[32mIncusAPI\x1b[36m: connected & authenticated\x1b[0m');
  } catch (error) {
    console.error('\x1b[36m✗ \x1b[31mIncusAPI\x1b[36m: Failed to connect to Incus server or authenticate\x1b[0m');
    if (error instanceof Error) {
      console.error(`   └─ \x1b[33m${error.message}\x1b[0m`);
    }
  }
}