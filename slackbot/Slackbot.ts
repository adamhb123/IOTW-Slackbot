import { WebClient } from "@slack/web-api";

let client: WebClient;

export function initialize() {
  const token = process.env.SLACKBOT_TOKEN;
  if (!token)
    throw new Error(
      "No token provided! Please configure your dotenv / environment variables!\nConfused? Read the README."
    );
  client = new WebClient(token);
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
    await client.chat.postMessage({
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
