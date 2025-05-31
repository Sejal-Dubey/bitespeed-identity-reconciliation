# 🧠 Identity Reconciliation API – Bitespeed Backend Task

Hi there! 👋  
This project is my solution to the Bitespeed Backend Engineering task. It focuses on resolving and linking user identities based on overlapping contact information – kind of like building a mini identity graph!

---

## 🚀 Overview

The challenge was to design a backend API that can **identify and merge contacts** when they share the same phone number or email. The API maintains a structure where one contact is marked as "primary", and the rest are "secondary" – all neatly linked.

---

## 🛠️ Tech Stack

- **Node.js** + **Express**
- **TypeScript**
- **Prisma ORM**
- **MySQL** (can use SQLite for quick local testing)
- **Postman** (for testing APIs)

---

## 📬 API Endpoint

### `POST /identify`

Send an email, phone number, or both, and the API will respond with the linked identity cluster.

#### 🔍 Sample Request:
```json
{
  "email": "john@example.com",
  "phoneNumber": "1234567890"
}
````

#### ✅ Sample Response:

```json
{
  "primaryContactId": 1,
  "emails": ["john@example.com", "john.doe@gmail.com"],
  "phoneNumbers": ["1234567890"],
  "secondaryContactIds": [2]
}
```

---

## 🧩 Features

* Contact linking based on shared identifiers
* Primary & secondary identity structure
* Handles edge cases like circular references or missing info
* Built with clean modular structure and type safety

---

## 📂 Project Structure

```
├── src/
│   ├── controllers/
│   ├── routes/
│   ├── services/
│   ├── prisma/
│   └── utils/
```

---

## 🧪 How to Run

1. Clone the repo:

   ```bash
   git clone https://github.com/your-username/bitespeed-identity-reconciliation.git
   cd bitespeed-identity-reconciliation
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up your `.env` file (MySQL or SQLite connection string)

4. Initialize DB with Prisma:

   ```bash
   npx prisma migrate dev --name init
   ```

5. Start the dev server:

   ```bash
   npm run dev
   ```

---

## ✨ Why This Was Fun

This task was an awesome mix of **data modeling**, **deduplication logic**, and **clean API design**. I enjoyed thinking through how to maintain identity consistency and make the API predictable, scalable, and testable.

---

## 👤 Author

**Sejal Dubey-AIML-2022-26**

---

