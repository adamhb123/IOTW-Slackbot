import Config from "../../Config";

export type Channel = typeof Config.WhitelistedChannels[number];
export function typeofChannel(
    object: any
  ): object is Channel {
    if (!object) return false;
    return Config.RestrictChannels;
  }