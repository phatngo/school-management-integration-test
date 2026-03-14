import config from "config";

export const dbConfig = {
  host: config.get("db.host") as unknown as string,
  port: config.get("db.port") as unknown as number,
  user: config.get("db.username") as unknown as string,
  password: config.get("db.password") as unknown as string,
  database: config.get("db.name") as unknown as string,
  waitForConnections: true,
  connectionLimit: 10,
};
