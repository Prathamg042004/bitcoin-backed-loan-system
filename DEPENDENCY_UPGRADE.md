# Dependency upgrade review

This branch is a draft compatibility review, not a production-ready upgrade.

Same-major pinned updates: Express 4.22.3, Lodash 4.18.1, Moment 2.31.0, Sequelize 6.37.8. A backend npm lockfile records the reviewed dependency graph. Seven existing targeted security tests pass. The reviewed production graph decreased from 38 advisories (5 critical) to 29 (4 critical); this is still unsafe for public launch.

Before merging:

- Select one canonical package manager and align Docker, startup scripts, and lockfiles. The existing images/scripts use Yarn; this draft npm lock is not yet the deployed installation path. Yarn fetching timed out during the local compatibility check.
- Upgrade JWT, MySQL, upload, mail, and remaining vulnerable/transitive packages, reviewing their breaking changes.
- Exercise authentication with real cryptography, authorization, database migrations and CRUD against a disposable database, and the frontend/backend integration.
- Build the frontend and backend containers, check dependency audits for their actual installed graphs, and verify startup without seeding public default credentials.
- Keep legacy file transfers disabled until authoritative ownership and private storage are implemented.

Do not treat dependency counts or passing mock-based regressions as proof that the whole application works.
