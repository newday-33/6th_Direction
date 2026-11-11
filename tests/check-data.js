// 데이터 점검: node tests/check-data.js
const fs = require("fs");
const path = require("path");
const { QUESTIONS, CATEGORIES, ACTIVITIES, DICT } = require("../data.js");
let errors = 0;
const fail = (m) => { errors++; console.log("❌ " + m); };

// 1) 개수·종류
if (ACTIVITIES.length !== 60) fail("활동 개수 " + ACTIVITIES.length);
const ids = new Set();
for (const a of ACTIVITIES) {
  if (ids.has(a.id)) fail("중복 id " + a.id);
  ids.add(a.id);
  if (!CATEGORIES.find(c => c.id === a.cat)) fail("종류 없음 " + a.id);
  for (const w of a.when) if (!QUESTIONS.find(q => q.id === w)) fail("질문 없음 " + a.id + " " + w);
  if (!a.mid || !a.mid.en || !a.mid.ko) fail("중급 문장 없음 " + a.id);
}
for (const c of CATEGORIES) {
  const list = ACTIVITIES.filter(a => a.cat === c.id);
  if (list.length !== 12) fail(c.name + " 개수 " + list.length);
  // 교과서 표현은 같은 종류 안에서 맨 앞
  let seenNonBook = false;
  for (const a of list) { if (!a.book) seenNonBook = true; else if (seenNonBook) fail("📘 순서 " + a.id); }
}
const BOOK = ["stay home", "watch a baseball game", "go camping", "clean my room", "study math", "visit my grandparents"];
for (const b of BOOK) {
  const a = ACTIVITIES.find(x => x.en === b);
  if (!a) fail("교과서 표현 없음: " + b); else if (!a.book) fail("📘 표시 없음: " + b);
}

// 2) 단어 사전 누락
const sentences = [];
for (const q of QUESTIONS) sentences.push("What are you going to do " + q.en + "?");
for (const a of ACTIVITIES) { sentences.push("I'm going to " + a.en + "."); sentences.push("I'm going to " + a.mid.en + "."); }
const missing = new Set();
for (const s of sentences) {
  for (const raw of s.split(/\s+/)) {
    const w = raw.toLowerCase().replace(/[^a-z']/g, "");
    if (w && !(w in DICT)) missing.add(w);
  }
}
if (missing.size) fail("사전 누락 " + missing.size + "개: " + [...missing].join(", "));
else console.log("✅ 단어 사전 누락 0 (문장 " + sentences.length + "개)");

// 3) 그림 파일
const noImg = ACTIVITIES.filter(a => !fs.existsSync(path.join(__dirname, "..", "images", a.id + ".png")));
if (noImg.length) fail("그림 누락 " + noImg.length + "개: " + noImg.map(a => a.id).join(", "));
else console.log("✅ 그림 누락 0 (images/<id>.png 60개)");

console.log(errors ? `\n${errors}개 문제` : "✅ 데이터 점검 통과");
process.exit(errors ? 1 : 0);
