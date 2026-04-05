import mysql from "mysql2/promise";
import { dbConfig } from "../config/db.config";
import { logDbQueryInfo } from "../utils/logger.utils";

export class DBClient<
  T extends Record<string, string | number | boolean> = Record<
    string,
    string | number | boolean
  >,
> {
  protected pool: mysql.Pool = mysql.createPool(dbConfig);

  protected tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  async insert(data: Omit<T, "id">) {
    const keys = Object.keys(data);
    const values = Object.values(data);

    const query = `INSERT INTO ${this.tableName} (${keys.join(", ")}) VALUES (${values.map((value) => "?").join(", ")})`;
    const result = await this.pool.query(query, values);
    logDbQueryInfo(query, values, result[0]);

    if (result[0] && "insertId" in result[0]) {
      return result[0].insertId;
    }
    return null;
  }

  async getById(id: number): Promise<T | null> {
    if (isNaN(id)) {
      throw new Error("Invalid id");
    }
    const query = `SELECT * FROM ${this.tableName} WHERE id = ?`;
    const params = [id];

    const [rows] = await this.pool.query(query, params);
    const data = (rows as T[])[0] ? (rows as T[])[0] : null;
    logDbQueryInfo(query, params, data);
    return data;
  }

  async getList(limit?: number, offset?: number): Promise<T[]> {
    let query = `SELECT * FROM ${this.tableName}`;
    const params: number[] = [];

    if (limit !== undefined) {
      if (isNaN(limit) || limit <= 0) {
        throw new Error("Invalid limit");
      }
      query += ` LIMIT ?`;
      params.push(limit);
    }

    if (offset !== undefined) {
      if (isNaN(offset) || offset < 0) {
        throw new Error("Invalid offset");
      }
      query += ` OFFSET ?`;
      params.push(offset);
    }

    const [data] = await this.pool.query(query, params);
    logDbQueryInfo(query, params, data);
    return data as T[];
  }

  async deleteById(id: number): Promise<mysql.OkPacket> {
    if (isNaN(id)) {
      throw new Error("Invalid id");
    }

    const query = `DELETE FROM ${this.tableName} WHERE id = ?`;
    const params = [id];

    const result = await this.pool.query(query, params);
    logDbQueryInfo(query, params, result[0]);
    return result[0] as mysql.OkPacket;
  }

  async close() {
    return await this.pool.end();
  }
}
