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


## File transfer and token boundaries

Legacy upload and download HTTP routes are now authenticated and return 503. They must remain disabled until an authoritative file ownership mapping, safe object names, private storage, and authorized downloads are implemented. Old local downloads accepted arbitrary paths and the production cloud route had no owner checks. A client-selected folder or an unguessable prefix is not authorization.

JWT authentication now restricts signatures to HS256 and resolves the immutable account ID from the verified token, rather than a potentially reassigned email address. Tokens lacking an account ID require sign-in again.

Seven dependency-free regression tests cover these boundaries and run automatically on pull requests. They do not validate the complete legacy application or database. The current dependency graph still has critical/high advisories; do not expose this prototype publicly or use real financial/personal data until the dependency upgrade and integration review are complete.
