import { Config } from './Config';
const { App } = require("@slack/bolt");

const app = new App({
  signingSecret: Config.slackbotSigningSecret,
  token: Config.slackbotToken,
  appToken: Config.slackbotAppToken,
  socketMode: true,
});

interface ResponseOptions {
chatResponse?: string;
  callback?: (sayResult: any, ...args: any[]) => any;
  callbackArgs?: any[];
}

interface TriggerOptions {
  onMentionOnly: boolean;
  enforceWhitespace: boolean; // force trigger word to be surrounded by whitespace (for example, if your trigger word was 'balm', a message containing 'embalming' would not trigger)
  enforceCapitalization: boolean; // force trigger word to match exact case
}

interface EventResponseParams {
  say: Function,
  payload: {
    client_msg_id: string,
    type: string,
    text: string,
    files?: [Object],
    user: string,
    ts: string,
    team: string,
    blocks: [
        Object
    ],
    channel: string,
    event_ts: string
  };
}

interface SlackFile {
    id: string,
    created: number,
    timestamp: number,
    name: string,
    title: string,
    mimetype: string,
    filetype: string,
    pretty_type: string,
    user: string,
    editable: boolean,
    size: number,
    mode: string,
    is_external: boolean,
    external_type: string,
    is_public: boolean,
    public_url_shared: boolean,
    display_as_bot: boolean,
    username: string,
    url_private: string,
    url_private_download: string,
    thumb_64: string,
    thumb_80: string,
    thumb_360: string,
    thumb_360_w: number,
    thumb_360_h: number,
    thumb_160: string,
    thumb_360_gif: string,
    image_exif_rotation: number,
    original_w: number,
    original_h: number,
    deanimate_gif: string,
    pjpeg: string,
    permalink: string,
    permalink_public: string,
    comments_count: number,
    is_starred: boolean,
    channels: [string],
    groups: Array<any>,
    ims: Array<any>,
    has_rich_preview: boolean
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
    if (channel[0] === "#")
      channel = botChannels.filter(
        (_channel: any) => _channel.name === channel.substring(1)
      );
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

function addTrigger(
  triggerPhrase: string | null,
  triggerOptions: TriggerOptions,
  responseOptions: ResponseOptions,
) {
  // Need to add only on mention functionality
  /*
   * Adds a trigger that triggers on the given 'triggerPhrase'.
   * Upon activation, performs the following operations (if specified in responseOptions)
   *  - Responds in the relevant channel with the 'chatResponse' message.
   *  - Runs 'callback' with 'callbackArgs'
   * Note: listeners must be added before starting the app
   */

  console.log("trig",triggerPhrase);
  const onTriggered = async (responseParams: EventResponseParams) => {
    try {
      if(triggerOptions.onMentionOnly && triggerPhrase){
        const messageText = responseParams.payload.text;
        if(!messageText.toLowerCase().includes(triggerPhrase)) return; // Includes trigger phrase?
        if(triggerOptions.enforceWhitespace && !messageText.toLowerCase().split(" ").includes(triggerPhrase)){
          console.log(messageText.split(" "));
          console.log("FUCK");
          return;
        } // Whitespace around trigger phrase? (works)
        if(triggerOptions.enforceCapitalization){ // Check case sensitive / exact match
          let found: boolean = false;
          let matches = messageText.match(new RegExp(triggerPhrase, "gi"));
          if(matches){
            for(const potentialTrigger of matches) { // Case insensitive trigger retrieval
              if(potentialTrigger === triggerPhrase) {
                found = true;
                break;
              }
            }
          }
          if(!found) return;
        }
      }
      await responseParams.say({
        channel: responseParams.payload.channel,
        text: responseOptions.chatResponse,
      });
      responseOptions.callback?.call(
        null,
        responseParams,
        responseOptions.callbackArgs
      );
    } catch (error) {
      console.error(error);
    }
  }
  app.event(triggerOptions.onMentionOnly ? "app_mention" : "message", onTriggered);
}

/*
 * Slackbot Setup
 */
addTrigger("upload", {
  onMentionOnly: true,
  enforceWhitespace: true,
  enforceCapitalization: false
}, {
  chatResponse: "Received!",
  callback: (responseParams: EventResponseParams) => {
    console.log(responseParams);
    if(responseParams.payload.files) console.log(responseParams.payload.files);
  },
});

app.start(Config.slackbotPort || 3000);
sendMessage("amugg");
console.log("⚡️ Bolt app is running!");
