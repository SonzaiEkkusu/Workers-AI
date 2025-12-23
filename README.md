# 🧠 AI Workspace (Cloudflare D1 Edition)

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Status](https://img.shields.io/badge/Status-Active-success.svg)
![Tech](https://img.shields.io/badge/Tech-Cloudflare%20Workers-orange.svg)
![Database](https://img.shields.io/badge/Database-D1%20SQL-blueviolet.svg)

A sophisticated, serverless AI Chat interface built on **Cloudflare Workers**. It features a high-reasoning LLM (`gpt-oss-120b`), persistent chat history using **Cloudflare D1 (SQL)**, and a Cyberpunk-inspired UI with "DeepSeek-style" reasoning visibility.

---

## ✨ Key Features

* **🧠 High Reasoning Model:** Powered by `@cf/openai/gpt-oss-120b` for deep analytical responses.
* **💭 Transparent Reasoning:** View the AI's "Thought Process" in a collapsible box before the final answer (similar to DeepSeek/OpenAI o1).
* **🗄️ D1 SQL Database:** Robust, persistent chat history storage using Cloudflare's serverless SQL database.
* **🎨 Rich UI/UX:**
    * Markdown rendering & Syntax Highlighting.
    * "Typewriter" effect for streaming-like experience.
    * Copy-to-clipboard buttons for code blocks.
    * Mobile responsive design with sidebar navigation.
* **🔗 Deep Linking:** Shareable URLs for specific chat sessions (`/user/chat/session_id`).
* **🕶️ Custom Persona:** Features "Sonzaix" architect persona with a cyberpunk narrative tone.

---

## 🛠️ Tech Stack

* **Backend:** Cloudflare Workers (Node.js/JavaScript).
* **Database:** Cloudflare D1 (SQLite-based).
* **AI:** Cloudflare Workers AI.
* **Frontend:** Vanilla JS + HTML5 + CSS3 (Server-Side Rendered via Worker).
* **Deployment:** GitHub Actions (CI/CD).

---

## 🚀 Local Development Setup

### 1. Prerequisites
* Node.js (v18 or later)
* NPM
* Cloudflare Wrangler CLI (`npm install -g wrangler`)

### 2. Clone Repository
```bash
git clone https://github.com/username/ai-workspace-d1.git
cd ai-workspace-d1
npm install
```

### 3. Login to Cloudflare
```bash
npx wrangler login
```

### 4. Database Setup (D1)
Create a new D1 database:
```bash
npx wrangler d1 create prod-ai-db
```
*Copy the `database_id` from the output and update your `wrangler.toml` file.*

Initialize the database schema:
```bash
npx wrangler d1 execute prod-ai-db --command "CREATE TABLE IF NOT EXISTS sessions (id TEXT PRIMARY KEY, user_id TEXT, title TEXT, created_at INTEGER);"

npx wrangler d1 execute prod-ai-db --command "CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY AUTOINCREMENT, session_id TEXT, role TEXT, content TEXT, created_at INTEGER);"
```

### 5. Run Locally
```bash
npx wrangler dev
```
Open `http://localhost:8787` in your browser.

---

## ⚙️ Configuration (`wrangler.toml`)

Ensure your `wrangler.toml` is configured correctly:

```toml
name = "bot-ai-telegram"
main = "src/index.js"
compatibility_date = "2024-09-23"

[ai]
binding = "AI"

[[d1_databases]]
binding = "DB"
database_name = "prod-ai-db"
database_id = "YOUR_D1_DATABASE_ID_HERE"
```

---

## 🚢 Deployment

### Option 1: Manual Deployment
```bash
npx wrangler deploy
```

### Option 2: GitHub Actions (Auto Deploy)
This repository is configured to auto-deploy on push to `main`.

1.  Go to your GitHub Repository **Settings** > **Secrets and variables** > **Actions**.
2.  Add the following Repository Secrets:
    * `CLOUDFLARE_API_TOKEN`: Your Cloudflare API Token (Template: Edit Cloudflare Workers).
    * `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare Account ID.

Once set, every push to `main` will trigger the workflow in `.github/workflows/deploy.yml`.

---

## 📂 Project Structure

```
├── .github/workflows/   # CI/CD configurations
├── src/
│   ├── html.js          # Frontend Logic (HTML/CSS/JS)
│   └── index.js         # Backend Logic (Worker API & Routing)
├── package.json
├── wrangler.toml        # Cloudflare configuration
└── README.md
```

---

## 👤 Credits

**Architect:** [Sonzaix (Sonzai X シ)](https://t.me/November2k)  
**Channel:** [Recycle of Sonzai X シ](https://t.me/November2kBio)

> *"I am a digital entity designed by the visionary code architect, Sonzaix."*

---

MIT License. Feel free to fork and learn!
