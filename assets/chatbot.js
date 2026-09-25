/* =========================================================================
   SRU CAMPUS HELPER BOT
   100% rule-based keyword matching. No network calls, no AI API.
   Scoring: each matched keyword adds points; longer/more specific
   keywords score higher so "computer science" beats a stray "science".
   ========================================================================= */

(function(){
  const log = document.getElementById('chatLog');
  const form = document.getElementById('chatForm');
  const input = document.getElementById('chatInput');
  const quickWrap = document.getElementById('quickReplies');
  if (!log || !form) return;

  function normalize(str){
    return str.toLowerCase().replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim();
  }

  function scoreIntent(intent, text){
    let score = 0;
    intent.keywords.forEach(k => {
      if (text.includes(k)) score += k.split(' ').length; // multi-word keywords score higher
    });
    return score;
  }

  function classify(userText){
    const text = normalize(userText);
    let best = null, bestScore = 0;
    SRU_DATA.chatbotIntents.forEach(intent => {
      const s = scoreIntent(intent, text);
      if (s > bestScore){ bestScore = s; best = intent; }
    });
    if (!best) return pick(SRU_DATA.chatbotFallback);
    return pick(best.responses);
  }

  function pick(arr){ return arr[Math.floor(Math.random() * arr.length)]; }

  function addMessage(text, who){
    const div = document.createElement('div');
    div.className = `msg ${who}`;
    div.textContent = text;
    log.appendChild(div);
    log.scrollTop = log.scrollHeight;
    return div;
  }

  function botReply(userText){
    const typingEl = addMessage('', 'bot');
    typingEl.innerHTML = '<span class="typing"><span></span><span></span><span></span></span>';
    const delay = 420 + Math.random() * 380;
    setTimeout(() => {
      typingEl.textContent = classify(userText);
      log.scrollTop = log.scrollHeight;
    }, delay);
  }

  function send(text){
    const trimmed = text.trim();
    if (!trimmed) return;
    addMessage(trimmed, 'user');
    botReply(trimmed);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    send(input.value);
    input.value = '';
    input.focus();
  });

  quickWrap.innerHTML = SRU_DATA.chatbotQuickReplies.map(q => `<button class="quick-reply" type="button">${q}</button>`).join('');
  quickWrap.addEventListener('click', (e) => {
    const btn = e.target.closest('.quick-reply');
    if (btn) send(btn.textContent);
  });

  // opening message
  addMessage(`Hi! I'm the SR University campus helper — ask me about admissions, courses, fees, hostel, placements, or facilities. Try a quick question below, or type your own.`, 'bot');
})();
