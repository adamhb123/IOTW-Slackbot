import Dotenv from "./misc/Dotenv";

interface _Config {
  slackbotPort: string;
  slackbotSigningSecret: string;
  slackbotToken: string;
}
// Initialize configuration
Dotenv();
export const Config: _Config = {
  slackbotToken: process.env.SLACKBOT_TOKEN || "",
  slackbotPort: "3000",
  slackbotSigningSecret: process.env.SLACKBOT_SIGNING_SECRET || "",
};
