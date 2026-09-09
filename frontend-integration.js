// Add near the start of index.html's main <script>.
// Do NOT put a secret API key in GitHub Pages; every visitor can read it.
const AI_API_BASE_URL = "https://tipped-roast-tamale.ngrok-free.dev";

async function askAIAssistant() {
    const query = document.getElementById('ai-query').value.trim();
    if (!query) return;

    const box = document.getElementById('ai-response-box');
    const text = document.getElementById('ai-response-text');
    box.classList.remove('hidden');
    text.innerText = '🤖 กำลังวิเคราะห์ด้วย AI ภายในองค์กร...';

    try {
        // If a user has selected an office for comparison, it becomes useful
        // geographic context for the model. Otherwise send an empty object.
        const office = selectedOffices[0]?.properties || {};
        const response = await fetch(`${AI_API_BASE_URL}/analyze`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query, office })
        });
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error || 'AI service error');

        const result = payload.result;
        const actions = (result.recommended_actions || [])
            .map(action => `• ${action}`)
            .join('\n');
        text.innerText = `${result.summary}\n\nประเภท: ${result.category} | ความเร่งด่วน: ${result.urgency}\n${actions}\n\n${result.disclaimer}`;
    } catch (error) {
        text.innerText = 'ไม่สามารถเชื่อมต่อ AI ภายในองค์กรได้ กรุณาลองใหม่ภายหลัง';
        console.error('Smart Legal Aid AI request failed:', error);
    }
}

// Optional: replace runComparisonModal() only if the comparison result should
// be AI-generated. It keeps the current UI's local comparison as a fallback.
async function requestAIComparison(office1, office2) {
    const response = await fetch(`${AI_API_BASE_URL}/compare`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ office1, office2 })
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || 'AI comparison failed');
    return payload.result;
}
