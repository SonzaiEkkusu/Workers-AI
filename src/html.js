export const htmlContent = `
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>AI Workspace D1</title>
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        :root {
            --bg-sidebar: #171717; --bg-main: #212121; --bg-input: #2f2f2f;
            --text-primary: #ececec; --text-secondary: #b4b4b4;
            --accent: #10a37f; --hover: #2f2f2f; --user-bubble: #2f2f2f;
            --thought-bg: #2d2d2d; --thought-border: #404040;
        }
        body { margin: 0; font-family: 'Segoe UI', sans-serif; background: var(--bg-main); color: var(--text-primary); display: flex; height: 100dvh; overflow: hidden; }
        
        #login-screen { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: var(--bg-main); z-index: 9999; display: flex; flex-direction: column; justify-content: center; align-items: center; }
        .login-box { text-align: center; width: 80%; max-width: 300px; }
        .login-box input { width: 100%; padding: 12px; margin: 10px 0; border-radius: 5px; border: 1px solid #444; background: #333; color: white; box-sizing: border-box; }
        .login-box button { width: 100%; padding: 12px; border-radius: 5px; border: none; background: var(--accent); color: white; font-weight: bold; cursor: pointer; }

        #app-screen { display: flex; width: 100%; height: 100%; opacity: 0; transition: opacity 0.5s; position: relative; }
        
        aside { width: 260px; background: var(--bg-sidebar); display: flex; flex-direction: column; padding: 10px; border-right: 1px solid #333; transition: transform 0.3s ease-in-out; z-index: 1000; }
        .sidebar-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .close-sidebar-btn { display: none; background: none; border: none; color: white; font-size: 1.2rem; cursor: pointer; }
        .new-chat-btn { display: flex; gap: 10px; align-items: center; padding: 10px; border: 1px solid #444; width: 100%; border-radius: 5px; cursor: pointer; color: white; background: transparent; transition: 0.2s; box-sizing: border-box; }
        .new-chat-btn:hover { background: var(--hover); }
        .history-list { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 5px; padding-bottom: 10px; }
        .history-item { padding: 10px; border-radius: 5px; cursor: pointer; display: flex; align-items: center; justify-content: space-between; color: var(--text-secondary); font-size: 0.9rem; }
        .history-item:hover { background: var(--hover); color: white; }
        .history-item.active { background: #333; color: white; }
        .history-title { display: flex; align-items: center; gap: 10px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; max-width: 190px; }
        .delete-chat-btn { background: none; border: none; color: #666; cursor: pointer; padding: 5px; transition: color 0.2s; z-index: 2; }
        .delete-chat-btn:hover { color: #ef4444; }
        .user-profile { padding: 15px; border-top: 1px solid #333; display: flex; justify-content: space-between; align-items: center; font-size: 0.9rem; font-weight: bold; }
        .logout-btn { background: none; border: none; color: #ef4444; cursor: pointer; }
        #sidebar-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 900; display: none; }

        main { flex: 1; display: flex; flex-direction: column; position: relative; height: 100%; width: 100%; }
        #chat-box { flex: 1; overflow-y: auto; padding: 20px 15px 10px 15px; scroll-behavior: smooth; display: flex; flex-direction: column; }
        
        .message { margin-bottom: 25px; display: flex; gap: 10px; animation: fadeIn 0.3s ease; max-width: 90%; width: fit-content; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        
        .message.user { align-self: flex-end; flex-direction: row-reverse; }
        .message.user .content { background-color: var(--user-bubble); padding: 5px 15px; border-radius: 15px 0 15px 15px; }
        .message.ai { align-self: flex-start; max-width: 95%; } 
        
        .message .avatar { width: 30px; height: 30px; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0; font-size: 0.8rem; }
        .message.user .avatar { background: #666; }
        .message.ai .avatar { background: var(--accent); }
        .content-wrapper { flex: 1; min-width: 0; }
        .meta-info { font-size: 0.75rem; color: #888; margin-bottom: 5px; display: flex; align-items: center; gap: 5px; }
        
        .thought-box { background: var(--thought-bg); border-left: 3px solid var(--accent); border-radius: 4px; margin-bottom: 10px; overflow: hidden; }
        .thought-summary { padding: 8px 12px; cursor: pointer; font-size: 0.85rem; color: #aaa; display: flex; align-items: center; gap: 8px; user-select: none; font-weight: 500; }
        .thought-summary:hover { background: #333; color: #fff; }
        .thought-summary::after { content: '▼'; font-size: 0.7rem; margin-left: auto; transition: transform 0.2s; }
        .thought-box[open] .thought-summary::after { transform: rotate(180deg); }
        .thought-content { padding: 10px 12px; border-top: 1px solid var(--thought-border); font-size: 0.9rem; color: #ccc; background: #252525; white-space: pre-wrap; line-height: 1.5; font-family: 'Consolas', monospace; }

        .content { line-height: 1.6; font-size: 0.95rem; word-wrap: break-word; }
        .content p { margin-top: 0; margin-bottom: 10px; }
        .content p:last-child { margin-bottom: 0; }
        .content table { border-collapse: collapse; width: 100%; display: block; overflow-x: auto; margin: 10px 0; }
        .content th, .content td { border: 1px solid #444; padding: 6px; font-size: 0.9rem; }
        .content pre { background: #0d1117; padding: 10px; border-radius: 8px; overflow-x: auto; margin: 10px 0; max-width: 100%; position: relative; }
        
        .copy-btn { position: absolute; top: 5px; right: 5px; background: #21262d; border: 1px solid #30363d; color: #c9d1d9; border-radius: 5px; padding: 4px 8px; font-size: 0.7rem; cursor: pointer; opacity: 0.7; transition: 0.2s; display: flex; align-items: center; gap: 5px; }
        .copy-btn:hover { opacity: 1; background: #30363d; }
        
        .typing-cursor::after { content: '▋'; animation: blink 1s infinite; color: var(--accent); margin-left: 2px; }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }

        .input-area { padding: 10px 15px; background: var(--bg-main); border-top: 1px solid #333; flex-shrink: 0; }
        .input-container { background: var(--bg-input); border-radius: 20px; padding: 8px 15px; display: flex; align-items: flex-end; gap: 10px; border: 1px solid #444; }
        textarea { width: 100%; background: transparent; border: none; color: white; resize: none; font-family: inherit; font-size: 1rem; max-height: 120px; height: 24px; padding: 5px 0; outline: none; }
        .send-btn { background: var(--accent); border: none; border-radius: 50%; width: 35px; height: 35px; color: white; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .send-btn:disabled { background: #444; }

        @media (max-width: 768px) {
            aside { position: absolute; height: 100%; width: 280px; transform: translateX(-100%); box-shadow: 5px 0 15px rgba(0,0,0,0.5); }
            aside.open { transform: translateX(0); }
            #sidebar-overlay.open { display: block; }
            .close-sidebar-btn { display: block; }
            .mobile-menu-btn { display: block !important; }
            #chat-box { padding-bottom: 20px; }
        }
        .loading-dots::after { content: ' .'; animation: dots 1.5s steps(5, end) infinite; }
        @keyframes dots { 0%, 20% { content: ' .'; } 40% { content: ' ..'; } 60% { content: ' ...'; } 80%, 100% { content: ''; } }
    </style>
</head>
<body>
    <div id="login-screen">
        <div class="login-box">
            <h1>🤖 AI Workspace</h1>
            <p style="color: #aaa; margin-bottom: 20px;">Masuk untuk menyimpan riwayat chat.</p>
            <input type="text" id="username-input" placeholder="Masukkan Username">
            <button onclick="handleLogin()">Masuk</button>
        </div>
    </div>
    <div id="app-screen">
        <div id="sidebar-overlay" onclick="closeSidebar()"></div>
        <aside id="sidebar">
            <div class="sidebar-header">
                <button class="new-chat-btn" onclick="startNewChat()">
                    <i class="fas fa-plus"></i> New Chat
                </button>
                <button class="close-sidebar-btn" onclick="closeSidebar()"><i class="fas fa-times"></i></button>
            </div>
            <div class="history-list" id="history-list"></div>
            <div class="user-profile">
                <span id="display-username">User</span>
                <button class="logout-btn" onclick="handleLogout()" title="Logout"><i class="fas fa-sign-out-alt"></i></button>
            </div>
        </aside>
        <main>
            <button onclick="openSidebar()" style="position: absolute; top: 15px; left: 15px; z-index: 50; background:rgba(0,0,0,0.5); border:none; color:white; font-size: 1.2rem; padding: 5px 10px; border-radius: 5px; display: none;" class="mobile-menu-btn">
                <i class="fas fa-bars"></i>
            </button>
            <div id="chat-box">
                <div style="text-align: center; margin-top: 20vh; color: #555;">
                    <h2>gpt-oss-120b</h2>
                    <p>High Reasoning Model • D1 Database</p>
                </div>
            </div>
            <div class="input-area">
                <div class="input-container">
                    <textarea id="user-input" placeholder="Ketik pesan..." rows="1" oninput="resizeTextarea(this)"></textarea>
                    <button id="send-btn" class="send-btn" onclick="sendMessage()"><i class="fas fa-arrow-up"></i></button>
                </div>
            </div>
        </main>
    </div>

<script>
    const API_URL = window.location.origin;
    const pathParts = window.location.pathname.split('/').filter(p => p);
    let initialUser = null, initialSession = null;
    if (pathParts.length >= 3 && pathParts[1] === 'chat') {
        initialUser = decodeURIComponent(pathParts[0]);
        initialSession = pathParts[2];
    }
    let currentUser = initialUser;
    let currentSessionId = initialSession;

    function resizeTextarea(el) { el.style.height = 'auto'; el.style.height = (el.scrollHeight) + 'px'; if(el.value === '') el.style.height = '24px'; }
    function openSidebar() { document.getElementById('sidebar').classList.add('open'); document.getElementById('sidebar-overlay').classList.add('open'); }
    function closeSidebar() { document.getElementById('sidebar').classList.remove('open'); document.getElementById('sidebar-overlay').classList.remove('open'); }

    window.onpopstate = function(event) {
        const parts = window.location.pathname.split('/').filter(p => p);
        if (parts.length >= 3 && parts[1] === 'chat') { loadSession(parts[2], false); } 
        else { startNewChat(false); }
    };

    function initApp() {
        const storedUser = localStorage.getItem("ai_username");
        if (!currentUser && storedUser) { currentUser = storedUser; }
        if (currentUser) {
            document.getElementById("login-screen").style.display = "none";
            document.getElementById("app-screen").style.opacity = "1";
            document.getElementById("display-username").innerText = currentUser;
            localStorage.setItem("ai_username", currentUser);
            loadHistory();
            if (currentSessionId) { loadSession(currentSessionId, false); } 
            else { startNewChat(false); }
        } else { document.getElementById("login-screen").style.display = "flex"; }
    }
    function handleLogin() {
        const username = document.getElementById("username-input").value.trim();
        if (!username) return alert("Username wajib diisi");
        currentUser = username; localStorage.setItem("ai_username", username);
        window.history.pushState({}, '', \`/\${currentUser}\`);
        initApp();
    }
    function handleLogout() { localStorage.removeItem("ai_username"); window.location.href = "/"; }

    async function loadHistory() {
        try {
            const res = await fetch(\`\${API_URL}/api?action=get_history&username=\${currentUser}\`);
            const data = await res.json();
            const listEl = document.getElementById("history-list");
            listEl.innerHTML = "";
            if (data.history && data.history.length > 0) {
                data.history.forEach(item => {
                    const div = document.createElement("div");
                    div.className = "history-item";
                    if (item.id === currentSessionId) div.classList.add("active");
                    div.onclick = () => navigateToSession(item.id);
                    div.innerHTML = \`
                        <div class="history-title"><i class="far fa-message"></i> \${item.title || "Chat Baru"}</div>
                        <button class="delete-chat-btn" onclick="deleteSession('\${item.id}', event)" title="Hapus"><i class="fas fa-trash"></i></button>\`;
                    listEl.appendChild(div);
                });
            } else { listEl.innerHTML = "<div style='padding:10px; color:#555; font-size:0.8rem; text-align:center;'>Belum ada chat.</div>"; }
        } catch (e) { console.error(e); }
    }

    function navigateToSession(sessionId) { window.history.pushState({}, '', \`/\${currentUser}/chat/\${sessionId}\`); loadSession(sessionId, false); }
    
    async function loadSession(sessionId, updateUrl = true) {
        currentSessionId = sessionId;
        document.getElementById("chat-box").innerHTML = ""; 
        updateSidebarActive();
        closeSidebar(); 
        if(updateUrl) window.history.pushState({}, '', \`/\${currentUser}/chat/\${sessionId}\`);
        const res = await fetch(\`\${API_URL}/api?action=get_session&sessionId=\${sessionId}\`);
        const data = await res.json();
        if (data.messages) {
            data.messages.forEach(msg => {
                if(msg.role !== 'system') {
                    let displayRole = (msg.role === 'assistant') ? 'ai' : msg.role;
                    appendMessage(displayRole, msg.content, false);
                }
            });
        }
    }
    async function deleteSession(sessionId, event) {
        event.stopPropagation(); if(!confirm("Hapus chat ini permanen?")) return;
        try {
            event.target.closest('.history-item').remove();
            if(currentSessionId === sessionId) startNewChat(true);
            await fetch(\`\${API_URL}/api\`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "delete_session", sessionId: sessionId }) });
            await loadHistory();
        } catch(e) { alert("Error"); }
    }
    function startNewChat(updateUrl = true) {
        currentSessionId = "sess_" + Math.random().toString(36).substr(2, 9);
        document.getElementById("chat-box").innerHTML = \`
            <div style="text-align: center; margin-top: 20vh; color: #555;">
                <h2>gpt-oss-120b</h2>
                <p>Mulai percakapan baru...</p>
            </div>\`;
        if(updateUrl && currentUser) { window.history.pushState({}, '', \`/\${currentUser}\`); updateSidebarActive(); closeSidebar(); }
    }
    function updateSidebarActive() { document.querySelectorAll(".history-item").forEach(el => el.classList.remove("active")); loadHistory(); }

    const userInput = document.getElementById("user-input");
    userInput.addEventListener("keydown", function(e) { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } });

    // --- PARSING THOUGHT ---
    function parseMessageContent(text) {
        const thoughtRegex = /\\[(THOUGHT|OUGHT|REASONING)\\]([\\s\\S]*?)\\[\\/\\1\\]/i;
        const match = text.match(thoughtRegex);
        
        if (match) {
            const thought = match[2].trim(); 
            const actualMessage = text.replace(thoughtRegex, "").trim(); 
            return { thought, actualMessage };
        }
        return { thought: null, actualMessage: text };
    }

    function appendMessage(role, text, useTypingEffect = false, duration = 0) {
        const chatBox = document.getElementById("chat-box");
        if (chatBox.querySelector("h2")) chatBox.innerHTML = "";

        const div = document.createElement("div");
        div.className = \`message \${role}\`;
        
        const avatar = role === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';
        let metaHtml = (role === 'ai' && duration > 0) ? \`<div class="meta-info"><i class="fas fa-stopwatch"></i> \${duration}s</div>\` : "";

        const { thought, actualMessage } = parseMessageContent(text);
        let thoughtHtml = "";
        
        if (thought) {
            thoughtHtml = \`
                <details class="thought-box">
                    <summary class="thought-summary">Reasoning Process</summary>
                    <div class="thought-content">\${marked.parse(thought)}</div>
                </details>
            \`;
        }

        const contentWrapper = document.createElement("div");
        contentWrapper.className = "content-wrapper";
        contentWrapper.innerHTML = metaHtml + thoughtHtml;

        const contentDiv = document.createElement("div");
        contentDiv.className = "content";
        contentWrapper.appendChild(contentDiv);

        div.innerHTML = \`<div class="avatar">\${avatar}</div>\`;
        div.appendChild(contentWrapper);
        chatBox.appendChild(div);

        if (useTypingEffect && role === 'ai') {
            contentDiv.classList.add("typing-cursor");
            typeWriterEffect(contentDiv, actualMessage);
        } else {
            if(role === 'ai') {
                contentDiv.innerHTML = marked.parse(actualMessage);
                finalizeMessage(contentDiv);
            } else {
                contentDiv.innerHTML = actualMessage.replace(/\\n/g, '<br>');
            }
        }
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    function typeWriterEffect(element, fullText) {
        let index = 0; const speed = 5; const step = 3; 
        function type() {
            if (index < fullText.length) {
                index += step; if (index > fullText.length) index = fullText.length;
                element.innerHTML = marked.parse(fullText.substring(0, index));
                document.getElementById("chat-box").scrollTop = document.getElementById("chat-box").scrollHeight;
                setTimeout(type, speed);
            } else {
                element.classList.remove("typing-cursor");
                finalizeMessage(element);
            }
        }
        type();
    }
    function finalizeMessage(element) {
        element.querySelectorAll('pre code').forEach(hljs.highlightElement);
        element.querySelectorAll('pre').forEach(pre => {
            if(pre.querySelector('.copy-btn')) return;
            const btn = document.createElement('button');
            btn.className = 'copy-btn';
            btn.innerHTML = '<i class="fas fa-copy"></i> Copy';
            btn.onclick = () => {
                const code = pre.querySelector('code').innerText;
                navigator.clipboard.writeText(code).then(() => {
                    btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                    setTimeout(() => btn.innerHTML = '<i class="fas fa-copy"></i> Copy', 2000);
                });
            };
            pre.appendChild(btn);
        });
    }

    let loadingInterval;
    const loadingTexts = ["Membaca konteks...", "Menganalisis logika...", "Mencari referensi...", "Menyusun jawaban...", "Memvalidasi fakta..."];
    
    function startLoadingAnimation(element) {
        let i = 0;
        element.innerText = "Sedang berpikir...";
        loadingInterval = setInterval(() => {
            element.innerText = loadingTexts[i % loadingTexts.length];
            i++;
        }, 2000);
    }
    function stopLoadingAnimation() { clearInterval(loadingInterval); }

    async function sendMessage() {
        const text = userInput.value.trim();
        if (!text) return;
        appendMessage("user", text);
        userInput.value = ""; resizeTextarea(userInput);

        const loadingDiv = document.createElement("div");
        loadingDiv.className = "message ai"; loadingDiv.id = "loading";
        loadingDiv.innerHTML = \`<div class="avatar"><i class="fas fa-robot"></i></div><div class="content" style="color:#aaa;"><span id="loading-text">Sedang berpikir...</span><span class="loading-dots"></span></div>\`;
        document.getElementById("chat-box").appendChild(loadingDiv);
        document.getElementById("chat-box").scrollTop = document.getElementById("chat-box").scrollHeight;

        startLoadingAnimation(document.getElementById("loading-text"));

        const startTime = Date.now();
        const sessionToSend = currentSessionId;

        try {
            const response = await fetch(\`\${API_URL}/api\`, {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "chat", username: currentUser, sessionId: sessionToSend, prompt: text })
            });
            const duration = ((Date.now() - startTime) / 1000).toFixed(1);
            const data = await response.json();
            
            stopLoadingAnimation();
            document.getElementById("loading").remove();

            if (data.status === "success") {
                appendMessage("ai", data.reply, true, duration);
                if (window.location.pathname.indexOf(sessionToSend) === -1) {
                    window.history.pushState({}, '', \`/\${currentUser}/chat/\${sessionToSend}\`);
                    loadHistory();
                }
            } else { appendMessage("ai", "⚠️ " + data.error); }
        } catch (e) {
            stopLoadingAnimation();
            if(document.getElementById("loading")) document.getElementById("loading").remove();
            appendMessage("ai", "⚠️ Gagal terhubung.");
        }
    }
    initApp();
</script>
</body>
</html>
`;