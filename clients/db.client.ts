import mysql, { FieldPacket } from "mysql2/promise";
import config from "config";

export class DBClient<T extends Record<string, any> = Record<string, any>> {
  protected pool: mysql.Pool = mysql.createPool({
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

  async getById(id: number): Promise<T | null> {
    if (isNaN(id)) {
      throw new Error("Invalid id");
    }

    const [rows, info] = await this.pool.query(
      `SELECT * FROM ${this.tableName} WHERE id = ?`,
      [id],
    );

    const data = rows as T[];
    return data[0] ? data[0] : null;
  }

  async getList(limit: number, offset: number): Promise<T[]> {
    if (isNaN(limit) || isNaN(offset)) {
      throw new Error("Invalid limit or offset");
    }

    const rows = await this.pool.query(
      `SELECT * FROM ${this.tableName} LIMIT ? OFFSET ?`,
      [limit, offset],
    );

    return rows[0] as T[];
  }

  async deleteById(id: number): Promise<mysql.OkPacket> {
    if (isNaN(id)) {
      throw new Error("Invalid id");
    }

    const result = await this.pool.query(
      `DELETE FROM ${this.tableName} WHERE id = ?`,
      [id],
    );

    return result[0] as mysql.OkPacket;
  }

  async close() {
    return await this.pool.end();
  }
}
