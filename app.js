/* =========================================================
   What are you going to do?  — 앱 로직
   1) 발음 채점 엔진 (Node 에서도 테스트 가능)
   2) 화면 (활동 카드 초급·중급 / 연습하기)
   ========================================================= */
(function (root) {
  "use strict";

  /* ---------------------------------------------------------
     1) 발음 채점 엔진
     --------------------------------------------------------- */
  const CONTRACTIONS = {
    "i'm": "i am", "i'll": "i will", "i've": "i have", "i'd": "i would",
    "you're": "you are", "you'll": "you will", "we're": "we are", "we'll": "we will",
    "they're": "they are", "they'll": "they will", "he's": "he is", "she's": "she is",
    "it's": "it is", "that's": "that is", "what's": "what is", "let's": "let us",
    "don't": "do not", "doesn't": "does not", "didn't": "did not", "can't": "can not",
    "cannot": "can not", "won't": "will not", "isn't": "is not", "aren't": "are not",
    "gonna": "going to", "wanna": "want to", "im": "i am"
  };
  // 동음어 통일 (소리가 같은 말을 같은 철자로)
  const HOMOPHONES = {
    "too": "to", "two": "to", "2": "to", "four": "for", "4": "for", "fore": "for",
    "sea": "see", "c": "see", "buy": "by", "bye": "by", "right": "write", "rite": "write",
    "knew": "new", "high": "hi", "won": "one", "1": "one", "ate": "eight", "8": "eight",
    "their": "there", "they're": "there", "hole": "whole", "meat": "meet", "peace": "piece",
    "dear": "deer", "flour": "flower", "son": "sun", "tail": "tale", "week": "weak",
    "plain": "plane", "rode": "road", "made": "maid", "hour": "our", "ok": "okay"
  };
  // 작은 단어 (가중치 0.3)
  const SMALL = new Set(["a", "an", "the", "to", "my", "i", "am", "at", "in", "on", "of", "for",
    "with", "and", "by", "some", "is", "are", "me", "up"]);
  const W_CORE = 1, W_SMALL = 0.3, W_PLACE = 0.6;

  function stripAccents(s) { return s.normalize ? s.normalize("NFD").replace(/[̀-ͯ]/g, "") : s; }

  // 들린 말(또는 목표 문장)을 비교용 단어 배열로
  function normalize(text) {
    let s = stripAccents(String(text || "")).toLowerCase().replace(/[’‘`]/g, "'");
    s = s.replace(/[^a-z0-9' ]+/g, " ");
    let words = [];
    for (let w of s.split(/\s+/)) {
      w = w.replace(/^'+|'+$/g, "");
      if (!w) continue;
      if (CONTRACTIONS[w]) { words.push(...CONTRACTIONS[w].split(" ")); continue; }
      w = w.replace(/'/g, "");
      if (!w) continue;
      words.push(w);
    }
    words = joinLetters(words);
    return words.map(w => HOMOPHONES[w] || w);
  }

  // 한 글자씩 들린 말 붙이기: "p c" → "pc"  (a / i 는 단어일 수 있으니 앞에 오면 떼어 둠)
  function joinLetters(words) {
    const out = [];
    let i = 0;
    while (i < words.length) {
      if (words[i].length === 1 && /[a-z]/.test(words[i])) {
        let j = i;
        while (j < words.length && words[j].length === 1 && /[a-z]/.test(words[j])) j++;
        let run = words.slice(i, j);
        while (run.length > 1 && (run[0] === "a" || run[0] === "i") && run.length - 1 >= 2) { out.push(run.shift()); }
        if (run.length >= 2 && !(run.length === 2 && run.every(x => x === "a" || x === "i"))) out.push(run.join(""));
        else out.push(...run);
        i = j;
      } else { out.push(words[i]); i++; }
    }
    return out;
  }

  // 자음만 통일한 소리 키 (모음은 그대로 → kite ≠ cat)
  function soundKey(w) {
    let s = w.toLowerCase();
    s = s.replace(/ph/g, "f").replace(/th/g, "s").replace(/ck/g, "k").replace(/sh/g, "s")
         .replace(/ch/g, "c").replace(/qu/g, "kw").replace(/x/g, "ks").replace(/wh/g, "w");
    s = s.replace(/[rl]/g, "l").replace(/[fp]/g, "p").replace(/[vb]/g, "b").replace(/[ckqg]/g, "k")
         .replace(/[zsj]/g, "s").replace(/[dt]/g, "t");
    s = s.replace(/(.)\1+/g, "$1");           // 겹자음 하나로
    if (s.length > 3) s = s.replace(/e$/, ""); // 끝의 소리 없는 e
    return s;
  }

  function lev(a, b) {
    const m = a.length, n = b.length;
    if (!m) return n; if (!n) return m;
    let prev = Array.from({ length: n + 1 }, (_, j) => j);
    for (let i = 1; i <= m; i++) {
      const cur = [i];
      for (let j = 1; j <= n; j++) {
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      }
      prev = cur;
    }
    return prev[n];
  }

  // 단어 점수: 같음 1 · 철자 1글자 차이 0.85 · 소리 비슷 0.7 · 비슷한 편 0.5 · 그 외 0
  function wordScore(target, heard) {
    if (target === heard) return 1;
    const minLen = Math.min(target.length, heard.length);
    if (minLen >= 3 && lev(target, heard) === 1) return 0.85;
    const ka = soundKey(target), kb = soundKey(heard);
    if (ka === kb) return 0.7;
    // 비슷한 편: 모음 뼈대가 같고 자음이 조금 다름, 또는 앞부분이 같음 (potato / potatoes)
    const vow = k => k.replace(/[^aeiouy]/g, "");
    if (minLen >= 3 && vow(ka) === vow(kb) && lev(ka, kb) <= 2) return 0.5;
    if (minLen >= 4 && (ka.startsWith(kb) || kb.startsWith(ka))) return 0.5;
    return 0;
  }

  // 목표 문장 → 채점용 단어 목록 (표시용 칩 정보 포함)
  function targetTokens(sentence) {
    const raw = String(sentence).replace(/[.?!,]/g, " ").split(/\s+/).filter(Boolean);
    const tokens = [];   // {w, weight, chip}
    const chips = [];    // {text, idx:[token idx]}
    raw.forEach((orig, k) => {
      const parts = normalize(orig);
      const chip = { text: orig, idx: [] };
      const isPlace = k > 0 && /^[A-Z][a-z]/.test(orig) && orig !== "I" && !/^I'/.test(orig);
      for (const p of parts) {
        let weight = SMALL.has(p) ? W_SMALL : W_CORE;
        if (isPlace) weight = W_PLACE;
        chip.idx.push(tokens.length);
        tokens.push({ w: p, weight, chip: chips.length });
      }
      chips.push(chip);
    });
    return { tokens, chips };
  }

  // 단어 "순서대로" 동적 계획법 정렬
  function align(tokens, heard) {
    const m = tokens.length, n = heard.length;
    // dp[i][j] = [가중 점수 합, 맞춘 단어 수]
    const dp = Array.from({ length: m + 1 }, () => Array.from({ length: n + 1 }, () => [0, 0]));
    const back = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
    const better = (a, b) => a[0] > b[0] + 1e-9 || (Math.abs(a[0] - b[0]) <= 1e-9 && a[1] > b[1]);
    for (let i = 1; i <= m; i++) back[i][0] = 1;
    for (let j = 1; j <= n; j++) back[0][j] = 2;
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        let best = dp[i - 1][j], how = 1;                    // 목표 단어 놓침
        if (better(dp[i][j - 1], best)) { best = dp[i][j - 1]; how = 2; } // 덧붙인 말
        const s = wordScore(tokens[i - 1].w, heard[j - 1]);
        if (s > 0) {
          const cand = [dp[i - 1][j - 1][0] + s * tokens[i - 1].weight, dp[i - 1][j - 1][1] + 1];
          if (better(cand, best)) { best = cand; how = 3; }
        }
        dp[i][j] = best; back[i][j] = how;
      }
    }
    const match = new Array(m).fill(null); // {score, heard}
    let i = m, j = n, used = 0;
    while (i > 0 || j > 0) {
      const how = back[i][j];
      if (how === 3) { match[i - 1] = { score: wordScore(tokens[i - 1].w, heard[j - 1]), heard: heard[j - 1] }; used++; i--; j--; }
      else if (how === 1) i--;
      else j--;
    }
    return { match, extras: n - used };
  }

  function scoreOne(sentence, heardText) {
    const { tokens, chips } = targetTokens(sentence);
    const heard = normalize(heardText);
    const { match, extras } = align(tokens, heard);
    const total = tokens.reduce((a, t) => a + t.weight, 0);
    const got = tokens.reduce((a, t, k) => a + (match[k] ? match[k].score * t.weight : 0), 0);
    const penalty = Math.min(10, extras * 3);
    const score = Math.max(0, Math.round((got / total) * 100 - penalty));
    const chipList = chips.map(c => {
      const ss = c.idx.map(k => (match[k] ? match[k].score : 0));
      let status = "miss";
      if (ss.every(x => x === 1)) status = "ok";
      else if (ss.some(x => x > 0)) status = "near";
      const core = c.idx.some(k => tokens[k].weight > W_SMALL);
      return { text: c.text, status, core };
    });
    return { score, chips: chipList, heard: heardText, extras };
  }

  // 후보(최대 5개) 중 최고 점수
  function scoreSpeech(sentence, alternatives) {
    const list = (Array.isArray(alternatives) ? alternatives : [alternatives]).filter(x => x && String(x).trim()).slice(0, 5);
    if (!list.length) return { score: 0, chips: targetTokens(sentence).chips.map(c => ({ text: c.text, status: "miss", core: true })), heard: "", extras: 0 };
    let best = null;
    for (const alt of list) {
      const r = scoreOne(sentence, alt);
      if (!best || r.score > best.score) best = r;
    }
    return best;
  }

  const Scorer = { normalize, soundKey, wordScore, scoreOne, scoreSpeech, targetTokens };
  root.Scorer = Scorer;
  if (typeof module !== "undefined" && module.exports) { module.exports = Scorer; }
  if (typeof document === "undefined") return;

  /* ---------------------------------------------------------
     2) 화면
     --------------------------------------------------------- */
  // data.js 의 전역 상수 (QUESTIONS, CATEGORIES, ACTIVITIES, DICT)
  const QS = QUESTIONS, CATS = CATEGORIES, ACTS = ACTIVITIES, WORDS = DICT;
  const actById = Object.fromEntries(ACTS.map(a => [a.id, a]));
  const catById = Object.fromEntries(CATS.map(c => [c.id, c]));
  const $ = (s, el = document) => el.querySelector(s);
  const LS_PLANS = "wayg9-plans", LS_REC = "wayg9-records";

  function load(key, def) { try { const v = JSON.parse(localStorage.getItem(key)); return v && typeof v === "object" ? v : def; } catch (e) { return def; } }
  function save(key, v) { try { localStorage.setItem(key, JSON.stringify(v)); } catch (e) { /* 저장 못 해도 동작 */ } }

  const state = {
    tab: "easy",
    qIndex: 0,
    plans: load(LS_PLANS, {}),          // { qid: {id, level} }
    records: load(LS_REC, {}),          // { key: {count, best, sum, last} }
    filter: { easy: "all", mid: "all" },
    audio: {},                          // { key: blobURL } 새로고침하면 사라짐
    results: {}                         // { key: 마지막 채점 결과 }
  };
  // 저장된 계획 중 없는 활동은 정리
  for (const q in state.plans) if (!actById[state.plans[q].id]) delete state.plans[q];

  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const qSentence = q => `What are you going to do ${q.en}?`;
  const actEn = (a, level) => (level === "mid" ? a.mid.en : a.en);
  const actKo = (a, level) => (level === "mid" ? a.mid.ko : a.ko);
  const aSentence = (a, level) => `I'm going to ${actEn(a, level)}.`;
  const recKey = (qid, p) => `${qid}|${p.id}|${p.level}`;

  /* ---------- 음성 (TTS) ---------- */
  let voice = null;
  function pickVoice() {
    if (!("speechSynthesis" in window)) return;
    const vs = speechSynthesis.getVoices();
    voice = vs.find(v => /en-US/i.test(v.lang) && /Google|Samantha|Microsoft (Aria|Jenny|Zira)/i.test(v.name))
         || vs.find(v => /en-US/i.test(v.lang)) || vs.find(v => /^en/i.test(v.lang)) || null;
  }
  if ("speechSynthesis" in window) { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }
  function speak(texts, rate = 0.85) {
    if (!("speechSynthesis" in window)) { setStatus("이 브라우저는 소리 읽기를 지원하지 않아요."); return; }
    speechSynthesis.cancel();
    (Array.isArray(texts) ? texts : [texts]).forEach(t => {
      const u = new SpeechSynthesisUtterance(t);
      u.lang = "en-US"; u.rate = rate; if (voice) u.voice = voice;
      speechSynthesis.speak(u);
    });
  }

  /* ---------- 단어 클릭 → 뜻 풍선 ---------- */
  function wordsHTML(sentence) {
    return sentence.split(/\s+/).map(tok => {
      const m = tok.match(/^([A-Za-z'’]+)(.*)$/);
      if (!m) return esc(tok);
      return `<span class="w" tabindex="0" role="button" data-w="${esc(m[1])}">${esc(m[1])}</span>${esc(m[2])}`;
    }).join(" ");
  }
  const bubble = document.createElement("div");
  bubble.className = "word-bubble"; bubble.hidden = true;
  document.addEventListener("DOMContentLoaded", () => document.body.appendChild(bubble));
  function showBubble(el) {
    const w = el.dataset.w;
    const key = w.toLowerCase().replace(/’/g, "'");
    const mean = WORDS[key] || WORDS[key.replace(/'s$/, "")] || "—";
    bubble.innerHTML = `<b class="en">${esc(w)}</b> <span>${esc(mean)}</span> <button type="button" class="mini" data-say="${esc(w)}" aria-label="발음 듣기">🔊</button>`;
    bubble.hidden = false;
    const r = el.getBoundingClientRect();
    const bw = Math.min(260, window.innerWidth - 24);
    bubble.style.maxWidth = bw + "px";
    let left = r.left + window.scrollX + r.width / 2 - bubble.offsetWidth / 2;
    left = Math.max(window.scrollX + 8, Math.min(left, window.scrollX + window.innerWidth - bubble.offsetWidth - 8));
    bubble.style.left = left + "px";
    bubble.style.top = (r.top + window.scrollY - bubble.offsetHeight - 10) + "px";
    speak(w, 0.8);
  }
  document.addEventListener("click", e => {
    const w = e.target.closest(".w");
    if (w) { showBubble(w); return; }
    const s = e.target.closest("[data-say]");
    if (s) { speak(s.dataset.say, 0.8); return; }
    if (!e.target.closest(".word-bubble")) bubble.hidden = true;
  });
  document.addEventListener("keydown", e => {
    if ((e.key === "Enter" || e.key === " ") && e.target.classList && e.target.classList.contains("w")) { e.preventDefault(); showBubble(e.target); }
    if (e.key === "Escape") bubble.hidden = true;
  });
  window.addEventListener("scroll", () => { bubble.hidden = true; }, { passive: true });

  /* ---------- 탭 ---------- */
  function setTab(tab) {
    state.tab = tab;
    document.querySelectorAll(".tab").forEach(b => {
      const on = b.dataset.tab === tab;
      b.classList.toggle("active", on); b.setAttribute("aria-selected", on ? "true" : "false");
    });
    document.querySelectorAll(".panel").forEach(p => { p.hidden = p.id !== "panel-" + tab; });
    bubble.hidden = true;
    render();
    window.scrollTo({ top: 0 });
  }

  function planCount() { return QS.filter(q => state.plans[q.id]).length; }
  function updateBadge() { $("#plan-badge").textContent = `${planCount()}/5`; }

  let statusMsg = "";
  function setStatus(msg) { statusMsg = msg; document.querySelectorAll(".status").forEach(s => { s.textContent = msg; }); }

  /* ---------- 활동 카드 탭 ---------- */
  function renderActivity(level) {
    const panel = $("#panel-" + level);
    const q = QS[state.qIndex];
    const plan = state.plans[q.id];
    const planAct = plan ? actById[plan.id] : null;

    // 1️⃣ 질문 버튼
    const qBtns = QS.map((qq, i) => {
      const p = state.plans[qq.id];
      const a = p ? actById[p.id] : null;
      return `<button type="button" class="q-btn ${i === state.qIndex ? "on" : ""} ${a ? "done" : ""}" data-q="${i}" aria-pressed="${i === state.qIndex}">
        <span class="q-num">Q${i + 1}</span><span class="q-emoji">${qq.emoji}</span>
        <span class="q-ko">${esc(qq.ko)}</span><span class="q-en en">${esc(qq.en)}</span>
        ${a ? `<span class="q-done">✓ ${a.emoji}</span>` : ""}
      </button>`;
    }).join("");

    // 말풍선 대화
    const ansEn = planAct ? aSentence(planAct, plan.level) : null;
    const ansHTML = planAct
      ? `I'm going to <b class="fill">${wordsHTML(actEn(planAct, plan.level) + ".")}</b>`
      : `I'm going to <span class="blank">____</span>.`;
    const ansKo = planAct ? `나는 ${q.ko}에 ${actKo(planAct, plan.level)} 거야.` : `나는 ${q.ko}에 ____ 거야.`;

    // 필터
    const f = state.filter[level];
    const filters = [["all", "전체"], ["book", "📘 교과서 표현"], ...CATS.map(c => ["cat:" + c.id, `${c.emoji} ${c.name}`]), ["rec", `⭐ ${q.ko}에 어울리는 것만`]]
      .map(([k, label]) => `<button type="button" class="chip ${f === k ? "on" : ""}" data-filter="${k}" aria-pressed="${f === k}">${label}</button>`).join("");

    const list = ACTS.filter(a => f === "all" || (f === "book" && a.book) || (f === "rec" && a.when.includes(q.id)) || f === "cat:" + a.cat);

    const cards = list.map(a => {
      const c = catById[a.cat];
      const chosen = plan && plan.id === a.id && plan.level === level;
      const elsewhere = QS.filter(qq => qq.id !== q.id && state.plans[qq.id] && state.plans[qq.id].id === a.id)
                          .map(qq => `<span class="tag other">${qq.emoji} ${esc(qq.ko)} 계획</span>`).join("");
      const sen = aSentence(a, level);
      return `<article class="card cat-${a.cat} ${chosen ? "chosen" : ""}" data-id="${a.id}">
        <div class="tags"><span class="tag cat">${c.emoji} ${esc(c.name)}</span>${a.book ? '<span class="tag book">📘 교과서</span>' : ""}${a.when.includes(q.id) ? '<span class="tag rec">⭐ 추천</span>' : ""}${elsewhere}</div>
        <div class="pic"><img src="images/${a.id}.png" alt="${esc(actKo(a, "easy"))} 그림" loading="lazy" data-emoji="${a.emoji}"></div>
        <p class="sen en">${wordsHTML(sen)}</p>
        <p class="ko">나는 ${esc(actKo(a, level))} 거야.</p>
        <div class="card-row"><button type="button" class="icon-btn" data-say="${esc(sen)}" aria-label="문장 듣기">🔊</button></div>
        <button type="button" class="pick ${chosen ? "on" : ""}" data-pick="${a.id}" aria-pressed="${chosen}">${chosen ? `✔️ ${esc(q.ko)} 계획으로 골랐어요` : `✅ ${esc(q.pick)}`}</button>
      </article>`;
    }).join("");

    panel.innerHTML = `
      <section class="box">
        <h2>1️⃣ 질문을 골라요 <small>${level === "mid" ? "중급 · 조금 긴 문장" : "초급 · 짧은 문장"}</small></h2>
        <div class="q-grid">${qBtns}</div>
        <div class="dialog">
          <div class="talk friend">
            <div class="who">🙋<small>친구</small></div>
            <div class="bub"><p class="en">${wordsHTML(qSentence(q))}</p><p class="ko">${esc(q.ko)}에 뭐 할 거야?</p></div>
            <button type="button" class="icon-btn" data-say="${esc(qSentence(q))}" aria-label="질문 듣기">🔊</button>
          </div>
          <div class="talk me">
            <button type="button" class="icon-btn" ${ansEn ? `data-say="${esc(ansEn)}"` : "disabled"} aria-label="대답 듣기">🔊</button>
            <div class="bub"><p class="en">${ansHTML}</p><p class="ko">${esc(ansKo)}</p></div>
            <div class="who">🙆<small>나</small></div>
          </div>
        </div>
        <div class="btn-row">
          <button type="button" class="btn" data-act="listen">🔊 대화 듣기</button>
          <button type="button" class="btn" data-act="next">다음 질문 ▶</button>
          <button type="button" class="btn main" data-act="go-practice">🎤 연습하기로 가기</button>
        </div>
        <p class="status" role="status" aria-live="polite">${esc(statusMsg || (planAct ? `✅ ${q.ko} 계획: ${planAct.emoji} ${actKo(planAct, plan.level)} 거야 — 연습하기에 담겨 있어요.` : `👇 아래 카드에서 ${q.ko}에 할 일을 골라 보세요.`))}</p>
      </section>
      <section class="box">
        <h2>2️⃣ 할 일 고르기 <small>${list.length}개</small></h2>
        <div class="filters">${filters}</div>
        <div class="cards">${cards}</div>
      </section>`;
    attachImgFallback(panel);
  }

  function attachImgFallback(scope) {
    scope.querySelectorAll("img[data-emoji]").forEach(img => {
      const fail = () => {
        const tile = document.createElement("div");
        tile.className = "emoji-tile"; tile.textContent = img.dataset.emoji; tile.setAttribute("role", "img");
        tile.setAttribute("aria-label", img.alt);
        img.replaceWith(tile);
      };
      if (img.complete && img.naturalWidth === 0 && img.src) fail();
      else img.addEventListener("error", fail, { once: true });
    });
  }

  function pickActivity(id, level) {
    const q = QS[state.qIndex];
    const cur = state.plans[q.id];
    const a = actById[id];
    if (cur && cur.id === id && cur.level === level) {
      delete state.plans[q.id];
      save(LS_PLANS, state.plans);
      setStatus(`↩️ ${q.ko} 계획에서 뺐어요. 다른 카드를 골라 보세요.`);
      render();
      return;
    }
    state.plans[q.id] = { id, level };
    save(LS_PLANS, state.plans);
    setStatus(`✅ ${q.ko} 계획: ${a.emoji} ${actKo(a, level)} 거야 — 연습하기에 담았어요! (${planCount()}/5)`);
    render();
    speak([qSentence(q), aSentence(a, level)]);
  }

  /* ---------- 연습하기 탭 ---------- */
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const canRec = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder);

  function stats() {
    let count = 0, sum = 0, done = 0;
    QS.forEach(q => {
      const p = state.plans[q.id]; if (!p) return;
      const r = state.records[recKey(q.id, p)];
      if (r && r.count) { count += r.count; sum += r.sum; done++; }
    });
    return { count, avg: count ? Math.round(sum / count) : 0, done };
  }

  function resultHTML(res) {
    if (!res) return "";
    if (res.note) return `<div class="result"><p class="note">${esc(res.note)}</p></div>`;
    const icon = res.score >= 85 ? "⭐" : res.score >= 60 ? "👍" : "🔁";
    const msg = res.score >= 85 ? "아주 잘했어요!" : res.score >= 60 ? "좋아요! 조금만 더!" : "다시 한 번 해 볼까요?";
    const chips = res.chips.map(c => `<span class="wchip ${c.status}" title="${c.status === "ok" ? "맞음" : c.status === "near" ? "비슷함" : "놓침"}">${c.status === "ok" ? "🟩" : c.status === "near" ? "🟨" : "🟥"} ${esc(c.text)}</span>`).join("");
    const again = [...new Set(res.chips.filter(c => c.status !== "ok" && c.core).map(c => c.text.replace(/[.?!,]/g, "")))];
    return `<div class="result">
      <p class="score-line"><span class="big">${icon} ${res.score}%</span> ${msg}</p>
      <div class="wchips">${chips}</div>
      ${again.length ? `<p class="again">🔁 다시 들어 볼 단어: ${again.map(w => `<button type="button" class="mini-btn" data-say="${esc(w)}">🔊 ${esc(w)}</button>`).join(" ")}</p>` : ""}
      <p class="heard">컴퓨터가 들은 말: <span class="en">${res.heard ? esc(res.heard) : "(아무것도 못 들었어요)"}</span></p>
    </div>`;
  }

  function renderPractice() {
    const panel = $("#panel-practice");
    const st = stats();
    const rows = QS.map((q, i) => {
      const p = state.plans[q.id];
      const a = p ? actById[p.id] : null;
      const key = a ? recKey(q.id, p) : "";
      const r = a ? state.records[key] : null;
      const live = a ? `<p class="live" id="live-${q.id}" hidden></p>` : "";
      const tools = a ? `
        <div class="speak-tools no-print">
          <button type="button" class="btn rec-btn" data-rec="${q.id}" ${SR || canRec ? "" : "disabled"}>🎙️ 말하기</button>
          <button type="button" class="btn" data-play="${q.id}" ${state.audio[key] ? "" : "disabled"}>▶ 내 목소리</button>
          <span class="rec-stats">${r && r.count ? `이번 ${r.last}% · 평균 ${Math.round(r.sum / r.count)}% · 최고 ${r.best}% · ${r.count}회` : "아직 연습 전이에요"}</span>
          ${SR ? "" : `<span class="warn">${canRec ? "음성 인식이 안 되는 브라우저예요 — 4초 녹음만 돼요 (Chrome 권장)" : "Chrome 권장 (이 브라우저는 마이크를 쓸 수 없어요)"}</span>`}
        </div>${live}${resultHTML(state.results[key])}` : "";
      return `<li class="plan-row ${a ? "filled cat-" + a.cat : "empty"}">
        <div class="when"><span class="q-num">Q${i + 1}</span> ${q.emoji} <b>${esc(q.ko)}</b><span class="en">${esc(q.en)}</span></div>
        <div class="plan-main">
          <div class="plan-text">
            <p class="en qline">Q. ${wordsHTML(qSentence(q))}</p>
            ${a ? `<p class="en aline">A. ${wordsHTML(aSentence(a, p.level))} <span class="lv">${p.level === "mid" ? "중급" : "초급"}</span></p>
                   <p class="ko">나는 ${esc(q.ko)}에 ${esc(actKo(a, p.level))} 거야.</p>`
                : `<p class="en aline">A. I'm going to <span class="blank">____</span>.</p><p class="ko hint">활동 카드에서 골라요</p>`}
          </div>
          ${a ? `<div class="thumb"><img src="images/${a.id}.png" alt="" data-emoji="${a.emoji}"></div>
                 <div class="row-btns no-print">
                   <button type="button" class="icon-btn" data-say-pair="${q.id}" aria-label="질문과 대답 듣기">🔊</button>
                   <button type="button" class="icon-btn x" data-remove="${q.id}" aria-label="계획에서 빼기">✕</button>
                 </div>` : ""}
        </div>
        ${tools}
      </li>`;
    }).join("");

    panel.innerHTML = `
      <section class="box summary no-print">
        <div class="sum-stats">
          <span>🎙️ 총 연습 <b>${st.count}</b>회</span>
          <span>📊 평균 정확도 <b>${st.avg}</b>%</span>
          <span>✅ 연습한 문장 <b>${st.done}</b>/5</span>
        </div>
        <div class="btn-row">
          <button type="button" class="btn" data-act="clear">🧹 기록 지우기</button>
          <button type="button" class="btn" data-act="listen-all">🔊 전체 듣기</button>
          <button type="button" class="btn" data-act="print">🖨️ 인쇄하기</button>
        </div>
        <p class="status" role="status" aria-live="polite">${esc(statusMsg)}</p>
      </section>
      <section class="box plan-box">
        <h2>📅 나의 계획표 · <span class="en">My Plans</span></h2>
        <ol class="plan-list">${rows}</ol>
      </section>`;
    attachImgFallback(panel);
  }

  /* ---------- 말하기 (음성 인식 + 녹음) ---------- */
  let busy = false;
  async function startSpeaking(qid) {
    if (busy) return;
    const p = state.plans[qid]; if (!p) return;
    const a = actById[p.id];
    const key = recKey(qid, p);
    const sentence = aSentence(a, p.level);
    const btn = document.querySelector(`[data-rec="${qid}"]`);
    const live = document.getElementById("live-" + qid);
    busy = true;
    if ("speechSynthesis" in window) speechSynthesis.cancel();
    btn.disabled = true; btn.textContent = "👂 듣고 있어요…"; btn.classList.add("recording");
    if (live) { live.hidden = false; live.textContent = "👂 들리는 말: …"; }

    // 녹음 준비
    let recorder = null, chunks = [], stream = null;
    if (canRec) {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        recorder = new MediaRecorder(stream);
        recorder.ondataavailable = e => { if (e.data && e.data.size) chunks.push(e.data); };
        recorder.start();
      } catch (e) { recorder = null; }
    }
    const stopRecorder = () => new Promise(res => {
      if (!recorder || recorder.state === "inactive") { if (stream) stream.getTracks().forEach(t => t.stop()); return res(); }
      recorder.onstop = () => {
        if (chunks.length) {
          if (state.audio[key]) URL.revokeObjectURL(state.audio[key]);
          state.audio[key] = URL.createObjectURL(new Blob(chunks, { type: recorder.mimeType || "audio/webm" }));
        }
        if (stream) stream.getTracks().forEach(t => t.stop());
        res();
      };
      recorder.stop();
    });

    const finish = async (alts, errorNote) => {
      await stopRecorder();
      busy = false;
      if (errorNote) {
        state.results[key] = { note: errorNote };
      } else if (alts) {
        const res = scoreSpeech(sentence, alts);
        state.results[key] = res;
        const r = state.records[key] || { count: 0, best: 0, sum: 0, last: 0 };
        r.count++; r.sum += res.score; r.best = Math.max(r.best, res.score); r.last = res.score;
        state.records[key] = r; save(LS_REC, state.records);
        setStatus(`🎙️ ${QS.find(q => q.id === qid).ko} 문장: ${res.score}%`);
      } else {
        state.results[key] = { note: "🎧 녹음했어요! ▶ 내 목소리로 들어 보세요. (이 브라우저는 채점이 안 돼요 — Chrome 권장)" };
      }
      renderPractice(); updateBadge();
    };

    if (!SR) {               // 음성 인식 없음 → 4초 녹음만
      if (!recorder) { busy = false; renderPractice(); setStatus("마이크를 쓸 수 없어요. Chrome에서 마이크 권한을 허용해 주세요."); return; }
      if (live) live.textContent = "🎙️ 4초 동안 녹음해요…";
      setTimeout(() => finish(null), 4000);
      return;
    }

    const rec = new SR();
    rec.lang = "en-US"; rec.interimResults = true; rec.maxAlternatives = 5; rec.continuous = false;
    let finals = null, interim = "", ended = false, errorNote = null;
    const timer = setTimeout(() => { try { rec.stop(); } catch (e) { } }, 9000);
    rec.onresult = e => {
      let text = "";
      for (let i = 0; i < e.results.length; i++) {
        const res = e.results[i];
        text += res[0].transcript + " ";
        if (res.isFinal) {
          const alts = [];
          for (let k = 0; k < res.length; k++) alts.push(res[k].transcript);
          finals = finals ? finals.map((f, k) => f + " " + (alts[k] || alts[0])) : alts;
        }
      }
      interim = text.trim();
      if (live) live.textContent = "👂 들리는 말: " + (interim || "…");
    };
    rec.onerror = e => {
      if (e.error === "not-allowed" || e.error === "service-not-allowed") errorNote = "🚫 마이크 권한이 필요해요. 주소창 옆 🔒 를 눌러 마이크를 허용해 주세요.";
      else if (e.error === "network") errorNote = "🌐 음성 인식은 인터넷 연결이 필요해요.";
    };
    rec.onend = () => {
      if (ended) return; ended = true; clearTimeout(timer);
      if (errorNote) return finish(null, errorNote);
      const alts = finals && finals.length ? finals : (interim ? [interim] : [""]);
      finish(alts);
    };
    try { rec.start(); } catch (e) { clearTimeout(timer); finish(null, "음성 인식을 시작하지 못했어요. 다시 눌러 보세요."); }
  }

  function playVoice(qid) {
    const p = state.plans[qid]; if (!p) return;
    const url = state.audio[recKey(qid, p)]; if (!url) return;
    if ("speechSynthesis" in window) speechSynthesis.cancel();
    const au = new Audio(url); au.play().catch(() => setStatus("소리를 재생하지 못했어요."));
  }

  /* ---------- 이벤트 ---------- */
  function render() {
    updateBadge();
    if (state.tab === "practice") renderPractice(); else renderActivity(state.tab);
  }

  document.addEventListener("click", e => {
    const t = e.target;
    const tab = t.closest(".tab"); if (tab) { statusMsg = ""; setTab(tab.dataset.tab); return; }
    const qb = t.closest("[data-q]"); if (qb) { state.qIndex = +qb.dataset.q; statusMsg = ""; render(); speak(qSentence(QS[state.qIndex])); return; }
    const fb = t.closest("[data-filter]"); if (fb) { state.filter[state.tab] = fb.dataset.filter; render(); return; }
    const pk = t.closest("[data-pick]"); if (pk) { pickActivity(pk.dataset.pick, state.tab); return; }
    const rm = t.closest("[data-remove]");
    if (rm) {
      const q = QS.find(x => x.id === rm.dataset.remove);
      delete state.plans[q.id]; save(LS_PLANS, state.plans);
      setStatus(`✕ ${q.ko} 계획을 뺐어요.`); render(); return;
    }
    const sp = t.closest("[data-say-pair]");
    if (sp) { const q = QS.find(x => x.id === sp.dataset.sayPair); const p = state.plans[q.id]; speak([qSentence(q), aSentence(actById[p.id], p.level)]); return; }
    const rb = t.closest("[data-rec]"); if (rb) { startSpeaking(rb.dataset.rec); return; }
    const pb = t.closest("[data-play]"); if (pb) { playVoice(pb.dataset.play); return; }
    const act = t.closest("[data-act]"); if (!act) return;
    const q = QS[state.qIndex];
    switch (act.dataset.act) {
      case "listen": {
        const p = state.plans[q.id];
        speak(p ? [qSentence(q), aSentence(actById[p.id], p.level)] : [qSentence(q)]);
        if (!p) setStatus("🔊 질문을 들었어요. 대답은 아래 카드에서 골라 보세요.");
        break;
      }
      case "next": state.qIndex = (state.qIndex + 1) % QS.length; statusMsg = ""; render(); speak(qSentence(QS[state.qIndex])); break;
      case "go-practice": statusMsg = ""; setTab("practice"); break;
      case "clear":
        if (!confirm("연습 기록(횟수·점수)을 모두 지울까요? 계획표는 그대로 남아요.")) break;
        state.records = {}; state.results = {}; save(LS_REC, state.records);
        setStatus("🧹 연습 기록을 지웠어요."); render(); break;
      case "listen-all": {
        const texts = [];
        QS.forEach(qq => { const p = state.plans[qq.id]; if (p) texts.push(qSentence(qq), aSentence(actById[p.id], p.level)); });
        if (texts.length) speak(texts); else setStatus("아직 고른 계획이 없어요. 활동 카드에서 골라 보세요.");
        break;
      }
      case "print": window.print(); break;
    }
  });

  document.addEventListener("DOMContentLoaded", () => {
    // 떨어지는 단풍잎
    const leaves = $("#leaves");
    if (leaves) {
      const kinds = ["🍁", "🍂", "🍁", "🍂", "🍁"];
      for (let i = 0; i < 14; i++) {
        const s = document.createElement("span");
        s.textContent = kinds[i % kinds.length];
        s.style.left = (i * 7.3 + Math.random() * 4) % 100 + "%";
        s.style.animationDelay = (-Math.random() * 12).toFixed(1) + "s";
        s.style.animationDuration = (8 + Math.random() * 6).toFixed(1) + "s";
        s.style.fontSize = (14 + Math.random() * 14).toFixed(0) + "px";
        leaves.appendChild(s);
      }
    }
    setTab("easy");
  });
  // 어느 탭에서 인쇄해도 계획표가 나오도록
  window.addEventListener("beforeprint", () => { renderPractice(); });
  window.addEventListener("afterprint", () => { if (state.tab !== "practice") render(); });
})(typeof window !== "undefined" ? window : globalThis);
