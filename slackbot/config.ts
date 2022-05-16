import Dotenv from "./misc/Dotenv";

interface _Config {
  slackbotSigningSecret: string;
  slackbotAppToken: string;
  slackbotToken: string;
  slackbotPort?: string;
}
// Initialize configuration
Dotenv();
export const Config: _Config = {
  slackbotSigningSecret: process.env.SLACKBOT_SIGNING_SECRET_OKD || process.env.SLACKBOT_SIGNING_SECRET || "",
  slackbotAppToken: process.env.SLACKBOT_APP_TOKEN_OKD || process.env.SLACKBOT_APP_TOKEN || "",
  slackbotToken: process.env.SLACKBOT_TOKEN_OKD || process.env.SLACKBOT_TOKEN || "",
  slackbotPort: process.env.SLACKBOT_PORT_OKD || process.env.SLACKBOT_PORT ||  "3000",
};
