import path from "path";
import fs from "fs";
import dotenv from "dotenv";

export function initialize() {
    let envPath = path.join(__dirname, "/../../.env");
    let envLocalPath = path.join(__dirname, "/../../.env.local");
    const chosenPath = fs.existsSync(envLocalPath)
    ? envLocalPath
    : fs.existsSync(envPath)
    ? envPath
    : undefined;
    dotenv.config({ path: chosenPath });
}

export default initialize;