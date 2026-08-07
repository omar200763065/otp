import * as fs from 'fs';
import * as path from 'path';

const tmpDbPath = '/tmp/dev.db';

if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
  if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes('./dev.db')) {
    const seedPaths = [
      path.join(process.cwd(), 'backend', 'prisma', 'dev.db'),
      path.join(process.cwd(), '..', 'backend', 'prisma', 'dev.db'),
      path.join(__dirname, '..', 'backend', 'prisma', 'dev.db'),
      path.join(__dirname, '../../backend/prisma/dev.db'),
    ];

    let copied = false;
    for (const p of seedPaths) {
      try {
        if (fs.existsSync(p) && fs.statSync(p).size > 0) {
          fs.copyFileSync(p, tmpDbPath);
          copied = true;
          break;
        }
      } catch (e) {}
    }

    if (!copied && !fs.existsSync(tmpDbPath)) {
      try {
        fs.writeFileSync(tmpDbPath, '');
      } catch (e) {}
    }

    process.env.DATABASE_URL = `file:${tmpDbPath}`;
  }
} else if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = `file:${path.join(process.cwd(), 'backend', 'prisma', 'dev.db')}`;
}
