import "dotenv/config";

export default {
  baseKongUrl: process.env.BASE_KONG_URL || "http://localhost:3000",
  db: {
    host: process.env.DB_HOST || "",
    port: process.env.DB_PORT || "",
    name: process.env.DB_NAME || "",
    username: process.env.DB_USERNAME || "",
    password: process.env.DB_PASSWORD || ""
  },
  users: {
    default: {
      username: process.env.PUBLIC_USER_USERNAME || "",
      apiKey: process.env.PUBLIC_USER_API_KEY || "",
    },
    adminUser: {
      username: process.env.ADMIN_USER_USERNAME || "",
      apiKey: process.env.ADMIN_USER_API_KEY || "",
    },
  },
};
