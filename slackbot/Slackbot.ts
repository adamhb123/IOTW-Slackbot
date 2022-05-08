//import { WebClient } from "@slack/web-api";
//import { createEventAdapter } from "@slack/events-api";
import { Config } from "./Config";
const { App } = require('@slack/bolt');
const app = new App({
  signingSecret: Config.slackbotSigningSecret,
  token: process.env.SLACK_BOT_TOKEN,
});

(async () => {
  // Start the app
  await app.start(process.env.PORT || 3000);
  console.log('⚡️ Bolt app is running!');
})();

function _initializeEventHooks() {
  app.message((event: any) => {
    console.log("Received: ", event);
  });
}

export function initialize() {
  const token = Config.slackbotToken;
  if (!token)
    throw new Error(
      "No token provided! Please configure your dotenv / environment variables!\nConfused? Read the README."
    );
  _initializeEventHooks();
}

export default initialize;

export async function sendMessage(
  text: string,
  channel: string,
  callback?: (
    result: { success: boolean; error: string },
    ...callbackArgs: any[]
  ) => any,
  ...callbackArgs: any[]
): Promise<any> {
  let error: string = "";
  try {
    await app.chat.postMessage({
      channel: channel,
      text: text,
    });
  } catch (error) {
    error = error;
  }
  const result = {
    success: !error,
    error: error,
  };
  return callback ? callback.call(null, result, ...callbackArgs) : result;
}
