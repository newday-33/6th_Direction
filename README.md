# 🍁 What are you going to do? — 6학년 9단원 말하기 앱

천재(함) 6학년 9단원 **What are you going to do?** 수업용 정적 웹 앱입니다.
설치 없이 `index.html`을 열거나 GitHub Pages로 올리면 바로 동작합니다. (말하기 채점은 Chrome 권장)

- 질문: **What are you going to do ___?** (this afternoon / tonight / tomorrow / this weekend / this winter vacation)
- 대답: **I'm going to ___.**
- 계절 테마: 가을 (주황·단풍 빨강·은행잎 노랑, 헤더에 떨어지는 단풍잎)

## 기능

| 탭 | 내용 |
|---|---|
| 🎨 활동 카드 (초급) | 1️⃣ 질문 Q1~Q5 고르기 → 친구·나 말풍선 대화(🔊, 한국어 뜻) → 2️⃣ 할 일 카드 60장에서 고르기 |
| 🎨 활동 카드 (중급) | 같은 구성, 누구와·어디서·무엇을 보러가 붙은 긴 문장 (예: *I'm going to fly a kite on the hill.*) |
| 🎤 연습하기 (배지 n/5) | 나의 계획표 5줄 + 줄마다 🎙️ 말하기 · ▶ 내 목소리 · 점수 기록 |

- **카드**: 종류 태그, 📘 교과서, ⭐ 추천(지금 질문에 어울림), 그림, 문장(단어를 누르면 뜻 풍선 + 발음), 한국어, 🔊,
  `✅ 오늘 오후에 할래요` 버튼 → 지금 질문의 대답이 되고 말풍선 빈칸이 채워지며 질문+대답을 읽어 주고 연습하기에 담깁니다.
  다시 누르면 빠지고, 다른 카드를 누르면 바뀝니다(질문당 1개). 초급·중급 어디서 골라도 같은 계획표(`{활동id, level}`)에 저장됩니다.
- **필터**: 전체 · 📘 교과서 표현 · 종류 5개 · ⭐ (지금 질문)에 어울리는 것만
- **연습하기**: 요약(🎙️ 총 연습 · 📊 평균 정확도 · ✅ 연습한 문장 n/5), 🧹 기록 지우기, 🔊 전체 듣기, 🖨️ 인쇄하기(계획표만 인쇄)
- **말하기**: Web Speech API 음성 인식(en-US, interimResults, maxAlternatives 5, 9초 제한) + MediaRecorder 녹음을 동시에.
  말하는 동안 “👂 들리는 말” 실시간 표시, 끝나면 ▶ 내 목소리로 녹음 재생.
  - 음성 인식이 없는 브라우저: 4초 녹음만 / 둘 다 없으면 버튼 비활성 + “Chrome 권장”
  - 계획·연습 기록(횟수·최고·점수 합계→평균)은 `localStorage`에 저장, 녹음은 새로고침하면 사라집니다.
- 휴대폰(390px)에서는 탭 이름이 “초급 카드 / 중급 카드 / 연습하기”로 짧아지고, 가로 스크롤이 생기지 않습니다.

## 발음 채점 방식 (`app.js` 의 `Scorer`)

1. **정리**: 소문자·악센트 제거, 줄임말 펼치기(I'm→i am, I'll→i will, gonna→going to …),
   동음어 통일(too/two→to, four→for, sea→see …), 한 글자씩 들린 말 붙이기(“p c”→pc).
2. **정렬**: 목표 문장과 들린 말을 단어 **순서대로** 동적 계획법(DP)으로 정렬 → 순서가 뒤섞이면 점수가 크게 떨어집니다.
3. **단어 점수**: 같음 1 · 철자 1글자 차이 0.85 · 소리 비슷 0.7(자음만 통일: r/l, f/p, v/b, th/s, c/k/g, d/t, z/s … 모음은 유지해서 kite≠cat)
   · 비슷한 편 0.5(모음 뼈대 같음, 앞부분 같음) · 그 외 0
4. **가중치**: 핵심 단어 1(going 포함) · 작은 단어(a, the, to, my, i, am, at, in, with …) 0.3 · 지명(문장 중간의 대문자 고유명사) 0.6
5. **감점**: 덧붙인 말 개당 3%, 최대 10%. 보너스 없음.
6. 음성 인식 후보 최대 5개 중 **최고 점수**를 사용합니다.

결과: ⭐ 85% 이상 / 👍 60% 이상 / 🔁 그 아래, 단어 칩(🟩 맞음 · 🟨 비슷함 · 🟥 놓침, I'm은 한 칩),
“🔁 다시 들어 볼 단어: 🔊 kite” 버튼, “컴퓨터가 들은 말: …”.

| “I'm going to fly a kite.” 에 대해 들린 말 | 점수 |
|---|---|
| I'm going to fly a kite | 100 |
| I'm going to fly a cat | 73 |
| fly a kite | 55 |
| kite a fly to going I'm (순서 뒤섞임) | 14 |

## 활동 목록 (5종류 × 12개 = 60개, 📘 = 교과서 표현)

**🏠 집·학교에서**

| 초급 | 중급 | 뜻 |
|---|---|---|
| 📘 🏠 stay home | stay home with my little brother | 집에 있을 거야 |
| 📘 🧹 clean my room | clean my room with my sister | 내 방을 청소할 거야 |
| 📘 ➗ study math | study math with my friend at the library | 수학 공부를 할 거야 |
| 📝 do my homework | do my homework at my desk | 숙제를 할 거야 |
| 📖 read a book | read a funny book in my room | 책을 읽을 거야 |
| 🎹 practice the piano | practice the piano for the school concert | 피아노 연습을 할 거야 |
| 🎨 draw autumn leaves | draw autumn leaves with my crayons | 단풍잎을 그릴 거야 |
| 📔 write in my diary | write in my diary before bed | 일기를 쓸 거야 |
| 🎮 play video games | play video games with my cousin | 비디오 게임을 할 거야 |
| 🍪 bake cookies | bake pumpkin cookies with my mom | 쿠키를 구울 거야 |
| 🎬 watch a movie | watch a movie with my family at home | 영화를 볼 거야 |
| 🎪 go to the school festival | go to the school festival to see a magic show | 학교 축제에 갈 거야 |

**⚽ 운동·놀이**

| 초급 | 중급 | 뜻 |
|---|---|---|
| 📘 ⚾ watch a baseball game | watch a baseball game with my dad at the stadium | 야구 경기를 볼 거야 |
| 🪁 fly a kite | fly a kite on the hill | 연을 날릴 거야 |
| 🚲 ride my bike | ride my bike in the park | 자전거를 탈 거야 |
| ⚽ play soccer | play soccer with my friends after school | 축구를 할 거야 |
| 🏸 play badminton | play badminton with my sister in the park | 배드민턴을 칠 거야 |
| 🏀 play basketball | play basketball at the school gym | 농구를 할 거야 |
| 🪢 jump rope | jump rope with my friends in the schoolyard | 줄넘기를 할 거야 |
| 🛼 go inline skating | go inline skating by the river | 인라인스케이트를 탈 거야 |
| 🤾 play dodgeball | play dodgeball with my classmates | 피구를 할 거야 |
| 🥋 go to taekwondo class | go to taekwondo class to learn a new kick | 태권도 학원에 갈 거야 |
| 🏅 practice for sports day | practice for sports day with my team | 운동회 연습을 할 거야 |
| 🏃 play tag | play tag with my friends at the playground | 술래잡기를 할 거야 |

**📍 장소에 가기**

| 초급 | 중급 | 뜻 |
|---|---|---|
| 🖥️ go to a PC room | go to a PC room with my friends to play games | PC방에 갈 거야 |
| 📚 go to a comic book cafe | go to a comic book cafe to read comic books | 만화 카페에 갈 거야 |
| 🎤 go to a coin karaoke room | go to a coin karaoke room to sing with my friends | 코인노래방에 갈 거야 |
| 🏛️ go to the library | go to the library to borrow some books | 도서관에 갈 거야 |
| 📕 go to the bookstore | go to the bookstore to buy a new comic book | 서점에 갈 거야 |
| 🛍️ go to the shopping mall | go to the shopping mall to buy a warm jacket | 쇼핑몰에 갈 거야 |
| 🥐 go to the bakery | go to the bakery to buy some bread | 빵집에 갈 거야 |
| 🔐 go to an escape room | go to an escape room with my cousins | 방탈출 카페에 갈 거야 |
| 🤸 go to a trampoline park | go to a trampoline park with my brother | 트램펄린 파크에 갈 거야 |
| 🐱 go to a cat cafe | go to a cat cafe to play with cute cats | 고양이 카페에 갈 거야 |
| 💇 go to the hair salon | go to the hair salon to get a haircut | 미용실에 갈 거야 |
| 🦷 go to the dentist | go to the dentist with my mom | 치과에 갈 거야 |

**👨‍👩‍👧 가족과 함께**

| 초급 | 중급 | 뜻 |
|---|---|---|
| 📘 👵 visit my grandparents | visit my grandparents in the countryside | 조부모님 댁을 방문할 거야 |
| 📘 ⛺ go camping | go camping with my family in the forest | 캠핑을 갈 거야 |
| 🍎 pick apples | pick apples with my dad at the farm | 사과를 딸 거야 |
| 🌰 pick up chestnuts | pick up chestnuts with my grandma in the mountains | 밤을 주울 거야 |
| 🍁 see the autumn leaves | see the autumn leaves with my family on the mountain | 단풍 구경을 할 거야 |
| 🥾 go hiking | go hiking with my dad in the mountains | 등산을 갈 거야 |
| 🍠 dig sweet potatoes | dig sweet potatoes with my grandpa on the farm | 고구마를 캘 거야 |
| 🧺 have a picnic | have a picnic with my family in the park | 소풍을 갈 거야 |
| 🍳 cook dinner | cook dinner with my mom in the kitchen | 저녁을 요리할 거야 |
| 🐕 walk my dog | walk my dog with my brother in the park | 개를 산책시킬 거야 |
| 🎢 go to an amusement park | go to an amusement park to ride a roller coaster | 놀이공원에 갈 거야 |
| 🎣 go fishing | go fishing with my grandpa at the lake | 낚시를 갈 거야 |

**✈️ 가족 여행**

| 초급 | 중급 | 뜻 |
|---|---|---|
| 🍊 go to Jeju Island | go to Jeju Island by plane with my family | 제주도에 갈 거야 |
| 🏯 visit Gyeongju | visit Gyeongju to see old temples | 경주를 방문할 거야 |
| 🌉 go to Busan | go to Busan to see the beautiful sea | 부산에 갈 거야 |
| ⛰️ climb Mount Seorak | climb Mount Seorak to see the autumn leaves | 설악산에 오를 거야 |
| 🍲 visit Jeonju | visit Jeonju to eat bibimbap | 전주를 방문할 거야 |
| 🎭 visit Andong | visit Andong to watch a mask dance | 안동을 방문할 거야 |
| 🌾 visit Suncheon Bay | visit Suncheon Bay to see the reeds and birds | 순천만을 방문할 거야 |
| 🌃 go to Yeosu | go to Yeosu to see the night sea | 여수에 갈 거야 |
| 🚆 take a train trip | take a train trip with my grandparents | 기차 여행을 할 거야 |
| 🗾 travel to Japan | travel to Japan to see Mount Fuji | 일본으로 여행을 갈 거야 |
| 🍜 travel to Vietnam | travel to Vietnam to eat pho | 베트남으로 여행을 갈 거야 |
| 🦘 travel to Australia | travel to Australia to see kangaroos | 호주로 여행을 갈 거야 |

## 그림 바꾸는 법

- 그림은 `images/<활동id>.png` 입니다(Canva generate-image로 만든 그림, 약 200×150 미리보기 크기 → 카드에서 `object-fit: contain`, 흰 배경).
- 같은 그림체를 유지하려면 아래 틀로 새로 만들고, 같은 파일 이름으로 덮어쓰면 됩니다. (aspectRatio: 4:3)

  > Cute flat vector illustration for an elementary school English flashcard: *[한국 아이(가족)가 그 활동을 하는 구체적 장면]*.
  > Warm autumn colors, simple clean shapes, white background, no text, no letters.

- 더 큰 그림을 쓰고 싶으면 Canva에서 내려받아 같은 이름으로 넣으면 됩니다(가로세로 4:3 권장).
- 그림이 없거나 못 불러오면 자동으로 이모지 타일로 대체됩니다.
- 활동을 추가·수정하면 `data.js` 의 `ACTIVITIES` 와 `DICT`(단어 뜻)를 함께 고치고 `node tests/check-data.js` 로 확인하세요.

## 파일 구성

```
index.html          화면 뼈대 (탭 3개)
style.css           가을 테마 · 반응형 · 인쇄용 스타일
data.js             질문 5개 · 종류 5개 · 활동 60개 · 단어 뜻 사전
app.js              채점 엔진(Scorer) + 화면 로직 (Node 에서도 채점 함수 불러오기 가능)
images/<id>.png     활동 그림 60장 (Canva)
tests/check-data.js 데이터 점검 (60개 · 📘 순서 · 사전 누락 0 · 그림 누락 0)
tests/scorer.test.js 채점 단위 테스트
tests/e2e.js        Playwright 브라우저 테스트 (가짜 마이크 + 가짜 SpeechRecognition, 데스크톱·휴대폰 스크린샷)
```

## 테스트 실행

```bash
node tests/check-data.js
node tests/scorer.test.js
node tests/e2e.js        # Playwright + Chromium 필요, 스크린샷은 tests/screenshots/
```

## GitHub Pages로 올리기

저장소 **Settings → Pages → Build and deployment**에서 Source를 “Deploy from a branch”로 두고,
이 파일들이 있는 브랜치(예: `main`)와 `/ (root)` 폴더를 고른 뒤 Save 하면 몇 분 뒤 주소가 생깁니다.

## 수업 전 확인할 것

- **Chrome(데스크톱·안드로이드)** 에서 쓰세요. 음성 인식(Web Speech API)은 Chrome/Edge에서 가장 잘 되고, 인터넷 연결이 필요합니다.
- 처음 🎙️를 누르면 **마이크 권한**을 물어봅니다 → “허용”. 막혔다면 주소창 🔒 → 마이크 허용.
- 마이크는 **https** 주소(GitHub Pages) 또는 `localhost` 에서만 동작합니다. 파일을 더블클릭해 연 `file://` 에서는 브라우저에 따라 마이크가 막힐 수 있습니다.
- 자동 테스트는 가짜 마이크와 가짜 음성 인식으로 했고, **실제 마이크·실제 학생 발음으로는 아직 시험하지 못했습니다.** 수업 전에 교실 기기로 한 번 말해 보세요.
- 소리 읽기(🔊)는 기기에 설치된 영어 음성을 씁니다. 소리가 안 나면 기기 음량과 영어(미국) 음성 설치를 확인하세요.
