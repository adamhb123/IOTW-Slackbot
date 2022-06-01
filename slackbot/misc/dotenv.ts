// External modules
import { join } from "path";
import fs from "fs";
import Dotenv from "dotenv";

const rootDir = join(__dirname, "../../");

export default () => {
  const envPath = join(rootDir, ".env");
  const envLocalPath = join(rootDir, ".env.local");
  const chosenPath: string | undefined = fs.existsSync(envLocalPath)
    ? envLocalPath
    : fs.existsSync(envPath)
    ? envPath
    : undefined;
  if (!chosenPath) {
    console.warn(
      `No .env or .env.local configurations found in root directory (${rootDir})!\n...assuming environment variables are manually set...`
    );
    return;
  }
  Dotenv.config({ path: chosenPath });
};
