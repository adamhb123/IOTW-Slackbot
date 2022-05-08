import { Config } from "./Config";
const { App } = require("@slack/bolt");
const app = new App({
  signingSecret: Config.slackbotSigningSecret,
  token: Config.slackbotToken,
});

interface ResponseOptions {
  chatResponse?: string;
  callback?: (sayResult: any, ...args: any[]) => any;
  callbackArgs?: any[];
}

export async function getBotChannels() {
  /*
   * Gets a list of channels of which the bot is a member
   */
  let list = await app.client.conversations.list();
  return list.channels.filter((_channel: any) => _channel.is_member);
}

export async function sendMessage(text: string, channels?: string[]) {
  /*
   * Sends a one-shot message to every channel specified in the 'channels' array.
   */
  let botChannels = await getBotChannels();
  if (!channels) channels = botChannels.map((_channel: any) => _channel.id);
  if (!channels) {
    console.error(
      "Bot either not a member of or not allowed to post in any channels."
    );
    return;
  }
  for (let channel of channels) {
    // Grab ID if given channel name
    if(channel[0] === '#') channel = botChannels.filter((_channel: any) => _channel.name === channel.substring(1));
    if (!botChannels.map((_channel: any) => _channel.id).includes(channel)) {
      console.error(
        `Cannot send messages in channel: #${channel} ... Check for typo in provided parameter, permissions, etc...`
      );
      continue;
    }
    app.client.chat.postMessage({
      channel: channel,
      text: text,
    });
  }
}

function addListener(triggerPhrase: string, responseOptions: ResponseOptions) {
  /*
   * Adds a listener that triggers on the given triggerPhrase.
   * Upon activation, performs the following operations (if specified in responseOptions)
   *  - Responds in the relevant channel with the 'chatResponse' message.
   *  - Runs 'callback' with 'callbackArgs'
   * Note: listeners must be added before starting the app
   */
  interface _AppMessageParams {
    message: any;
    say: any;
  }
  app.message(triggerPhrase, async (messageParams: _AppMessageParams) => {
    try {
      const sayResult = await messageParams.say({
        channel: messageParams.message.channel,
        text: responseOptions.chatResponse,
      });
      responseOptions.callback?.call(
        null,
        sayResult,
        responseOptions.callbackArgs
      );
    } catch (error) {
      console.error(error);
    }
  });
}

/*
 * Slackbot Setup
 */
addListener("bruh", { chatResponse: "amongus" });
sendMessage("amuggbefore");
app.start(Config.slackbotPort || 3000);
sendMessage("amugg");
console.log("⚡️ Bolt app is running!");
