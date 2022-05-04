import * as SetupDotenv from "./misc/SetupDotenv";
import * as Slackbot from "./Slackbot";
import * as Server from "./Server";

function main() {
  Server.run();
  SetupDotenv.initialize();
  Slackbot.initialize();

  Slackbot.sendMessage(
    "swag",
    "#imageoftheweek",
    (result: any, a: string, b: string, c: string) =>
      console.log(`a: ${a} b: ${b} c: ${c} result: ${result}`),
    1,
    2,
    3,
    "amogus"
  );
}

main();
