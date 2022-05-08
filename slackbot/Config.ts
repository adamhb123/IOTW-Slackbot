import Dotenv from "./misc/Dotenv";

interface _Config {
  slackbotSigningSecret: string;
  slackbotToken: string;
  slackbotPort?: string;
}
// Initialize configuration
Dotenv();
export const Config: _Config = {
  slackbotSigningSecret: process.env.SLACKBOT_SIGNING_SECRET || "",
  slackbotToken: process.env.SLACKBOT_TOKEN || "",
  slackbotPort: "3000",
};
