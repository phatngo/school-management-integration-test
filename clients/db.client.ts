import mysql, { FieldPacket } from "mysql2/promise";
import config from "config";

export class DBClient {
  private pool: mysql.Pool = mysql.createPool({
    host: config.get("db.host") as unknown as string,
    port: config.get("db.port") as unknown as number,
    user: config.get("db.username") as unknown as string,
    password: config.get("db.password") as unknown as string,
    database: config.get("db.name") as unknown as string,
    waitForConnections: true,
    connectionLimit: 10,
  });
  protected tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  async getById(id: number) {
    if (isNaN(id)) {
      throw new Error("Invalid id");
    }

    const [rows] = await this.pool.execute(
      `SELECT * FROM ${this.tableName} WHERE id = ?`,
      [id],
    );

    return rows;
  }

  async getList(limit: number, offset: number) {}

  async deleteById(id: number) {}
}
