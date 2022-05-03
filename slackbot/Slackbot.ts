import { WebClient } from "@slack/web-api";
import { EnabledChannel } from "./misc/Types";
import { enabledChannels } from "../Config";
let client: WebClient;

export function initialize() {
  const token = process.env.SLACK_SECRET;
  if(!token)
    throw new Error("No token provided! Please configure your dotenv / environment variables!\nConfused? Read the README.");
  client = new WebClient(token);
}

export async function sendMessage(
  channel: EnabledChannel,
  text: string,
  callback?: (result: {success: boolean, error: string}, ...callbackArgs: string[]) => any,
  ...callbackArgs: string[]
): Promise<any> {
  let error = "";
  try {
    await client.chat.postMessage({
      channel: channel,
      text: text,
    });
    console.log("Message posted!");
  } catch (error) {
    error = error;
  }
  const result = {
    success: !error ? true : false,
    error: error 
  }
  return callback ? callback.call(
    null,
    result,
    ...callbackArgs
  ) : result;
}
