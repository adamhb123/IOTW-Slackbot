import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import EnvVarDefaults from "./EnvVarDefaults";

let envPath = path.join(__dirname, "/../../.env");
let envLocalPath = path.join(__dirname, "/../../.env.local");
const chosenPath = fs.existsSync(envLocalPath)
  ? envLocalPath
  : fs.existsSync(envPath)
  ? envPath
  : undefined;
// If we can't find either .env or .env.local,
if (!chosenPath) {
  for (const [envVarKey, envVarDefaultDescriptor] of Object.entries(
    EnvVarDefaults
  )) {
    // If the envvar is required, throw a fatal error
    if (envVarDefaultDescriptor.required) {
      throw new ReferenceError(`Required environment variable: '${envVarKey}' not set!`);
    }
    // Envvar not set, but also not required? Set to default.
    if (!process.env[envVarKey])
      process.env[envVarKey] = envVarDefaultDescriptor.value.toString();
  }
}
dotenv.config({ path: chosenPath });
