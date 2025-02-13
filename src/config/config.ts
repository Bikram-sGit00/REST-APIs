import { config as conf } from "dotenv";
conf()

const _config={  // '_' is used to indicate that this is a private variable
    port:process.env.PORT,
    databaseUrl:process.env.MONGO_CONNECTION_STRING,
}

export const config = Object.freeze(_config); // freeze is an javascript object method,'object.freeze' is used to make the object read-only...

