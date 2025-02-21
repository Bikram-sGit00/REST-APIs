import { config as conf } from "dotenv";
conf();

const _config = {
  // '_' is used to indicate that this is a private variable
  port: process.env.PORT,
  databaseUrl: process.env.MONGO_CONNECTION_STRING,
  env: process.env.NODE_ENV, // NODE_ENV is an environment variable that is used to know the environment in which the application is running...
  jwtSecret: process.env.JWT_SECRET,
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
  frontendDomain: process.env.FRONTEND_DOMAIN,
};

export const config = Object.freeze(_config); // freeze is an javascript object method,'object.freeze' is used to make the object read-only...
