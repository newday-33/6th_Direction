// 채점 함수 단위 테스트: node tests/scorer.test.js
const S = require("../app.js");
let fails = 0;
function near(name, got, want, tol) {
  const ok = Math.abs(got - want) <= tol;
  if (!ok) fails++;
  console.log(`${ok ? "✅" : "❌"} ${name}: ${got} (기대 약 ${want}±${tol})`);
}
function eq(name, got, want) {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  if (!ok) fails++;
  console.log(`${ok ? "✅" : "❌"} ${name}: ${JSON.stringify(got)}`);
}
const T = "I'm going to fly a kite.";
near("정확", S.scoreSpeech(T, ["I'm going to fly a kite"]).score, 100, 0);
near("fly a cat", S.scoreSpeech(T, ["I'm going to fly a cat"]).score, 73, 2);
near("fly a kite 만", S.scoreSpeech(T, ["fly a kite"]).score, 55, 2);
near("순서 뒤섞임", S.scoreSpeech(T, ["kite a fly to going I'm"]).score, 14, 2);
near("I am 펼쳐 말해도 100", S.scoreSpeech(T, ["I am going to fly a kite"]).score, 100, 0);
near("two → to", S.scoreSpeech(T, ["I'm going two fly a kite"]).score, 100, 0);
near("후보 5개 중 최고", S.scoreSpeech(T, ["I'm going to fry a cat", "I'm going to fly a kite"]).score, 100, 0);
near("철자 1글자(fry)", S.scoreSpeech(T, ["I'm going to fry a kite"]).score, 96, 1);
eq("r/l 1글자 차이 (grass/glass)", S.wordScore("grass", "glass"), 0.85);
eq("소리 비슷 r/l 2곳", S.wordScore("really", "lealry"), 0.7);
eq("비슷한 편", S.wordScore("potatoes", "potato"), 0.5);
near("빈 말", S.scoreSpeech(T, [""]).score, 0, 0);
near("덧붙인 말 최대 10% 감점", S.scoreSpeech(T, ["um yes so I'm going to fly a kite okay yeah well"]).score, 90, 0);
eq("p c → pc", S.normalize("I'm going to go to a p c room"), ["i","am","going","to","go","to","a","pc","room"]);
near("PC room (p c 로 들림)", S.scoreSpeech("I'm going to go to a PC room.", ["I'm going to go to a p c room"]).score, 100, 0);
near("café 악센트", S.scoreSpeech("I'm going to go to a cat cafe.", ["I'm going to go to a cat café"]).score, 100, 0);
eq("kite ≠ cat", S.wordScore("kite", "cat"), 0);
eq("철자 1글자 차이", S.wordScore("kite", "kites"), 0.85);
eq("소리 비슷 v/b", S.wordScore("visit", "bisit"), 0.85);
eq("소리 비슷 th/s", S.wordScore("math", "mass"), 0.7);
eq("소리 비슷 f/p", S.wordScore("fly", "ply"), 0.85);
eq("소리 비슷 (2글자 이상 차이)", S.wordScore("leaves", "reabes"), 0.7);
// 지명 가중치 0.6
const tk = S.targetTokens("I'm going to go to Jeju Island.").tokens;
eq("지명 가중치", tk.filter(t => t.w === "jeju" || t.w === "island").map(t => t.weight), [0.6, 0.6]);
eq("going 핵심 단어", tk.find(t => t.w === "going").weight, 1);
// 칩: I'm 한 칩
const r = S.scoreSpeech(T, ["I'm going to fly a cat"]);
eq("칩", r.chips.map(c => c.text + ":" + c.status), ["I'm:ok","going:ok","to:ok","fly:ok","a:ok","kite:miss"]);
console.log(fails ? `\n❌ ${fails}개 실패` : "\n✅ 채점 테스트 모두 통과");
process.exit(fails ? 1 : 0);
