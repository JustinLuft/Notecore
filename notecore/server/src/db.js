const { Pool } = require('pg');
const dns = require('dns');

dns.lookup('db.zdqktdphfbrsorulqweq.supabase.co', { family: 4 }, (err, address) => {
  if (err) throw err;

  const pool = new Pool({
    connectionString: `postgresql://postgres:FZuln7lbx5HixOFi@${address}:5432/postgres`,
    ssl: { rejectUnauthorized: false }
  });

  pool.connect()
    .then(() => console.log('✅ DB connected successfully!'))
    .catch(err => console.error('❌ DB connection failed:', err));

  module.exports = pool;
});
