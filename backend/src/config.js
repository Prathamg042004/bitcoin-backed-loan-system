const os = require('os');
const { randomBytes } = require('node:crypto');
const production = process.env.NODE_ENV === 'production';
const jwtSecret = process.env.JWT_SECRET || (production ? '' : randomBytes(32).toString('hex'));
if (jwtSecret.length < 32) throw new Error('JWT_SECRET must contain at least 32 characters.');
if (production && !process.env.APP_API_ORIGIN?.startsWith('https://')) throw new Error('APP_API_ORIGIN must use HTTPS in production.');
const uiOrigin = new URL(process.env.APP_UI_ORIGIN || 'http://localhost:3000').origin;
if (production && !uiOrigin.startsWith('https://')) throw new Error('APP_UI_ORIGIN must use HTTPS in production.');

const config = {
  gcloud: {
    bucket: process.env.GCLOUD_BUCKET || '',
    hash: process.env.GCLOUD_HASH || '',
  },
  bcrypt: {
    saltRounds: 12,
  },
  admin_pass: process.env.ADMIN_SEED_PASSWORD || randomBytes(32).toString('hex'),
  admin_email: 'admin@flatlogic.com',
  providers: {
    LOCAL: 'local',
    GOOGLE: 'google',
    MICROSOFT: 'microsoft',
  },
  secret_key: jwtSecret,
  remote: process.env.APP_API_ORIGIN || '',
  port: process.env.NODE_ENV === 'production' ? '' : '8080',
  hostUI: process.env.NODE_ENV === 'production' ? '' : 'http://localhost',
  portUI: process.env.NODE_ENV === 'production' ? '' : '3000',

  portUIProd: process.env.NODE_ENV === 'production' ? '' : ':3000',

  swaggerUI: process.env.NODE_ENV === 'production' ? '' : 'http://localhost',
  swaggerPort: process.env.NODE_ENV === 'production' ? '' : ':8080',
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  },
  microsoft: {
    clientId: process.env.MICROSOFT_CLIENT_ID || '',
    clientSecret: process.env.MICROSOFT_CLIENT_SECRET || '',
  },
  uploadDir: os.tmpdir(),
  email: {
    from: process.env.EMAIL_FROM || 'Loan Prototype <demo@example.invalid>',
    host: process.env.EMAIL_HOST || '',
    port: 587,
    auth: {
      user: process.env.EMAIL_USER || '',
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: true,
    },
  },
  roles: {
    admin: 'Administrator',
    user: 'User',
  },

  project_uuid: '51fb1292-4fec-4f3f-8c50-9f54a1b7c48d',
  flHost:
    process.env.NODE_ENV === 'production'
      ? 'https://flatlogic.com/projects'
      : 'http://localhost:3000/projects',
};
config.pexelsKey = process.env.PEXELS_API_KEY || '';
config.pexelsQuery = 'abstract digital blockchain concept';
config.host =
  process.env.NODE_ENV === 'production' ? config.remote : 'http://localhost';
config.apiUrl = `${config.host}${config.port ? `:${config.port}` : ``}/api`;
config.swaggerUrl = `${config.swaggerUI}${config.swaggerPort}`;
config.uiOrigin = uiOrigin;
config.uiUrl = uiOrigin + "/#";
config.backUrl = `${config.hostUI}${config.portUI ? `:${config.portUI}` : ``}`;

module.exports = config;
