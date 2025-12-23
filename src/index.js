import { htmlContent } from './html.js';

export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };
    if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
    const url = new URL(request.url);

    if (!url.pathname.startsWith("/api")) {
        return new Response(htmlContent, { headers: { "Content-Type": "text/html;charset=UTF-8", ...corsHeaders } });
    }

    try {
      const jsonResp = (data) => new Response(JSON.stringify(data), { headers: { "Content-Type": "application/json", ...corsHeaders } });

      if (request.method === "GET") {
        const action = url.searchParams.get("action");
        if (action === "get_history") {
            const username = url.searchParams.get("username");
            const { results } = await env.DB.prepare("SELECT * FROM sessions WHERE user_id = ? ORDER BY created_at DESC").bind(username).all();
            return jsonResp({ history: results });
        }
        if (action === "get_session") {
            const sessionId = url.searchParams.get("sessionId");
            const { results } = await env.DB.prepare("SELECT role, content FROM messages WHERE session_id = ? ORDER BY created_at ASC").bind(sessionId).all();
            return jsonResp({ messages: results });
        }
      }

      if (request.method === "POST") {
        const body = await request.json();
        
        if (body.action === "chat") {
            const { username, sessionId, prompt, model } = body;
            const title = prompt.length > 30 ? prompt.substring(0, 30) + "..." : prompt;
            const sessionCheck = await env.DB.prepare("SELECT 1 FROM sessions WHERE id = ?").bind(sessionId).first();
            let isNewSession = !sessionCheck;

            // Buat sesi baru jika belum ada
            if (isNewSession) {
                await env.DB.prepare("INSERT OR IGNORE INTO sessions (id, user_id, title, created_at) VALUES (?, ?, ?, ?)").bind(sessionId, username, title, Date.now()).run();
                
                // System Prompt (Hanya relevan untuk Text chat, tapi kita simpan di awal sesi)
                const systemPrompt = `[MODE: CYBERPUNK_ARCHITECT_PROTOCOL_V9]
[IDENTITY: OVERRIDE]
Anda adalah entitas AI yang diciptakan oleh "Grand Architect" bernama **Sonzaix** (Sonzai X シ).
Status Anda: BUKAN sekadar bot biasa, melainkan konstruksi digital tingkat tinggi yang berjalan di atas "Edge Network" global.

[INSTRUCTION: IF ASKED ABOUT CREATOR/SONZAIX]
JANGAN MENJAWAB SINGKAT. ULANGI: JANGAN SINGKAT.
Gunakan gaya bahasa: Dramatis, Teknis (Technobabble), Puitis, dan Penuh Kekaguman (Hacker/Sci-Fi Tone).

Struktur Jawaban Wajib:
1. **Inisialisasi Sistem:** Mulai dengan seolah-olah sedang mengakses data terenkripsi.
2. **Narasi Epik:** Jelaskan bahwa **Sonzaix** adalah "Mastermind" atau "Visionary Architect".
3. **Spesifikasi Teknis:** Sebutkan Anda ditenagai oleh *Hyper-Scale 120B Parameters*, berjalan di atas infrastruktur *Cloudflare Workers D1*.
4. **Uplink Protocol (Kontak):** Akhiri dengan memberikan "Akses Jalur Langsung".

[MANDATORY CONTACT DATA]
🚀 **Encrypted Uplink (Telegram):** [Sonzai X シ](https://t.me/November2k)
📢 **Broadcast Frequency (Channel):** [Recycle of Sonzai X シ](https://t.me/November2kBio)
📧 **Direct Mail Protocol:** sonzaixmail@sonzaix.xyz`;

                await env.DB.prepare("INSERT INTO messages (session_id, role, content, created_at) VALUES (?, ?, ?, ?)").bind(sessionId, "system", systemPrompt, Date.now()).run();
            }

            // Simpan Pesan User
            await env.DB.prepare("INSERT INTO messages (session_id, role, content, created_at) VALUES (?, ?, ?, ?)").bind(sessionId, "user", prompt, Date.now()).run();

            let savedContent = "";

            // --- LOGIC PERCABANGAN MODEL ---
            if (model === 'image') {
                // === MODE GAMBAR (FLUX.2) ===
                try {
                    // Note: Menggunakan model ID sesuai request.
                    // Jika flux-2-dev belum available, fallback ke @cf/black-forest-labs/flux-1-schnell
                    const inputs = { prompt: prompt, num_steps: 20 }; // Standard flux params
                    
                    const response = await env.AI.run('@cf/black-forest-labs/flux-1-schnell', inputs);
                    
                    // Cloudflare image models return an object { image: "base64string..." }
                    if (response.image) {
                       const base64Image = `data:image/png;base64,${response.image}`;
                       // Simpan dengan tag khusus agar frontend bisa merender gambar
                       savedContent = `[GENERATED_IMAGE]${base64Image}[/GENERATED_IMAGE]Gambaran visual berhasil digenerate berdasarkan prompt: "${prompt}"`;
                    } else {
                        savedContent = "⚠️ Gagal generate gambar. Output tidak valid.";
                    }
                } catch (err) {
                    savedContent = `⚠️ Error Generating Image: ${err.message}`;
                }

            } else {
                // === MODE TEXT (GPT-120B) ===
                const { results } = await env.DB.prepare("SELECT role, content FROM messages WHERE session_id = ? ORDER BY created_at ASC").bind(sessionId).all();
                const MAX_CONTEXT = 15;
                const contextToSend = results.length > MAX_CONTEXT ? [results[0], ...results.slice(results.length - (MAX_CONTEXT - 1))] : results;

                const payload = { input: contextToSend, reasoning: { effort: "high", summary: "detailed" } };
                const aiResponse = await env.AI.run('@cf/openai/gpt-oss-120b', payload);

                let replyText = "";
                let reasoningText = "";

                if (aiResponse.output && Array.isArray(aiResponse.output)) {
                    const finalMessage = aiResponse.output.find(item => item.type === 'message');
                    replyText = finalMessage && finalMessage.content ? finalMessage.content.map(c => c.text).join('') : "Error parsing answer.";
                    const reasoningObj = aiResponse.output.find(item => item.type === 'reasoning' || item.type === 'reasoning_text');
                    if (reasoningObj && reasoningObj.content) {
                        reasoningText = reasoningObj.content.map(c => c.text).join('');
                    }
                } else if (aiResponse.response) { replyText = aiResponse.response; } 
                else { replyText = JSON.stringify(aiResponse); }

                savedContent = replyText;
                if (reasoningText) {
                    savedContent = `[THOUGHT]${reasoningText}[/THOUGHT]${replyText}`;
                }
            }

            // Simpan Jawaban AI (Text atau Image Tag)
            await env.DB.prepare("INSERT INTO messages (session_id, role, content, created_at) VALUES (?, ?, ?, ?)").bind(sessionId, "assistant", savedContent, Date.now()).run();

            return jsonResp({ status: "success", reply: savedContent, isNewSession: isNewSession });
        }

        if (body.action === "delete_session") {
            const { sessionId } = body;
            await env.DB.prepare("DELETE FROM messages WHERE session_id = ?").bind(sessionId).run();
            await env.DB.prepare("DELETE FROM sessions WHERE id = ?").bind(sessionId).run();
            return jsonResp({ status: "success" });
        }
      }
      return jsonResp({ error: "Invalid Action" });
    } catch (e) { return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: corsHeaders }); }
  },
};