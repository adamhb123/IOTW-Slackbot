import path from "path";
import fs from "fs";
import dotenv from "dotenv";

let envPath = path.join(__dirname, "/../../.env");
let envLocalPath = path.join(__dirname, "/../../.env.local");
dotenv.config({ path: fs.existsSync(envLocalPath) ? envLocalPath : envPath });
