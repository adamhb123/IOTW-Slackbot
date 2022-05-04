import { WebClient } from "@slack/web-api";
import Config from "../Config";
import { WhitelistedChannel, isTypeOfChannel } from "./misc/Types";

let client: WebClient;

export function initialize() {
  const token = process.env.SLACK_SECRET;
  if (!token)
    throw new Error(
      "No token provided! Please configure your dotenv / environment variables!\nConfused? Read the README."
    );
  client = new WebClient(token);
}

export async function sendMessage(
  text: string,
  channels?: WhitelistedChannel | WhitelistedChannel[],
  callback?: (
    result: { success: boolean; errors: string[] },
    ...callbackArgs: string[]
  ) => any,
  ...callbackArgs: string[]
): Promise<any> {
  // Convert 'channels' parameter to WhitelistedChannel[]
  let recipientChannels: WhitelistedChannel[];
  let errors: string[] = [];
  if (isTypeOfChannel(channels)) recipientChannels = [channels];
  else if (!channels) channels = [...Config.WhitelistedChannels];
  // Send message to each channel, catching errors if need be
  for (const channel of channels) {
    try {
      await client.chat.postMessage({
        channel: channel,
        text: text,
      });
      console.log("Message posted!");
    } catch (error) {
      errors.push((<Error>error).message);
    }
  }
  const result = {
    success: !errors.length,
    errors: errors,
  };
  return callback ? callback.call(null, result, ...callbackArgs) : result;
}
