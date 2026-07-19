import { createInterface } from 'node:readline/promises';
import { hashPassword } from '../api/_cmsAuth.js';
const rl = createInterface({ input: process.stdin, output: process.stdout });
const password = await rl.question('Admin password: '); rl.close();
if (password.length < 12) { console.error('Use at least 12 characters.'); process.exit(1); }
const hash = await hashPassword(password);
console.log('\nSet this in Vercel env as ADMIN_PASSWORD_HASH:\n' + hash);
