# Bitcoin-backed Loan System

**An earlier full-stack learning project for loan and virtual-wallet administration.**

Built on a [Flatlogic Platform](https://flatlogic.com) generated foundation. The repository brings together a Next.js/React administration frontend, an Express backend, and PostgreSQL persistence.

## Scope and status

This is a learning prototype, not a production lending platform. Loan and virtual-wallet records are application data; the repository should not be presented as proof of real Bitcoin custody, collateral settlement, or a live lending service.

## Security status

Authentication and authorization hardening is merged. Legacy file transfers are disabled until file ownership can be enforced. Critical dependency advisories remain: this project is for learning and must not handle real financial or personal data. See [security boundaries](SECURITY_HARDENING.md) and the [dependency upgrade review](https://github.com/Prathamg042004/bitcoin-backed-loan-system/pull/2).

## Technology

| Layer | Stack |
| --- | --- |
| Frontend | Next.js 14, React 18, TypeScript, Material UI, Redux Toolkit, Tailwind CSS |
| Backend | Node.js, Express, Sequelize, Passport, JWT |
| Database | PostgreSQL |
| Local infrastructure | Docker and Docker Compose configuration |

Versions above reflect the committed package manifests; they are not claims that dependencies are current.

## Repository map

| Path | Purpose |
| --- | --- |
| `frontend/` | Administration interface and frontend configuration |
| `backend/src/routes/` | HTTP endpoints |
| `backend/src/db/models/` | Users, roles, permissions, loans, and virtual-wallet models |
| `backend/src/db/migrations/` | Database migrations |
| `backend/src/config.js` | Backend application and integration settings |
| `backend/src/db/db.config.js` | Database environment configuration |
| `docker/` | Container orchestration and startup helpers |

## Local setup

Use a disposable local database and fictional records.

1. Clone the repository and install dependencies separately in `backend` and `frontend`.
2. Review `backend/src/db/db.config.js`. Development expects a local PostgreSQL database named `db_bitcoin_backed_loan_system` and a `postgres` user; adapt the configuration to your machine.
3. Review `backend/src/config.js` before starting. Replace generated authentication and integration settings with your own local configuration.
4. Create the database, then start the backend:

```sh
cd backend
npm install
npm run db:create
npm start
```

The backend start script runs migrations and seeds before launching the server. Review the seeders first; do not point this workflow at a production database.

5. In a second terminal:

```sh
cd frontend
npm install
npm run dev
```

The development frontend uses port 3000 and the backend configuration uses port 8080. Review `frontend/src/config.ts` when changing API locations.

## Configuration and deployment boundaries

The generated configuration contains hardcoded authentication and third-party integration values. Treat any committed credentials as exposed; replace and revoke them at their providers before using those integrations. Removing a value from the latest revision does not remove it from Git history.

Before deployment, move secrets to environment variables, review authentication and authorization, update dependencies, validate loan/wallet business rules, and test migrations against a disposable database. Do not use real funds or customer information in this prototype.

## Development priorities

- Replace generated defaults with environment-based configuration.
- Add a reproducible local environment and sanitized fixtures.
- Test authorization boundaries and loan/wallet validation.
- Document implemented workflows with screenshots and measured test results.
- Separate planned blockchain integrations from working administrative features.

## Attribution

Generated foundation: [Flatlogic Platform](https://flatlogic.com). Retain the repository's original license and attribution when reusing its code.

Maintained as part of [Pratham Gupta's project portfolio](https://github.com/Prathamg042004).
