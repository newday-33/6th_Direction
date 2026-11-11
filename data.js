/* =========================================================
   천재(함) 6학년 9단원  What are you going to do?
   데이터 파일 — 질문 · 활동 60개 · 단어 뜻 사전
   ========================================================= */

const UNIT = {
  title: "What are you going to do?",
  sub: "천재(함) 6학년 9단원 · 나의 계획 말하기",
  qFrame: "What are you going to do ___?",
  aFrame: "I'm going to ___."
};

/* 질문 5개 (언제) */
const QUESTIONS = [
  { id: "aft", en: "this afternoon",       ko: "오늘 오후", emoji: "🌤️", pick: "오늘 오후에 할래요" },
  { id: "ton", en: "tonight",              ko: "오늘 밤",   emoji: "🌙", pick: "오늘 밤에 할래요" },
  { id: "tom", en: "tomorrow",             ko: "내일",      emoji: "📅", pick: "내일 할래요" },
  { id: "wkd", en: "this weekend",         ko: "이번 주말", emoji: "🎈", pick: "이번 주말에 할래요" },
  { id: "vac", en: "this winter vacation", ko: "겨울방학",  emoji: "🎒", pick: "겨울방학에 할래요" }
];

/* 활동 종류 5개 */
const CATEGORIES = [
  { id: "home",   name: "집·학교에서",   emoji: "🏠" },
  { id: "play",   name: "운동·놀이",     emoji: "⚽" },
  { id: "place",  name: "장소에 가기",   emoji: "📍" },
  { id: "family", name: "가족과 함께",   emoji: "👨‍👩‍👧" },
  { id: "trip",   name: "가족 여행",     emoji: "✈️" }
];

/* 활동 60개
   en  : 동사구 (I'm going to ___.)
   ko  : "나는 ___ 거야"의 빈칸
   when: 어울리는 질문 id
   mid : 중급 문장 (누구와·어디서·무엇을 보러)
   book: 교과서 표현 📘 */
const ACTIVITIES = [
  /* 🏠 집·학교에서 */
  { id: "stay_home", cat: "home", book: true, emoji: "🏠", en: "stay home", ko: "집에 있을", when: ["ton", "wkd"],
    mid: { en: "stay home with my little brother", ko: "남동생과 함께 집에 있을" } },
  { id: "clean_room", cat: "home", book: true, emoji: "🧹", en: "clean my room", ko: "내 방을 청소할", when: ["aft", "tom"],
    mid: { en: "clean my room with my sister", ko: "여동생과 함께 내 방을 청소할" } },
  { id: "study_math", cat: "home", book: true, emoji: "➗", en: "study math", ko: "수학 공부를 할", when: ["aft", "ton"],
    mid: { en: "study math with my friend at the library", ko: "도서관에서 친구와 수학 공부를 할" } },
  { id: "do_homework", cat: "home", emoji: "📝", en: "do my homework", ko: "숙제를 할", when: ["aft", "ton"],
    mid: { en: "do my homework at my desk", ko: "내 책상에서 숙제를 할" } },
  { id: "read_book", cat: "home", emoji: "📖", en: "read a book", ko: "책을 읽을", when: ["ton", "wkd"],
    mid: { en: "read a funny book in my room", ko: "내 방에서 재미있는 책을 읽을" } },
  { id: "practice_piano", cat: "home", emoji: "🎹", en: "practice the piano", ko: "피아노 연습을 할", when: ["aft", "tom"],
    mid: { en: "practice the piano for the school concert", ko: "학교 음악회를 위해 피아노 연습을 할" } },
  { id: "draw_leaves", cat: "home", emoji: "🎨", en: "draw autumn leaves", ko: "단풍잎을 그릴", when: ["aft", "wkd"],
    mid: { en: "draw autumn leaves with my crayons", ko: "크레파스로 단풍잎을 그릴" } },
  { id: "write_diary", cat: "home", emoji: "📔", en: "write in my diary", ko: "일기를 쓸", when: ["ton"],
    mid: { en: "write in my diary before bed", ko: "자기 전에 일기를 쓸" } },
  { id: "play_games", cat: "home", emoji: "🎮", en: "play video games", ko: "비디오 게임을 할", when: ["ton", "wkd"],
    mid: { en: "play video games with my cousin", ko: "사촌과 비디오 게임을 할" } },
  { id: "bake_cookies", cat: "home", emoji: "🍪", en: "bake cookies", ko: "쿠키를 구울", when: ["tom", "wkd"],
    mid: { en: "bake pumpkin cookies with my mom", ko: "엄마와 호박 쿠키를 구울" } },
  { id: "watch_movie", cat: "home", emoji: "🎬", en: "watch a movie", ko: "영화를 볼", when: ["ton", "wkd"],
    mid: { en: "watch a movie with my family at home", ko: "집에서 가족과 영화를 볼" } },
  { id: "school_festival", cat: "home", emoji: "🎪", en: "go to the school festival", ko: "학교 축제에 갈", when: ["tom"],
    mid: { en: "go to the school festival to see a magic show", ko: "마술 쇼를 보러 학교 축제에 갈" } },

  /* ⚽ 운동·놀이 */
  { id: "baseball_game", cat: "play", book: true, emoji: "⚾", en: "watch a baseball game", ko: "야구 경기를 볼", when: ["ton", "wkd"],
    mid: { en: "watch a baseball game with my dad at the stadium", ko: "야구장에서 아빠와 야구 경기를 볼" } },
  { id: "fly_kite", cat: "play", emoji: "🪁", en: "fly a kite", ko: "연을 날릴", when: ["aft", "wkd"],
    mid: { en: "fly a kite on the hill", ko: "언덕에서 연을 날릴" } },
  { id: "ride_bike", cat: "play", emoji: "🚲", en: "ride my bike", ko: "자전거를 탈", when: ["aft", "tom"],
    mid: { en: "ride my bike in the park", ko: "공원에서 자전거를 탈" } },
  { id: "play_soccer", cat: "play", emoji: "⚽", en: "play soccer", ko: "축구를 할", when: ["aft", "tom"],
    mid: { en: "play soccer with my friends after school", ko: "방과 후에 친구들과 축구를 할" } },
  { id: "play_badminton", cat: "play", emoji: "🏸", en: "play badminton", ko: "배드민턴을 칠", when: ["aft", "wkd"],
    mid: { en: "play badminton with my sister in the park", ko: "공원에서 여동생과 배드민턴을 칠" } },
  { id: "play_basketball", cat: "play", emoji: "🏀", en: "play basketball", ko: "농구를 할", when: ["aft", "tom"],
    mid: { en: "play basketball at the school gym", ko: "학교 체육관에서 농구를 할" } },
  { id: "jump_rope", cat: "play", emoji: "🪢", en: "jump rope", ko: "줄넘기를 할", when: ["aft", "ton"],
    mid: { en: "jump rope with my friends in the schoolyard", ko: "운동장에서 친구들과 줄넘기를 할" } },
  { id: "inline_skate", cat: "play", emoji: "🛼", en: "go inline skating", ko: "인라인스케이트를 탈", when: ["aft", "wkd"],
    mid: { en: "go inline skating by the river", ko: "강가에서 인라인스케이트를 탈" } },
  { id: "play_dodgeball", cat: "play", emoji: "🤾", en: "play dodgeball", ko: "피구를 할", when: ["aft", "tom"],
    mid: { en: "play dodgeball with my classmates", ko: "반 친구들과 피구를 할" } },
  { id: "taekwondo", cat: "play", emoji: "🥋", en: "go to taekwondo class", ko: "태권도 학원에 갈", when: ["aft", "tom"],
    mid: { en: "go to taekwondo class to learn a new kick", ko: "새 발차기를 배우러 태권도 학원에 갈" } },
  { id: "sports_day", cat: "play", emoji: "🏅", en: "practice for sports day", ko: "운동회 연습을 할", when: ["aft", "tom"],
    mid: { en: "practice for sports day with my team", ko: "우리 팀과 운동회 연습을 할" } },
  { id: "play_tag", cat: "play", emoji: "🏃", en: "play tag", ko: "술래잡기를 할", when: ["aft"],
    mid: { en: "play tag with my friends at the playground", ko: "놀이터에서 친구들과 술래잡기를 할" } },

  /* 📍 장소에 가기 */
  { id: "pc_room", cat: "place", emoji: "🖥️", en: "go to a PC room", ko: "PC방에 갈", when: ["aft", "wkd"],
    mid: { en: "go to a PC room with my friends to play games", ko: "게임을 하러 친구들과 PC방에 갈" } },
  { id: "comic_cafe", cat: "place", emoji: "📚", en: "go to a comic book cafe", ko: "만화 카페에 갈", when: ["aft", "wkd"],
    mid: { en: "go to a comic book cafe to read comic books", ko: "만화책을 읽으러 만화 카페에 갈" } },
  { id: "karaoke", cat: "place", emoji: "🎤", en: "go to a coin karaoke room", ko: "코인노래방에 갈", when: ["aft", "tom"],
    mid: { en: "go to a coin karaoke room to sing with my friends", ko: "친구들과 노래하러 코인노래방에 갈" } },
  { id: "library", cat: "place", emoji: "🏛️", en: "go to the library", ko: "도서관에 갈", when: ["aft", "tom"],
    mid: { en: "go to the library to borrow some books", ko: "책을 빌리러 도서관에 갈" } },
  { id: "bookstore", cat: "place", emoji: "📕", en: "go to the bookstore", ko: "서점에 갈", when: ["tom", "wkd"],
    mid: { en: "go to the bookstore to buy a new comic book", ko: "새 만화책을 사러 서점에 갈" } },
  { id: "shopping_mall", cat: "place", emoji: "🛍️", en: "go to the shopping mall", ko: "쇼핑몰에 갈", when: ["wkd"],
    mid: { en: "go to the shopping mall to buy a warm jacket", ko: "따뜻한 재킷을 사러 쇼핑몰에 갈" } },
  { id: "bakery", cat: "place", emoji: "🥐", en: "go to the bakery", ko: "빵집에 갈", when: ["aft", "tom"],
    mid: { en: "go to the bakery to buy some bread", ko: "빵을 사러 빵집에 갈" } },
  { id: "escape_room", cat: "place", emoji: "🔐", en: "go to an escape room", ko: "방탈출 카페에 갈", when: ["wkd"],
    mid: { en: "go to an escape room with my cousins", ko: "사촌들과 방탈출 카페에 갈" } },
  { id: "trampoline", cat: "place", emoji: "🤸", en: "go to a trampoline park", ko: "트램펄린 파크에 갈", when: ["tom", "wkd"],
    mid: { en: "go to a trampoline park with my brother", ko: "남동생과 트램펄린 파크에 갈" } },
  { id: "cat_cafe", cat: "place", emoji: "🐱", en: "go to a cat cafe", ko: "고양이 카페에 갈", when: ["aft", "wkd"],
    mid: { en: "go to a cat cafe to play with cute cats", ko: "귀여운 고양이들과 놀러 고양이 카페에 갈" } },
  { id: "hair_salon", cat: "place", emoji: "💇", en: "go to the hair salon", ko: "미용실에 갈", when: ["aft", "tom"],
    mid: { en: "go to the hair salon to get a haircut", ko: "머리를 자르러 미용실에 갈" } },
  { id: "dentist", cat: "place", emoji: "🦷", en: "go to the dentist", ko: "치과에 갈", when: ["aft", "tom"],
    mid: { en: "go to the dentist with my mom", ko: "엄마와 치과에 갈" } },

  /* 👨‍👩‍👧 가족과 함께 */
  { id: "visit_grandparents", cat: "family", book: true, emoji: "👵", en: "visit my grandparents", ko: "조부모님 댁을 방문할", when: ["wkd", "vac"],
    mid: { en: "visit my grandparents in the countryside", ko: "시골에 계신 조부모님 댁을 방문할" } },
  { id: "go_camping", cat: "family", book: true, emoji: "⛺", en: "go camping", ko: "캠핑을 갈", when: ["wkd", "vac"],
    mid: { en: "go camping with my family in the forest", ko: "가족과 숲으로 캠핑을 갈" } },
  { id: "pick_apples", cat: "family", emoji: "🍎", en: "pick apples", ko: "사과를 딸", when: ["wkd"],
    mid: { en: "pick apples with my dad at the farm", ko: "농장에서 아빠와 사과를 딸" } },
  { id: "pick_chestnuts", cat: "family", emoji: "🌰", en: "pick up chestnuts", ko: "밤을 주울", when: ["wkd"],
    mid: { en: "pick up chestnuts with my grandma in the mountains", ko: "산에서 할머니와 밤을 주울" } },
  { id: "see_leaves", cat: "family", emoji: "🍁", en: "see the autumn leaves", ko: "단풍 구경을 할", when: ["tom", "wkd"],
    mid: { en: "see the autumn leaves with my family on the mountain", ko: "가족과 산에서 단풍 구경을 할" } },
  { id: "go_hiking", cat: "family", emoji: "🥾", en: "go hiking", ko: "등산을 갈", when: ["tom", "wkd"],
    mid: { en: "go hiking with my dad in the mountains", ko: "아빠와 산으로 등산을 갈" } },
  { id: "dig_potatoes", cat: "family", emoji: "🍠", en: "dig sweet potatoes", ko: "고구마를 캘", when: ["wkd"],
    mid: { en: "dig sweet potatoes with my grandpa on the farm", ko: "농장에서 할아버지와 고구마를 캘" } },
  { id: "have_picnic", cat: "family", emoji: "🧺", en: "have a picnic", ko: "소풍을 갈", when: ["tom", "wkd"],
    mid: { en: "have a picnic with my family in the park", ko: "공원에서 가족과 소풍을 즐길" } },
  { id: "cook_dinner", cat: "family", emoji: "🍳", en: "cook dinner", ko: "저녁을 요리할", when: ["ton"],
    mid: { en: "cook dinner with my mom in the kitchen", ko: "부엌에서 엄마와 저녁을 요리할" } },
  { id: "walk_dog", cat: "family", emoji: "🐕", en: "walk my dog", ko: "개를 산책시킬", when: ["aft", "ton"],
    mid: { en: "walk my dog with my brother in the park", ko: "공원에서 남동생과 개를 산책시킬" } },
  { id: "amusement_park", cat: "family", emoji: "🎢", en: "go to an amusement park", ko: "놀이공원에 갈", when: ["wkd", "vac"],
    mid: { en: "go to an amusement park to ride a roller coaster", ko: "롤러코스터를 타러 놀이공원에 갈" } },
  { id: "go_fishing", cat: "family", emoji: "🎣", en: "go fishing", ko: "낚시를 갈", when: ["wkd", "vac"],
    mid: { en: "go fishing with my grandpa at the lake", ko: "할아버지와 호수로 낚시를 갈" } },

  /* ✈️ 가족 여행 */
  { id: "jeju", cat: "trip", emoji: "🍊", en: "go to Jeju Island", ko: "제주도에 갈", when: ["wkd", "vac"],
    mid: { en: "go to Jeju Island by plane with my family", ko: "가족과 비행기를 타고 제주도에 갈" } },
  { id: "gyeongju", cat: "trip", emoji: "🏯", en: "visit Gyeongju", ko: "경주를 방문할", when: ["wkd", "vac"],
    mid: { en: "visit Gyeongju to see old temples", ko: "오래된 절을 보러 경주를 방문할" } },
  { id: "busan", cat: "trip", emoji: "🌉", en: "go to Busan", ko: "부산에 갈", when: ["wkd", "vac"],
    mid: { en: "go to Busan to see the beautiful sea", ko: "아름다운 바다를 보러 부산에 갈" } },
  { id: "seorak", cat: "trip", emoji: "⛰️", en: "climb Mount Seorak", ko: "설악산에 오를", when: ["wkd", "vac"],
    mid: { en: "climb Mount Seorak to see the autumn leaves", ko: "단풍을 보러 설악산에 오를" } },
  { id: "jeonju", cat: "trip", emoji: "🍲", en: "visit Jeonju", ko: "전주를 방문할", when: ["vac"],
    mid: { en: "visit Jeonju to eat bibimbap", ko: "비빔밥을 먹으러 전주를 방문할" } },
  { id: "andong", cat: "trip", emoji: "🎭", en: "visit Andong", ko: "안동을 방문할", when: ["vac"],
    mid: { en: "visit Andong to watch a mask dance", ko: "탈춤을 보러 안동을 방문할" } },
  { id: "suncheon", cat: "trip", emoji: "🌾", en: "visit Suncheon Bay", ko: "순천만을 방문할", when: ["wkd", "vac"],
    mid: { en: "visit Suncheon Bay to see the reeds and birds", ko: "갈대와 새를 보러 순천만을 방문할" } },
  { id: "yeosu", cat: "trip", emoji: "🌃", en: "go to Yeosu", ko: "여수에 갈", when: ["vac"],
    mid: { en: "go to Yeosu to see the night sea", ko: "밤바다를 보러 여수에 갈" } },
  { id: "train_trip", cat: "trip", emoji: "🚆", en: "take a train trip", ko: "기차 여행을 할", when: ["wkd", "vac"],
    mid: { en: "take a train trip with my grandparents", ko: "조부모님과 기차 여행을 할" } },
  { id: "japan", cat: "trip", emoji: "🗾", en: "travel to Japan", ko: "일본으로 여행을 갈", when: ["vac"],
    mid: { en: "travel to Japan to see Mount Fuji", ko: "후지산을 보러 일본으로 여행을 갈" } },
  { id: "vietnam", cat: "trip", emoji: "🍜", en: "travel to Vietnam", ko: "베트남으로 여행을 갈", when: ["vac"],
    mid: { en: "travel to Vietnam to eat pho", ko: "쌀국수를 먹으러 베트남으로 여행을 갈" } },
  { id: "australia", cat: "trip", emoji: "🦘", en: "travel to Australia", ko: "호주로 여행을 갈", when: ["vac"],
    mid: { en: "travel to Australia to see kangaroos", ko: "캥거루를 보러 호주로 여행을 갈" } }
];

/* 단어 뜻 사전 (소문자 키) — 모든 문장의 단어가 들어 있어야 함 (tests/check-data.js 로 확인) */
const DICT = {
  "what": "무엇", "are": "~이다 (are you: 너는)", "you": "너", "going": "~할 예정인 (be going to)", "to": "~하려고 / ~로",
  "do": "하다", "this": "이, 이번", "afternoon": "오후", "tonight": "오늘 밤", "tomorrow": "내일",
  "weekend": "주말", "winter": "겨울", "vacation": "방학", "i'm": "나는 ~이다 (I am)", "i": "나",
  "am": "~이다", "a": "하나의", "an": "하나의 (모음 앞)", "the": "그", "my": "나의",
  "with": "~와 함께", "at": "~에서", "in": "~ 안에서", "on": "~ 위에서", "for": "~을 위해",
  "by": "~ 옆에 / ~을 타고", "and": "그리고", "some": "몇몇의, 약간의", "before": "~ 전에", "after": "~ 후에",
  "stay": "머무르다", "home": "집 (에)", "little": "어린, 작은", "brother": "남자 형제 (남동생·형·오빠)",
  "clean": "청소하다", "room": "방", "sister": "여자 형제 (여동생·누나·언니)",
  "study": "공부하다", "math": "수학", "friend": "친구", "library": "도서관",
  "homework": "숙제", "desk": "책상", "read": "읽다", "book": "책", "funny": "재미있는",
  "practice": "연습하다", "piano": "피아노", "school": "학교", "concert": "음악회",
  "draw": "그리다", "autumn": "가을", "leaves": "나뭇잎들 (단풍)", "crayons": "크레파스",
  "write": "쓰다", "diary": "일기", "bed": "침대 (before bed: 자기 전에)",
  "play": "놀다, (운동·게임을) 하다", "video": "비디오", "games": "게임들", "cousin": "사촌",
  "bake": "굽다", "cookies": "쿠키들", "pumpkin": "호박", "mom": "엄마",
  "watch": "보다", "movie": "영화", "family": "가족", "go": "가다", "festival": "축제",
  "see": "보다", "magic": "마술", "show": "쇼, 공연",
  "baseball": "야구", "game": "경기, 게임", "dad": "아빠", "stadium": "경기장",
  "fly": "날리다", "kite": "연", "hill": "언덕", "ride": "타다", "bike": "자전거", "park": "공원",
  "soccer": "축구", "friends": "친구들", "badminton": "배드민턴", "basketball": "농구", "gym": "체육관",
  "jump": "뛰다", "rope": "줄 (jump rope: 줄넘기하다)", "schoolyard": "운동장",
  "inline": "인라인", "skating": "스케이트 타기", "river": "강",
  "dodgeball": "피구", "classmates": "반 친구들", "taekwondo": "태권도", "class": "수업, 학원",
  "learn": "배우다", "new": "새로운", "kick": "발차기", "sports": "운동", "day": "날 (sports day: 운동회)",
  "team": "팀", "tag": "술래잡기", "playground": "놀이터",
  "pc": "PC, 컴퓨터 (PC room: PC방)", "comic": "만화", "books": "책들", "cafe": "카페",
  "coin": "동전 (coin karaoke: 코인노래방)", "karaoke": "노래방", "sing": "노래하다",
  "borrow": "빌리다", "bookstore": "서점", "buy": "사다", "shopping": "쇼핑", "mall": "쇼핑몰",
  "warm": "따뜻한", "jacket": "재킷", "bakery": "빵집", "bread": "빵",
  "escape": "탈출 (escape room: 방탈출 카페)", "cousins": "사촌들", "trampoline": "트램펄린",
  "cat": "고양이", "cute": "귀여운", "cats": "고양이들", "hair": "머리카락", "salon": "미용실 (hair salon)",
  "get": "받다, 얻다", "haircut": "이발, 머리 자르기", "dentist": "치과 (의사)",
  "visit": "방문하다", "grandparents": "조부모님 (할아버지·할머니)", "countryside": "시골",
  "camping": "캠핑", "forest": "숲", "pick": "따다 (pick up: 줍다)", "apples": "사과들", "farm": "농장",
  "up": "위로 (pick up: 줍다)", "chestnuts": "밤 (열매)", "grandma": "할머니", "mountains": "산들",
  "mountain": "산", "hiking": "등산, 하이킹", "dig": "캐다, 파다", "sweet": "달콤한",
  "potatoes": "감자들 (sweet potatoes: 고구마)", "grandpa": "할아버지",
  "have": "가지다, 하다", "picnic": "소풍", "cook": "요리하다", "dinner": "저녁 식사", "kitchen": "부엌",
  "walk": "산책시키다, 걷다", "dog": "개", "amusement": "즐거움 (amusement park: 놀이공원)",
  "roller": "롤러", "coaster": "코스터 (roller coaster: 롤러코스터)", "fishing": "낚시", "lake": "호수",
  "jeju": "제주", "island": "섬", "plane": "비행기", "gyeongju": "경주 (도시)", "old": "오래된",
  "temples": "절들", "busan": "부산", "beautiful": "아름다운", "sea": "바다",
  "climb": "오르다", "mount": "산 (산 이름 앞)", "seorak": "설악 (설악산)",
  "jeonju": "전주 (도시)", "eat": "먹다", "bibimbap": "비빔밥",
  "andong": "안동 (도시)", "mask": "탈, 가면", "dance": "춤 (mask dance: 탈춤)",
  "suncheon": "순천", "bay": "만 (바다가 육지로 들어온 곳)", "reeds": "갈대들", "birds": "새들",
  "yeosu": "여수", "night": "밤", "take": "타다, 하다", "train": "기차", "trip": "여행",
  "travel": "여행하다", "japan": "일본", "fuji": "후지 (후지산)", "vietnam": "베트남", "pho": "쌀국수",
  "australia": "호주", "kangaroos": "캥거루들"
};

if (typeof module !== "undefined") module.exports = { UNIT, QUESTIONS, CATEGORIES, ACTIVITIES, DICT };
