# 🧠 AI Workspace (Cloudflare D1 Edition)

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Status](https://img.shields.io/badge/Status-Active-success.svg)
![Tech](https://img.shields.io/badge/Tech-Cloudflare%20Workers-orange.svg)

A sophisticated, serverless AI Chat interface built on **Cloudflare Workers**. It features a high-reasoning LLM (`gpt-oss-120b`), persistent chat history using **Cloudflare D1 (SQL)**, and a Cyberpunk-inspired UI with "DeepSeek-style" reasoning visibility.

---

## ✨ Key Features

* **🧠 High Reasoning Model:** Powered by `@cf/openai/gpt-oss-120b` for deep analytical responses.
* **💭 Transparent Reasoning:** View the AI's "Thought Process" in a collapsible box before the final answer (similar to DeepSeek/OpenAI o1).
* **🗄️ D1 SQL Database:** Robust, persistent chat history storage using Cloudflare's serverless SQL database. Not just key-value storage.
* **🎨 Rich UI/UX:**
    * Markdown rendering & Syntax Highlighting.
    * "Typewriter" effect for streaming-like experience.
    * Copy-to-clipboard buttons for code blocks.
    * Mobile responsive design with sidebar navigation.
* **🔗 Deep Linking:** Shareable URLs for specific chat sessions (`/user/chat/session_id`).
* **🕶️ Custom Persona:** Features "Sonzaix" architect persona with a cyberpunk narrative tone.

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
git clone [https://github.com/username/ai-workspace-d1.git](https://github.com/username/ai-workspace-d1.git)
cd ai-workspace-d1
npm install