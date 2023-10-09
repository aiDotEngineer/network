import { Pool } from 'pg';

const DATABASE_URL = process.env.DATABASE_URL ?? '';

function parseConnectionString(connectionString: string) {
  const [_proto, rest = ''] = connectionString.split('://');
  const url = new URL('https://' + rest);
  const { hostname, port, pathname, username, password } = url;
  return {
    hostname,
    port: Number(port),
    db: pathname.slice(1),
    username,
    password,
  };
}

function createPgClient() {
  const { hostname, port, db, username, password } =
    parseConnectionString(DATABASE_URL);
  return new Pool({
    host: hostname,
    port,
    database: db,
    user: username,
    password,
  });
}

const cached: { client?: Pool } = {};

export function getPgClient() {
  return cached.client ?? (cached.client = createPgClient());
}
