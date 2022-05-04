import express from "express";
import { Config } from "./Config";
const { createEventAdapter } = require("@slack/events-api");

export function run() {
  const slackEvents = createEventAdapter(Config.signingSecret);
  const app = express();
  // Plug the adapter in as a middleware
  app.use("/events", slackEvents.requestListener());
  // Example: If you're using a body parser, always put it after the event adapter in the middleware stack
  app.use(express.json());
  app.use(express.urlencoded({ extended: true}));
  
  app.listen(Config.slackbotPort, () => {
    // Log a message when the server is ready
    console.log(`Listening for events on port ${Config.slackbotPort}`);
  });
}
