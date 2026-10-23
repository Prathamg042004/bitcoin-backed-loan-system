# Security hardening

This branch removes committed integration credentials from the current configuration, requires a strong production JWT secret, enables SMTP certificate verification, and only registers OAuth strategies when configured.

It also removes an ID-based permission bypass, prevents signup from overwriting existing passwords, limits self-profile changes to names and phone number, and builds verification/reset links from a configured origin rather than request headers.

## Required deployment configuration

- `JWT_SECRET`: independent random value, at least 32 characters.
- `APP_UI_ORIGIN` and `APP_API_ORIGIN`: trusted HTTPS application origins in production.
- `ADMIN_SEED_PASSWORD`: explicitly configure a strong value before running legacy demo seeders. Without this setting, generated demo passwords are random and are not printed. Never run demo seeders against real user data.
- Optional OAuth: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `MICROSOFT_CLIENT_ID`, `MICROSOFT_CLIENT_SECRET`.
- Optional email: `EMAIL_HOST`, `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_FROM`.
- Optional integrations: `GCLOUD_BUCKET`, `GCLOUD_HASH`, `PEXELS_API_KEY`.

Previously committed secrets remain in Git history. Their owners must revoke/rotate them at the providers; source cleanup alone cannot do that. Changing the JWT secret invalidates tokens signed with the old secret.

## Validation

Run `node --test backend/tests/security.test.cjs`. These dependency-free regressions cover permission bypass, default credentials, existing-account signup, and profile privilege escalation.

## Still required before deployment

Review all entity ownership rules, password-reset token lifetimes, OAuth callback/state handling, upload permissions, dependency advisories, CORS, rate limits, seed data, and database migrations. Test against a disposable database. This is an educational prototype, not a financial custody or lending service.
