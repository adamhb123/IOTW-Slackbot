


export const EnvVarDefaults: Record<string, Record<string, string | boolean>> = {
    // If an envvar is required, then it MUST be set by the user, either through
    // the path or through dotenv.
    SLACKBOT_TOKEN: {
        value: "slackbot-token-here", 
        required: true
    }
};

export default EnvVarDefaults;
