export default {
    basePublicUrl: process.env.BASE_PUBLIC_URL || "http://localhost:5173",
    baseAdminUrl: process.env.BASE_ADMIN_URL || "http://localhost:8080",
    dbConfig: {
      host: process.env.DB_HOST || "",
      port: process.env.DB_PORT || "",
      dbName: process.env.DB_NAME || "",
      dbUsername: process.env.DB_USERNAME || "",
      dbPassword: process.env.DB_PASSWORD || ""
    },
  publicUsers: {
    user1: {
      username: process.env.PUBLIC_USER_USERNAME || "",
      apiKey: process.env.PUBLIC_USER_API_KEY || ""
    },
    user2: {
      username: process.env.PUBLIC_USER_USERNAME_2 || "",
      apiKey: process.env.PUBLIC_USER_API_KEY_2 || ""
    }
  },
  adminUsers: {
    user1: {
      username: process.env.ADMIN_USER_USERNAME || "",
      apiKey: process.env.ADMIN_USER_API_KEY || ""
    }
  }
};