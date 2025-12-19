# Financial Ledger API

A backend service that implements **double-entry bookkeeping** principles
for a mock banking system. The application focuses on **data integrity,
auditability, and ACID-compliant financial transactions**.

---

## 🚀 Key Features

- Account creation with auto-generated UUIDs
- Immutable ledger entries (append-only)
- Balance calculated dynamically from ledger entries
- Deposit and withdrawal operations
- Overdraft prevention (no negative balances)
- Internal transfers using double-entry bookkeeping
- ACID-compliant database transactions
- RESTful API built with NestJS
- PostgreSQL as the persistent data store

---

## 🏗️ Technology Stack

- **Backend Framework:** NestJS (Node.js)
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** TypeORM
- **Validation:** class-validator
- **Containerization:** Docker & Docker Compose
- **API Testing:** Postman

---

## 📂 Project Structure

```text
src/
├── accounts/
│   ├── account.entity.ts
│   ├── accounts.controller.ts
│   ├── accounts.service.ts
│   └── dto/
├── ledger/
│   └── ledger-entry.entity.ts
├── transactions/
│   ├── transaction.entity.ts
│   ├── transactions.controller.ts
│   ├── transactions.service.ts
│   └── dto/
├── app.module.ts
└── main.ts
