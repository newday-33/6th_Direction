// 브라우저 테스트: node tests/e2e.js  (Playwright + Chromium, 가짜 마이크·가짜 음성 인식)
const { chromium } = require("playwright");
const http = require("http");
const fs = require("fs");
const path = require("path");
const ROOT = path.join(__dirname, "..");
const OUT = process.env.SHOT_DIR || path.join(ROOT, "tests", "screenshots");
fs.mkdirSync(OUT, { recursive: true });

const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".png": "image/png" };
const server = http.createServer((req, res) => {
  const p = path.join(ROOT, decodeURIComponent(req.url.split("?")[0]) === "/" ? "index.html" : decodeURIComponent(req.url.split("?")[0]));
  fs.readFile(p, (err, data) => {
    if (err) { res.writeHead(404); return res.end("nf"); }
    res.writeHead(200, { "Content-Type": TYPES[path.extname(p)] || "application/octet-stream" }); res.end(data);
  });
});

const FAKE = `
  window.__fakeAlts = ["I'm going to fly a kite"];
  class FakeSR {
    constructor() { this.lang = ""; this.interimResults = false; this.maxAlternatives = 1; }
    start() {
      window.__srConfig = { lang: this.lang, interim: this.interimResults, max: this.maxAlternatives };
      const alts = window.__fakeAlts;
      const mk = (list, fin) => { const r = list.map(t => ({ transcript: t, confidence: 0.9 })); r.isFinal = fin; return r; };
      setTimeout(() => this.onresult && this.onresult({ results: [mk([alts[0].split(" ").slice(0, 3).join(" ")], false)] }), 300);
      setTimeout(() => this.onresult && this.onresult({ results: [mk(alts, true)] }), 900);
      setTimeout(() => this.onend && this.onend(), 1100);
    }
    stop() {} abort() {}
  }
  window.SpeechRecognition = FakeSR; window.webkitSpeechRecognition = FakeSR;
  window.__played = 0; const op = HTMLMediaElement.prototype.play;
  HTMLMediaElement.prototype.play = function () { window.__played++; return Promise.resolve(); };
  window.print = () => { window.__printed = (window.__printed || 0) + 1; };
`;

let fails = 0;
const check = (name, cond, extra = "") => { console.log(`${cond ? "✅" : "❌"} ${name}${extra ? " — " + extra : ""}`); if (!cond) fails++; };

(async () => {
  await new Promise(r => server.listen(0, r));
  const url = `http://localhost:${server.address().port}/`;
  const browser = await chromium.launch({ args: ["--use-fake-device-for-media-stream", "--use-fake-ui-for-media-stream"] });
  // 테스트 환경은 외부 글꼴 CDN이 막혀 있으므로 빈 CSS로 대신함 (실제 수업에서는 정상 로드, 실패해도 기본 글꼴로 표시)
  const stubFonts = c => c.route(/fonts\.googleapis|fonts\.gstatic|pstatic\.net/, r => r.fulfill({ status: 200, contentType: "text/css", body: "" }));
  const ctx = await browser.newContext({ viewport: { width: 1200, height: 900 }, permissions: ["microphone"] });
  await ctx.addInitScript(FAKE); await stubFonts(ctx);
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", m => { if (m.type() === "error") errors.push(m.text()); });
  page.on("pageerror", e => errors.push(String(e)));
  page.on("dialog", d => d.accept());
  await page.goto(url, { waitUntil: "networkidle" });

  // 그림 로드
  const broken = await page.$$eval("#panel-easy .pic img", imgs => imgs.filter(i => !i.complete || i.naturalWidth === 0).length);
  const nCards = await page.$$eval("#panel-easy .card", c => c.length);
  check("초급 카드 60장", nCards === 60, String(nCards));
  await page.waitForTimeout(500);
  const broken2 = await page.$$eval("#panel-easy img", imgs => imgs.filter(i => i.complete && i.naturalWidth === 0).length);
  check("그림 깨짐 0", broken2 === 0, String(broken2));
  await page.screenshot({ path: path.join(OUT, "desktop-easy.png"), fullPage: false });

  // 탭 전환
  await page.click('.tab[data-tab="mid"]');
  check("중급 탭 표시", await page.isVisible("#panel-mid") && !(await page.isVisible("#panel-easy")));
  const midSen = await page.textContent('#panel-mid .card[data-id="fly_kite"] .sen');
  check("중급 문장", midSen.includes("on the hill"), midSen.trim());
  await page.click('.tab[data-tab="practice"]');
  check("연습하기 탭 표시", await page.isVisible("#panel-practice"));
  check("빈 계획표 안내", (await page.textContent("#panel-practice")).includes("활동 카드에서 골라요"));
  await page.click('.tab[data-tab="easy"]');

  // 카드 선택 → 말풍선 · 배지
  await page.click('#panel-easy .card[data-id="fly_kite"] .pick');
  const me = await page.textContent("#panel-easy .talk.me .bub .en");
  check("말풍선 빈칸 채움", me.replace(/\s+/g, " ").includes("I'm going to fly a kite."), me.trim());
  check("배지 1/5", (await page.textContent("#plan-badge")) === "1/5");
  check("버튼 상태 바뀜", (await page.textContent('#panel-easy .card[data-id="fly_kite"] .pick')).includes("골랐어요"));
  check("Q1 버튼에 ✓", (await page.textContent('#panel-easy .q-btn[data-q="0"]')).includes("✓"));
  // 같은 질문에 다른 카드 → 바뀜
  await page.click('#panel-easy .card[data-id="ride_bike"] .pick');
  check("질문당 계획 1개 (바뀜)", (await page.textContent("#panel-easy .talk.me .bub .en")).includes("ride my bike") && (await page.textContent("#plan-badge")) === "1/5");
  await page.click('#panel-easy .card[data-id="ride_bike"] .pick');
  check("다시 누르면 빠짐", (await page.textContent("#plan-badge")) === "0/5");
  await page.click('#panel-easy .card[data-id="fly_kite"] .pick');

  // 단어 뜻 풍선
  await page.click('#panel-easy .card[data-id="fly_kite"] .sen .w[data-w="kite"]');
  check("단어 뜻 풍선", (await page.textContent(".word-bubble")).includes("연"));
  await page.mouse.click(5, 300);

  // 다음 질문
  await page.click('#panel-easy [data-act="next"]');
  check("다음 질문 ▶", (await page.textContent("#panel-easy .talk.friend .bub .en")).includes("tonight"));

  // 필터
  await page.click('#panel-easy [data-filter="book"]');
  check("📘 필터 6장", (await page.$$("#panel-easy .card")).length === 6);
  await page.click('#panel-easy [data-filter="cat:place"]');
  check("종류 필터 12장", (await page.$$("#panel-easy .card")).length === 12);
  await page.click('#panel-easy [data-filter="rec"]');
  const recN = (await page.$$("#panel-easy .card")).length;
  const recOk = await page.$$eval("#panel-easy .card", cs => cs.every(c => c.querySelector(".tag.rec")));
  check("⭐ 추천 필터", recN > 0 && recN < 60 && recOk, recN + "장");
  await page.click('#panel-easy [data-filter="all"]');

  // 중급 탭에서 Q2(오늘 밤)에 고르기 → 공유
  await page.click('.tab[data-tab="mid"]');
  check("중급 탭도 같은 질문(Q2)", (await page.getAttribute('#panel-mid .q-btn[data-q="1"]', "aria-pressed")) === "true");
  await page.click('#panel-mid .card[data-id="go_camping"] .pick');
  check("중급 계획 저장", (await page.textContent("#plan-badge")) === "2/5");
  check("중급 말풍선", (await page.textContent("#panel-mid .talk.me .bub .en")).includes("go camping with my family in the forest"));
  await page.click('#panel-mid .q-btn[data-q="0"]');
  check("초급 계획이 중급 탭에도 보임", (await page.textContent("#panel-mid .talk.me .bub .en")).includes("fly a kite"));
  await page.click('.tab[data-tab="easy"]');
  check("초급 탭 Q2 ✓", (await page.textContent('#panel-easy .q-btn[data-q="1"]')).includes("✓"));

  // 연습하기 반영
  await page.click('#panel-easy [data-act="go-practice"]');
  check("연습하기로 가기", await page.isVisible("#panel-practice"));
  check("계획 2줄", (await page.$$("#panel-practice .plan-row.filled")).length === 2);
  check("중급 문장 표시", (await page.textContent("#panel-practice")).includes("go camping with my family in the forest"));
  await page.screenshot({ path: path.join(OUT, "desktop-practice.png"), fullPage: true });

  // ✕ 빼기
  await page.click('#panel-practice [data-remove="ton"]');
  check("✕ 빼기", (await page.$$("#panel-practice .plan-row.filled")).length === 1 && (await page.textContent("#plan-badge")) === "1/5");

  // 말하기 1: fly a cat → 약 73
  await page.evaluate(() => { window.__fakeAlts = ["I'm going to fly a cat", "I'm going to fly a cut"]; });
  await page.click('[data-rec="aft"]');
  await page.waitForSelector('#live-aft:not([hidden])');
  await page.waitForFunction(() => document.querySelector("#live-aft") && /들리는 말: I'm going to/.test(document.querySelector("#live-aft").textContent), null, { timeout: 3000 }).then(() => check("👂 들리는 말 실시간 표시", true)).catch(() => check("👂 들리는 말 실시간 표시", false));
  await page.waitForSelector("#panel-practice .result .big", { timeout: 8000 });
  const cfg = await page.evaluate(() => window.__srConfig);
  check("음성 인식 설정 (en-US · interim · 5)", cfg.lang === "en-US" && cfg.interim === true && cfg.max === 5, JSON.stringify(cfg));
  const s1 = await page.textContent("#panel-practice .result .big");
  check("점수 약 73%", /7[1-5]%/.test(s1), s1);
  check("🟥 kite 칩", (await page.textContent("#panel-practice .wchip.miss")).includes("kite"));
  check("다시 들어 볼 단어 kite", (await page.textContent("#panel-practice .again")).includes("kite"));
  check("컴퓨터가 들은 말", (await page.textContent("#panel-practice .heard")).includes("fly a cat"));
  check("I'm 한 칩", (await page.$$eval("#panel-practice .wchip", cs => cs[0].textContent)).includes("I'm"));

  // 녹음 재생
  const playDisabled = await page.isDisabled('[data-play="aft"]');
  check("▶ 내 목소리 활성 (녹음됨)", !playDisabled);
  if (!playDisabled) { await page.click('[data-play="aft"]'); check("녹음 재생", (await page.evaluate(() => window.__played)) >= 1); }

  // 말하기 2: 정확 → 100, 평균 87
  await page.evaluate(() => { window.__fakeAlts = ["I'm going to fly a kite"]; });
  await page.click('[data-rec="aft"]');
  await page.waitForFunction(() => /이번 100%/.test(document.querySelector(".rec-stats")?.textContent || ""), null, { timeout: 8000 });
  const rs = await page.textContent(".rec-stats");
  check("이번·평균·최고·횟수", /이번 100% · 평균 87% · 최고 100% · 2회/.test(rs), rs);
  const sum = await page.textContent(".sum-stats");
  check("요약: 총 2회 · 평균 87% · 1/5", /총 연습 2회/.test(sum.replace(/\s+/g, " ")) && /평균 정확도 87%/.test(sum.replace(/\s+/g, " ")) && /1\/5/.test(sum), sum.replace(/\s+/g, " "));
  check("⭐ 85%↑ 표시", (await page.textContent("#panel-practice .result .big")).includes("⭐"));
  await page.screenshot({ path: path.join(OUT, "desktop-practice-scored.png"), fullPage: true });

  // 새로고침 후 유지 (기록 O, 녹음 X)
  await page.reload({ waitUntil: "networkidle" });
  check("새로고침 후 계획 유지", (await page.textContent("#plan-badge")) === "1/5");
  await page.click('.tab[data-tab="practice"]');
  check("새로고침 후 기록 유지", (await page.textContent(".rec-stats")).includes("2회"));
  check("새로고침 후 녹음은 사라짐", await page.isDisabled('[data-play="aft"]'));

  // 인쇄 + 인쇄용 화면
  await page.click('[data-act="print"]');
  check("인쇄 버튼", (await page.evaluate(() => window.__printed)) === 1);
  await page.emulateMedia({ media: "print" });
  check("인쇄: 버튼·마이크 숨김", !(await page.isVisible('[data-rec="aft"]')) && !(await page.isVisible(".tabs")) && !(await page.isVisible(".summary")));
  check("인쇄: 계획표 보임", await page.isVisible(".plan-box"));
  await page.screenshot({ path: path.join(OUT, "print.png"), fullPage: true });
  await page.emulateMedia({ media: "screen" });

  // 기록 지우기
  await page.click('[data-act="clear"]');
  check("기록 지우기", (await page.textContent(".sum-stats")).replace(/\s+/g, " ").includes("총 연습 0회") && (await page.textContent(".rec-stats")).includes("연습 전"));

  // 휴대폰 390px
  const m = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await m.addInitScript(FAKE); await stubFonts(m);
  const mp = await m.newPage();
  mp.on("pageerror", e => errors.push(String(e)));
  mp.on("console", msg => { if (msg.type() === "error") errors.push(msg.text()); });
  await mp.goto(url, { waitUntil: "networkidle" });
  const ov1 = await mp.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  check("휴대폰 초급 가로 스크롤 없음", ov1 <= 0, "overflow " + ov1);
  const tabText = await mp.$$eval(".tab", ts => ts.map(t => t.innerText.trim()));
  const tabH = await mp.$$eval(".tab", ts => ts.map(t => t.getBoundingClientRect().height));
  check("휴대폰 짧은 탭 이름 · 한 줄", tabText[0] === "초급 카드" && tabText[1] === "중급 카드" && tabH.every(h => h < 46), JSON.stringify(tabText) + " " + JSON.stringify(tabH));
  await mp.click('#panel-easy .card[data-id="pc_room"] .pick');
  await mp.screenshot({ path: path.join(OUT, "mobile-easy.png") });
  await mp.click('.tab[data-tab="mid"]');
  const ov2 = await mp.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  check("휴대폰 중급 가로 스크롤 없음", ov2 <= 0, "overflow " + ov2);
  await mp.screenshot({ path: path.join(OUT, "mobile-mid.png") });
  await mp.click('.tab[data-tab="practice"]');
  await mp.evaluate(() => { window.__fakeAlts = ["I'm going to go to a p c room"]; });
  await mp.click('[data-rec="aft"]');
  await mp.waitForSelector("#panel-practice .result .big", { timeout: 8000 });
  check("휴대폰 말하기 (p c → PC) 100%", (await mp.textContent("#panel-practice .result .big")).includes("100%"));
  const ov3 = await mp.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  check("휴대폰 연습하기 가로 스크롤 없음", ov3 <= 0, "overflow " + ov3);
  await mp.screenshot({ path: path.join(OUT, "mobile-practice.png"), fullPage: true });

  // 음성 인식·녹음 없는 브라우저
  const n = await browser.newContext({ viewport: { width: 800, height: 800 } }); await stubFonts(n);
  await n.addInitScript(`delete window.SpeechRecognition; delete window.webkitSpeechRecognition; window.webkitSpeechRecognition = undefined; window.MediaRecorder = undefined;
    localStorage.setItem("wayg9-plans", JSON.stringify({aft:{id:"fly_kite",level:"easy"}}));`);
  const np = await n.newPage();
  await np.goto(url, { waitUntil: "networkidle" });
  await np.click('.tab[data-tab="practice"]');
  check("둘 다 없으면 버튼 비활성 + Chrome 권장", (await np.isDisabled('[data-rec="aft"]')) && (await np.textContent(".speak-tools")).includes("Chrome 권장"));

  check("콘솔 오류 0", errors.length === 0, errors.join(" | "));
  await browser.close(); server.close();
  console.log(fails ? `\n❌ ${fails}개 실패` : "\n✅ 브라우저 테스트 모두 통과");
  process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
