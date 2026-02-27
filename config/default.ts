import 'dotenv/config'

export default {
  baseKongUrl: process.env.BASE_KONG_URL || "http://localhost:3000",
  // dbConfig: {
  //   host: process.env.DB_HOST || "",
  //   port: process.env.DB_PORT || "",
  //   dbName: process.env.DB_NAME || "",
  //   dbUsername: process.env.DB_USERNAME || "",
  //   dbPassword: process.env.DB_PASSWORD || ""
  // },
  publicUsers: {
    user1: {
      username: process.env.PUBLIC_USER_USERNAME || "",
      apiKey: process.env.PUBLIC_USER_API_KEY || "",
    },
  },
};
