interface _Config {
    slackbotPort: string,
    signingSecret: string,
    slackbotToken: string
}
export const Config: _Config = {
    slackbotPort: "3000",
    signingSecret: process.env.SLACKBOT_SIGNING_SECRET || "",
    slackbotToken: process.env.SLACKBOT_TOKEN || ""
}