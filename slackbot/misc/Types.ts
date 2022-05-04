import Config from "../../Config";

export type WhitelistedChannel = typeof Config.WhitelistedChannels[number];
export function isTypeOfChannel(
    object: any
  ): object is WhitelistedChannel {
    if (!object) return false;
    return Config.WhitelistedChannels.includes(object);
  }