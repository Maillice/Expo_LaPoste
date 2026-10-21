import pg from 'pg'
import { config } from './config.js'

export type Db = pg.Pool

export function createPool(connectionString = config.databaseUrl): Db {
  return new pg.Pool({ connectionString, max: 10 })
}
