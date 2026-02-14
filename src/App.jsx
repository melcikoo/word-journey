import { useState, useEffect, useCallback, useRef } from "react";

const CHAPTERS = [
  // ═══ ACT 1: 어둠 (계단소 3단어) ═══
  {
    id: 1, title: "잿빛 새벽", subtitle: "아무것도 느끼지 못하는 날들",
    avatarMood: 0, accentColor: "#6b7280",
    narrativeIntro: "오래된 일기장의 첫 페이지.\n먼지 쌓인 단어들 사이에서\n잊혀진 감정을 되찾아야 한다.",
    completionIllust: "🌫️",
    completionNarrative: "텅 빈 새벽,\n처음으로 무언가를 느꼈다.\n그것이 비록 공허일지라도.",
    crossword: {
      size: 5,
      words: [
        { word: "공허", clue: "마음속이 텅 비어 있는 느낌. 空虛.", hint2: "\"성공을 이뤘지만 마음은 ○○했다.\"", hint3char: { index: 0, char: "공" }, direction: "across", row: 0, col: 0 },
        { word: "허무", clue: "아무런 보람이나 의미가 없음. 虛無.", hint2: "\"오랜 노력이 물거품이 되자 ○○감이 밀려왔다.\"", hint3char: { index: 1, char: "무" }, direction: "down", row: 0, col: 1 },
        { word: "무심", clue: "관심이나 흥미가 없이 냉담함. 無心.", hint2: "\"그는 ○○한 표정으로 창밖을 바라보았다.\"", hint3char: { index: 1, char: "심" }, direction: "across", row: 1, col: 1 },
      ],
      collectibleWord: "공허", collectibleDef: "空虛 — 마음속이 텅 비어 아무것도 느끼지 못하는 상태", collectibleRarity: "uncommon",
    },
  },
  {
    id: 2, title: "고요한 밤", subtitle: "나만 깨어 있는 것 같은 시간",
    avatarMood: 0, accentColor: "#4b5563",
    narrativeIntro: "모두 잠든 시간.\n혼자만의 목소리가\n빈 방에 울린다.",
    completionIllust: "🌙",
    completionNarrative: "어둠 속에서 홀로 중얼거린 말들.\n아무도 듣지 않았지만,\n그 말들은 진심이었다.",
    crossword: {
      size: 5,
      words: [
        { word: "고독", clue: "세상에 홀로 떨어져 있는 듯한 외로움. 孤獨.", hint2: "\"군중 속에서도 ○○을 느낄 수 있다.\"", hint3char: { index: 0, char: "고" }, direction: "across", row: 0, col: 0 },
        { word: "독백", clue: "혼자서 중얼거리듯 하는 말. 獨白.", hint2: "\"그의 ○○은 누구에게도 닿지 않았다.\"", hint3char: { index: 1, char: "백" }, direction: "down", row: 0, col: 1 },
        { word: "백지", clue: "아무것도 쓰여 있지 않은 종이. 白紙.", hint2: "\"답안지를 ○○로 낸 적이 있다.\"", hint3char: { index: 0, char: "백" }, direction: "across", row: 1, col: 1 },
      ],
      collectibleWord: "독백", collectibleDef: "獨白 — 아무도 듣지 않는 곳에서 혼자 내뱉는 진심의 말", collectibleRarity: "uncommon",
    },
  },
  {
    id: 3, title: "멈춘 시계", subtitle: "시간마저 잊어버린 오후",
    avatarMood: 0, accentColor: "#64748b",
    narrativeIntro: "벽 위의 시계가 멈춰 있다.\n소리 없는 방 안에서\n생각만이 끝없이 흐른다.",
    completionIllust: "⏱️",
    completionNarrative: "침묵 속에서 떠오른 생각들.\n멈춘 줄 알았던 시간은\n사실 조용히 흐르고 있었다.",
    crossword: {
      size: 5,
      words: [
        { word: "침묵", clue: "아무 말 없이 잠잠히 있음. 沈黙.", hint2: "\"그는 긴 ○○ 끝에 입을 열었다.\"", hint3char: { index: 0, char: "침" }, direction: "across", row: 0, col: 0 },
        { word: "묵상", clue: "조용히 깊이 생각함. 黙想.", hint2: "\"아침마다 잠시 ○○의 시간을 갖는다.\"", hint3char: { index: 1, char: "상" }, direction: "down", row: 0, col: 1 },
        { word: "상념", clue: "이런저런 복잡한 생각. 想念.", hint2: "\"밤이면 수많은 ○○에 잠기곤 했다.\"", hint3char: { index: 1, char: "념" }, direction: "across", row: 1, col: 1 },
      ],
      collectibleWord: "묵상", collectibleDef: "黙想 — 고요 속에서 자신과 마주하는 깊은 생각의 시간", collectibleRarity: "uncommon",
    },
  },
  // ═══ ACT 2: 전환 (십자소 4단어) ═══
  {
    id: 4, title: "흐린 오후", subtitle: "무언가 달라지기 시작하는 순간",
    avatarMood: 1, accentColor: "#818cf8",
    narrativeIntro: "일기장 사이에 끼워진 편지 한 장.\n누군가의 따뜻한 문장이\n희미하게 번져 있다.",
    completionIllust: "💌",
    completionNarrative: "오래된 편지 속 한 문장이\n가슴 깊이 파고들었다.\n감동은 조용히 찾아온다.",
    crossword: {
      size: 5,
      words: [
        { word: "행동", clue: "몸을 움직여 무엇을 하는 것. 行動.", hint2: "\"말보다 ○○이 중요한 순간이 있다.\"", hint3char: { index: 0, char: "행" }, direction: "down", row: 0, col: 1 },
        { word: "감동적", clue: "크게 느끼어 마음이 움직이는. 感動的.", hint2: "\"그 장면은 정말 ○○○이었다.\"", hint3char: { index: 1, char: "동" }, direction: "across", row: 1, col: 0 },
        { word: "감사", clue: "고마움을 나타내는 마음. 感謝.", hint2: "\"도움을 받아 깊은 ○○를 느꼈다.\"", hint3char: { index: 1, char: "사" }, direction: "down", row: 1, col: 0 },
        { word: "적막", clue: "고요하고 쓸쓸함. 寂寞.", hint2: "\"텅 빈 거리에 ○○이 감돌았다.\"", hint3char: { index: 1, char: "막" }, direction: "down", row: 1, col: 2 },
      ],
      collectibleWord: "감동적", collectibleDef: "感動的 — 마음을 크게 움직이는, 잊을 수 없는 순간의 감정", collectibleRarity: "rare",
    },
  },
  {
    id: 5, title: "빗소리", subtitle: "창밖의 소리에 귀 기울이다",
    avatarMood: 1, accentColor: "#60a5fa",
    narrativeIntro: "유리창에 빗방울이 맺힌다.\n흐릿한 풍경 너머로\n잊었던 안도감이 번진다.",
    completionIllust: "🌧️",
    completionNarrative: "빗소리에 묻혀 안녕을 건넸다.\n젖은 거리 위로\n작은 감격이 피어올랐다.",
    crossword: {
      size: 5,
      words: [
        { word: "태도", clue: "어떤 일에 대한 마음가짐이나 자세. 態度.", hint2: "\"그의 진지한 ○○에 신뢰가 생겼다.\"", hint3char: { index: 0, char: "태" }, direction: "down", row: 0, col: 1 },
        { word: "안도감", clue: "걱정이 풀려 마음이 놓이는 느낌. 安堵感.", hint2: "\"시험이 끝나자 ○○○이 밀려왔다.\"", hint3char: { index: 1, char: "도" }, direction: "across", row: 1, col: 0 },
        { word: "안녕", clue: "탈 없이 편안함, 또는 인사말. 安寧.", hint2: "\"오랜만에 전한 ○○ 한마디.\"", hint3char: { index: 1, char: "녕" }, direction: "down", row: 1, col: 0 },
        { word: "감격", clue: "마음에 깊이 느껴 크게 감동함. 感激.", hint2: "\"수상 소식에 ○○의 눈물을 흘렸다.\"", hint3char: { index: 0, char: "감" }, direction: "down", row: 1, col: 2 },
      ],
      collectibleWord: "안도감", collectibleDef: "安堵感 — 무거운 짐을 내려놓은 뒤 찾아오는 평안한 감정", collectibleRarity: "rare",
    },
  },
  {
    id: 6, title: "첫 걸음", subtitle: "떨리지만 내딛는 발",
    avatarMood: 1, accentColor: "#a78bfa",
    narrativeIntro: "닫혀 있던 문 앞에 섰다.\n심장이 빠르게 뛰지만\n손은 이미 손잡이를 잡았다.",
    completionIllust: "🚪",
    completionNarrative: "문을 열자 바람이 불어왔다.\n심장은 아직 뛰고 있었지만,\n그건 두려움이 아니라 용기였다.",
    crossword: {
      size: 5,
      words: [
        { word: "용기", clue: "씩씩하고 굳센 기운. 勇氣.", hint2: "\"○○를 내어 처음으로 손을 들었다.\"", hint3char: { index: 0, char: "용" }, direction: "down", row: 0, col: 1 },
        { word: "호기심", clue: "새롭고 신기한 것에 끌리는 마음. 好奇心.", hint2: "\"아이의 눈에는 ○○○이 가득했다.\"", hint3char: { index: 1, char: "기" }, direction: "across", row: 1, col: 0 },
        { word: "호흡", clue: "숨을 들이쉬고 내쉼. 呼吸.", hint2: "\"깊은 ○○으로 마음을 가라앉혔다.\"", hint3char: { index: 1, char: "흡" }, direction: "down", row: 1, col: 0 },
        { word: "심장", clue: "피를 온몸으로 보내는 기관. 心臟.", hint2: "\"○○이 두근두근 뛰기 시작했다.\"", hint3char: { index: 1, char: "장" }, direction: "down", row: 1, col: 2 },
      ],
      collectibleWord: "호기심", collectibleDef: "好奇心 — 세상을 향해 눈을 뜨게 만드는, 모든 발견의 시작", collectibleRarity: "rare",
    },
  },
  {
    id: 7, title: "바람이 부는 날", subtitle: "흔들리지만 부러지지 않는",
    avatarMood: 2, accentColor: "#34d399",
    narrativeIntro: "바람이 거세게 분다.\n하지만 뿌리 깊은 나무는\n흔들릴지언정 쓰러지지 않는다.",
    completionIllust: "🌿",
    completionNarrative: "바람 속에서 확신을 찾았다.\n자유란 두려움이 없는 것이 아니라\n두려움 속에서도 나아가는 것.",
    crossword: {
      size: 5,
      words: [
        { word: "확신", clue: "굳게 믿어 의심하지 않음. 確信.", hint2: "\"그는 자신의 선택에 ○○을 가졌다.\"", hint3char: { index: 0, char: "확" }, direction: "down", row: 0, col: 1 },
        { word: "자신감", clue: "스스로를 믿는 마음. 自信感.", hint2: "\"경험이 쌓이자 ○○○이 붙었다.\"", hint3char: { index: 1, char: "신" }, direction: "across", row: 1, col: 0 },
        { word: "자유", clue: "외부의 구속 없이 자기 뜻대로 함. 自由.", hint2: "\"진정한 ○○는 내면에서 온다.\"", hint3char: { index: 1, char: "유" }, direction: "down", row: 1, col: 0 },
        { word: "감탄", clue: "훌륭함에 마음이 움직여 탄식함. 感嘆.", hint2: "\"그 풍경에 절로 ○○이 나왔다.\"", hint3char: { index: 0, char: "감" }, direction: "down", row: 1, col: 2 },
      ],
      collectibleWord: "자신감", collectibleDef: "自信感 — 스스로를 믿는 힘, 바람에도 흔들리지 않는 뿌리", collectibleRarity: "rare",
    },
  },
  // ═══ ACT 3: 빛 (계단대 5단어) ═══
  {
    id: 8, title: "따뜻한 손", subtitle: "누군가의 온기가 전해지다",
    avatarMood: 2, accentColor: "#fb923c",
    narrativeIntro: "차가운 손 위에\n따뜻한 손이 포개진다.\n말 없이도 전해지는 것이 있다.",
    completionIllust: "🤲",
    completionNarrative: "온기는 손에서 손으로,\n마음에서 마음으로 전해졌다.\n만복은 혼자가 아닌 함께에서 온다.",
    crossword: {
      size: 5,
      words: [
        { word: "평온", clue: "마음이 고르고 잔잔한 상태. 平穩.", hint2: "\"폭풍이 지나간 뒤 비로소 ○○이 찾아왔다.\"", hint3char: { index: 0, char: "평" }, direction: "across", row: 0, col: 0 },
        { word: "온기", clue: "따뜻한 기운. 溫氣.", hint2: "\"차가운 손을 감싸는 ○○가 느껴졌다.\"", hint3char: { index: 1, char: "기" }, direction: "down", row: 0, col: 1 },
        { word: "기원", clue: "바라는 바가 이루어지도록 빎. 祈願.", hint2: "\"새해 첫날 간절히 ○○을 올렸다.\"", hint3char: { index: 0, char: "기" }, direction: "across", row: 1, col: 1 },
        { word: "원만", clue: "모나지 않고 넉넉하여 부족함이 없음. 圓滿.", hint2: "\"모든 일이 ○○하게 해결되었다.\"", hint3char: { index: 1, char: "만" }, direction: "down", row: 1, col: 2 },
        { word: "만복", clue: "온갖 복이 가득함. 萬福.", hint2: "\"새해에는 ○○이 깃들기를 바랍니다.\"", hint3char: { index: 1, char: "복" }, direction: "across", row: 2, col: 2 },
      ],
      collectibleWord: "만복", collectibleDef: "萬福 — 온갖 복이 가득한 상태, 더할 나위 없는 행복", collectibleRarity: "legendary",
    },
  },
  {
    id: 9, title: "한가운데", subtitle: "가장 중요한 것을 찾아서",
    avatarMood: 2, accentColor: "#e879f9",
    narrativeIntro: "수많은 선택지 앞에서\n가장 소중한 것을 골라야 한다.\n답은 이미 마음 한가운데에 있다.",
    completionIllust: "💎",
    completionNarrative: "소중한 것은 멀리 있지 않았다.\n마음의 중심에서 시작된 화합이\n모든 것을 하나로 이어주었다.",
    crossword: {
      size: 5,
      words: [
        { word: "소중", clue: "매우 귀하고 중요함. 所重.", hint2: "\"○○한 사람에게 마음을 전했다.\"", hint3char: { index: 0, char: "소" }, direction: "across", row: 0, col: 0 },
        { word: "중심", clue: "사물의 한가운데. 中心.", hint2: "\"문제의 ○○을 파악해야 한다.\"", hint3char: { index: 1, char: "심" }, direction: "down", row: 0, col: 1 },
        { word: "심화", clue: "정도가 깊어지거나 심해짐. 深化.", hint2: "\"갈등이 점점 ○○되고 있다.\"", hint3char: { index: 0, char: "심" }, direction: "across", row: 1, col: 1 },
        { word: "화합", clue: "서로 뜻이 맞아 하나가 됨. 和合.", hint2: "\"다양한 의견이 ○○을 이루었다.\"", hint3char: { index: 1, char: "합" }, direction: "down", row: 1, col: 2 },
        { word: "합의", clue: "서로의 의견이 일치함. 合意.", hint2: "\"오랜 논의 끝에 ○○에 도달했다.\"", hint3char: { index: 1, char: "의" }, direction: "across", row: 2, col: 2 },
      ],
      collectibleWord: "화합", collectibleDef: "和合 — 서로 다른 것들이 뜻을 모아 하나가 되는 아름다운 순간", collectibleRarity: "legendary",
    },
  },
  {
    id: 10, title: "새벽이 온다", subtitle: "어둠 끝에 빛나는 첫 빛",
    avatarMood: 3, accentColor: "#f59e0b",
    narrativeIntro: "일기장의 마지막 페이지.\n모든 단어가 제자리를 찾으면,\n잊었던 이름을 떠올리게 된다.",
    completionIllust: "🌅",
    completionNarrative: "여명이 밝아온다.\n함께 걸어온 길 위에서\n모든 단어가 하나의 이야기가 되었다.",
    crossword: {
      size: 5,
      words: [
        { word: "여명", clue: "동이 트기 시작하는 어스름한 빛. 黎明.", hint2: "\"○○이 밝아오자 희망이 보였다.\"", hint3char: { index: 0, char: "여" }, direction: "across", row: 0, col: 0 },
        { word: "명상", clue: "고요히 눈을 감고 깊이 생각함. 瞑想.", hint2: "\"매일 아침 ○○으로 하루를 시작한다.\"", hint3char: { index: 1, char: "상" }, direction: "down", row: 0, col: 1 },
        { word: "상생", clue: "서로 도우며 함께 살아감. 相生.", hint2: "\"자연과 인간의 ○○을 꿈꾼다.\"", hint3char: { index: 0, char: "상" }, direction: "across", row: 1, col: 1 },
        { word: "생동", clue: "생기 있고 활발하게 움직임. 生動.", hint2: "\"봄이 오자 만물이 ○○하기 시작했다.\"", hint3char: { index: 1, char: "동" }, direction: "down", row: 1, col: 2 },
        { word: "동행", clue: "같은 길을 함께 감. 同行.", hint2: "\"인생의 ○○이 있어 외롭지 않다.\"", hint3char: { index: 1, char: "행" }, direction: "across", row: 2, col: 2 },
      ],
      collectibleWord: "동행", collectibleDef: "同行 — 같은 길을 함께 걷는 것, 여정의 끝에서 발견한 가장 큰 선물", collectibleRarity: "legendary",
    },
  },
];

const RARITY_CONFIG = {
  common: { label: "普通", color: "#9ca3af", bg: "rgba(156,163,175,0.15)" },
  uncommon: { label: "高雅", color: "#60a5fa", bg: "rgba(96,165,250,0.15)" },
  rare: { label: "稀貴", color: "#a78bfa", bg: "rgba(167,139,250,0.15)" },
  legendary: { label: "傳說", color: "#fbbf24", bg: "rgba(251,191,36,0.15)" },
};

const HINT_COSTS = [0, 30, 50];

const Avatar = ({ mood, size = 100 }) => {
  const faces = [
    <svg key="0" width={size} height={size} viewBox="0 0 120 120">
      <defs><radialGradient id="f0" cx="50%" cy="40%" r="50%"><stop offset="0%" stopColor="#94a3b8"/><stop offset="100%" stopColor="#64748b"/></radialGradient></defs>
      <circle cx="60" cy="60" r="50" fill="url(#f0)" stroke="#475569" strokeWidth="2"/>
      <circle cx="44" cy="50" r="4" fill="#334155" opacity="0.6"/><circle cx="76" cy="50" r="4" fill="#334155" opacity="0.6"/>
      <line x1="44" y1="74" x2="76" y2="74" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" opacity="0.5"/>
    </svg>,
    <svg key="1" width={size} height={size} viewBox="0 0 120 120">
      <defs><radialGradient id="f1" cx="50%" cy="40%" r="50%"><stop offset="0%" stopColor="#c4b5fd"/><stop offset="100%" stopColor="#8b5cf6"/></radialGradient></defs>
      <circle cx="60" cy="60" r="50" fill="url(#f1)" stroke="#7c3aed" strokeWidth="2"/>
      <circle cx="44" cy="48" r="4.5" fill="#312e81"/><circle cx="76" cy="48" r="4.5" fill="#312e81"/>
      <path d="M 44 70 Q 60 80 76 70" stroke="#312e81" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <circle cx="36" cy="62" r="6" fill="#f0abfc" opacity="0.3"/><circle cx="84" cy="62" r="6" fill="#f0abfc" opacity="0.3"/>
    </svg>,
    <svg key="2" width={size} height={size} viewBox="0 0 120 120">
      <defs><radialGradient id="f2" cx="50%" cy="35%" r="50%"><stop offset="0%" stopColor="#fde68a"/><stop offset="100%" stopColor="#f59e0b"/></radialGradient></defs>
      {[0,45,90,135,180,225,270,315].map(a=><line key={a} x1={60+Math.cos(a*Math.PI/180)*54} y1={60+Math.sin(a*Math.PI/180)*54} x2={60+Math.cos(a*Math.PI/180)*62} y2={60+Math.sin(a*Math.PI/180)*62} stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>)}
      <circle cx="60" cy="60" r="50" fill="url(#f2)" stroke="#d97706" strokeWidth="2"/>
      <ellipse cx="44" cy="46" rx="5" ry="6" fill="#92400e"/><ellipse cx="76" cy="46" rx="5" ry="6" fill="#92400e"/>
      <ellipse cx="45" cy="44" rx="2" ry="2.5" fill="white" opacity="0.7"/><ellipse cx="77" cy="44" rx="2" ry="2.5" fill="white" opacity="0.7"/>
      <path d="M 40 66 Q 60 86 80 66" stroke="#92400e" strokeWidth="2.5" fill="#fcd34d" strokeLinecap="round"/>
      <circle cx="32" cy="60" r="8" fill="#fb923c" opacity="0.25"/><circle cx="88" cy="60" r="8" fill="#fb923c" opacity="0.25"/>
    </svg>,
    <svg key="3" width={size} height={size} viewBox="0 0 120 120">
      <defs><radialGradient id="f3" cx="50%" cy="35%" r="55%"><stop offset="0%" stopColor="#fff7ed"/><stop offset="50%" stopColor="#fde68a"/><stop offset="100%" stopColor="#f59e0b"/></radialGradient>
      <filter id="gl3"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
      {[0,30,60,90,120,150,180,210,240,270,300,330].map(a=><line key={a} x1={60+Math.cos(a*Math.PI/180)*52} y1={60+Math.sin(a*Math.PI/180)*52} x2={60+Math.cos(a*Math.PI/180)*64} y2={60+Math.sin(a*Math.PI/180)*64} stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" opacity="0.8"><animate attributeName="opacity" values="0.4;1;0.4" dur="2s" begin={`${a*0.01}s`} repeatCount="indefinite"/></line>)}
      <circle cx="60" cy="60" r="50" fill="url(#f3)" stroke="#d97706" strokeWidth="2" filter="url(#gl3)"/>
      <path d="M 38 46 Q 44 40 50 46" stroke="#92400e" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M 70 46 Q 76 40 82 46" stroke="#92400e" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M 38 64 Q 60 90 82 64" stroke="#92400e" strokeWidth="3" fill="#fcd34d" strokeLinecap="round"/>
      <circle cx="30" cy="60" r="9" fill="#fb923c" opacity="0.3"/><circle cx="90" cy="60" r="9" fill="#fb923c" opacity="0.3"/>
      <text x="60" y="112" textAnchor="middle" fontSize="11" fill="#d97706" fontFamily="serif" fontWeight="bold">✦ 완성 ✦</text>
    </svg>,
  ];
  return <div style={{ display: "inline-block", transition: "all 0.8s ease" }}>{faces[Math.min(mood, 3)]}</div>;
};

/* ── Hint Modal (for hint 2 & 3 unlock) ── */
const HintModal = ({ word, hintLevel, points, onUnlockHint, onClose, accentColor }) => {
  if (!word) return null;
  const canAfford2 = points >= HINT_COSTS[1];
  const canAfford3 = points >= HINT_COSTS[2];

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 100,
      background: "rgba(0,0,0,0.35)", backdropFilter: "blur(10px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      animation: "fadeIn 0.2s ease",
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#ffffff", border: "1px solid rgba(20,20,40,0.08)",
        borderRadius: "24px", padding: "28px 22px", maxWidth: "340px", width: "92%",
        position: "relative", boxShadow: "0 24px 80px rgba(0,0,0,0.12)",
      }}>
        <button onClick={onClose} style={{
          position: "absolute", top: "14px", right: "16px",
          background: "rgba(20,20,40,0.06)", border: "none", color: "rgba(20,20,40,0.50)",
          fontSize: "16px", cursor: "pointer", width: "28px", height: "28px",
          borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
        }}>×</button>

        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
          <div style={{
            padding: "4px 10px", borderRadius: "8px",
            background: `${accentColor}20`, color: accentColor,
            fontSize: "11px", fontWeight: "700", fontFamily: "'Noto Serif KR', serif",
          }}>
            {word.direction === "across" ? "가로 →" : "세로 ↓"}
          </div>
          <div style={{
            fontSize: "11px", color: "rgba(20,20,40,0.40)",
            fontFamily: "'Noto Serif KR', serif",
          }}>{word.word.length}글자</div>
        </div>

        {/* Hint 1 */}
        <div style={{ marginBottom: "14px" }}>
          <div style={{ fontSize: "10px", color: "rgba(20,20,40,0.40)", marginBottom: "5px", letterSpacing: "0.1em", fontFamily: "'Noto Serif KR', serif" }}>
            힌트 1 — 뜻풀이
          </div>
          <div style={{
            fontSize: "14px", color: "rgba(20,20,40,0.90)", lineHeight: "1.7",
            fontFamily: "'Noto Serif KR', serif", padding: "10px 12px", borderRadius: "12px",
            background: "rgba(20,20,40,0.05)", borderLeft: `3px solid ${accentColor}`,
          }}>{word.clue}</div>
        </div>

        {/* Hint 2 */}
        <div style={{ marginBottom: "14px" }}>
          <div style={{ fontSize: "10px", color: "rgba(20,20,40,0.40)", marginBottom: "5px", letterSpacing: "0.1em", fontFamily: "'Noto Serif KR', serif" }}>
            힌트 2 — 용례
          </div>
          {hintLevel >= 2 ? (
            <div style={{
              fontSize: "13px", color: "rgba(20,20,40,0.80)", lineHeight: "1.7",
              fontFamily: "'Noto Serif KR', serif", padding: "10px 12px", borderRadius: "12px",
              background: "rgba(129,140,248,0.08)", borderLeft: "3px solid #818cf8", fontStyle: "italic",
            }}>{word.hint2}</div>
          ) : (
            <button onClick={() => canAfford2 && onUnlockHint(2)} style={{
              width: "100%", padding: "11px", borderRadius: "12px",
              border: `1px dashed ${canAfford2 ? "rgba(129,140,248,0.4)" : "rgba(20,20,40,0.08)"}`,
              background: canAfford2 ? "rgba(129,140,248,0.06)" : "transparent",
              color: canAfford2 ? "#818cf8" : "rgba(20,20,40,0.20)",
              fontSize: "12px", fontFamily: "'Noto Serif KR', serif",
              cursor: canAfford2 ? "pointer" : "default",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
            }}>
              <span>🔓</span>
              <span>{canAfford2 ? `${HINT_COSTS[1]}P로 열기` : `포인트 부족 (${HINT_COSTS[1]}P)`}</span>
            </button>
          )}
        </div>

        {/* Hint 3 */}
        <div>
          <div style={{ fontSize: "10px", color: "rgba(20,20,40,0.40)", marginBottom: "5px", letterSpacing: "0.1em", fontFamily: "'Noto Serif KR', serif" }}>
            힌트 3 — 글자 공개
          </div>
          {hintLevel >= 3 ? (
            <div style={{
              padding: "10px 12px", borderRadius: "12px",
              background: "rgba(251,191,36,0.08)", borderLeft: "3px solid #fbbf24",
              display: "flex", alignItems: "center", gap: "10px",
            }}>
              <div style={{
                width: "36px", height: "36px", borderRadius: "10px",
                background: "rgba(251,191,36,0.15)", border: "2px solid #fbbf24",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "18px", fontWeight: "800", color: "#fbbf24", fontFamily: "'Noto Serif KR', serif",
              }}>{word.hint3char.char}</div>
              <div style={{ fontSize: "12px", color: "rgba(20,20,40,0.60)", fontFamily: "'Noto Serif KR', serif" }}>
                {word.hint3char.index + 1}번째 글자: <span style={{ color: "#fbbf24", fontWeight: "700" }}>'{word.hint3char.char}'</span>
              </div>
            </div>
          ) : (
            <button onClick={() => canAfford3 && hintLevel >= 2 && onUnlockHint(3)} style={{
              width: "100%", padding: "11px", borderRadius: "12px",
              border: `1px dashed ${(canAfford3 && hintLevel >= 2) ? "rgba(251,191,36,0.4)" : "rgba(20,20,40,0.08)"}`,
              background: (canAfford3 && hintLevel >= 2) ? "rgba(251,191,36,0.06)" : "transparent",
              color: (canAfford3 && hintLevel >= 2) ? "#fbbf24" : "rgba(20,20,40,0.20)",
              fontSize: "12px", fontFamily: "'Noto Serif KR', serif",
              cursor: (canAfford3 && hintLevel >= 2) ? "pointer" : "default",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
            }}>
              <span>🔓</span>
              <span>{hintLevel < 2 ? "힌트 2를 먼저 열어주세요" : canAfford3 ? `${HINT_COSTS[2]}P로 열기` : `포인트 부족 (${HINT_COSTS[2]}P)`}</span>
            </button>
          )}
        </div>

        <div style={{
          marginTop: "18px", paddingTop: "14px", borderTop: "1px solid rgba(20,20,40,0.05)",
          textAlign: "center",
        }}>
          <span style={{ fontSize: "12px", color: "rgba(20,20,40,0.40)", fontFamily: "'Noto Serif KR', serif" }}>보유 </span>
          <span style={{ fontSize: "16px", fontWeight: "800", color: "#fbbf24", fontFamily: "'Noto Serif KR', serif" }}>{points}P</span>
        </div>
      </div>
    </div>
  );
};

/* ── Reactive Hint Display (below avatar) ── */
const ReactiveHintArea = ({ word, wordIndex, hintLevel, isSolved, accentColor, onOpenModal }) => {
  const [animKey, setAnimKey] = useState(0);
  const prevWordRef = useRef(wordIndex);

  useEffect(() => {
    if (wordIndex !== prevWordRef.current) {
      setAnimKey(k => k + 1);
      prevWordRef.current = wordIndex;
    }
  }, [wordIndex]);

  if (!word) return null;

  if (isSolved) {
    return (
      <div key={`solved-${animKey}`} style={{
        padding: "14px 18px", borderRadius: "16px",
        background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.15)",
        textAlign: "center", animation: "hintFade 0.35s ease",
      }}>
        <div style={{ fontSize: "13px", color: "#22c55e", fontWeight: "600", fontFamily: "'Noto Serif KR', serif" }}>
          ✓ 「{word.word}」 완성
        </div>
      </div>
    );
  }

  return (
    <div key={`hint-${animKey}`} style={{
      padding: "14px 18px", borderRadius: "16px",
      background: "rgba(20,20,40,0.04)",
      border: `1px solid ${accentColor}20`,
      animation: "hintFade 0.35s ease",
      cursor: "pointer",
      transition: "border-color 0.2s ease",
    }}
      onClick={onOpenModal}
    >
      {/* Top line: direction + word length */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: "8px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{
            padding: "2px 8px", borderRadius: "6px",
            background: `${accentColor}20`, color: accentColor,
            fontSize: "10px", fontWeight: "700", fontFamily: "'Noto Serif KR', serif",
          }}>
            {word.direction === "across" ? "가로 →" : "세로 ↓"}
          </span>
          <span style={{ fontSize: "10px", color: "rgba(20,20,40,0.40)", fontFamily: "'Noto Serif KR', serif" }}>
            {word.word.length}글자
          </span>
        </div>
        {/* Hint level dots + more hints button */}
        <div style={{
          display: "flex", alignItems: "center", gap: "6px",
        }}>
          <div style={{ display: "flex", gap: "3px" }}>
            {[1, 2, 3].map(l => (
              <div key={l} style={{
                width: "6px", height: "6px", borderRadius: "50%",
                background: (hintLevel || 1) >= l
                  ? l === 1 ? accentColor : l === 2 ? "#818cf8" : "#fbbf24"
                  : "rgba(20,20,40,0.10)",
                transition: "all 0.3s ease",
              }} />
            ))}
          </div>
          <span style={{
            fontSize: "10px", color: accentColor, fontFamily: "'Noto Serif KR', serif",
            opacity: 0.7,
          }}>더보기 ›</span>
        </div>
      </div>

      {/* Main clue text */}
      <div style={{
        fontSize: "14px", color: "rgba(20,20,40,0.85)", lineHeight: "1.7",
        fontFamily: "'Noto Serif KR', serif",
      }}>
        {word.clue}
      </div>

      {/* Show hint2 inline if unlocked */}
      {(hintLevel || 1) >= 2 && (
        <div style={{
          marginTop: "8px", paddingTop: "8px",
          borderTop: "1px solid rgba(20,20,40,0.05)",
          fontSize: "13px", color: "rgba(129,140,248,0.85)", lineHeight: "1.6",
          fontFamily: "'Noto Serif KR', serif", fontStyle: "italic",
        }}>
          {word.hint2}
        </div>
      )}

      {/* Show hint3 inline if unlocked */}
      {(hintLevel || 1) >= 3 && (
        <div style={{
          marginTop: "8px", paddingTop: "8px",
          borderTop: "1px solid rgba(20,20,40,0.05)",
          display: "flex", alignItems: "center", gap: "8px",
        }}>
          <div style={{
            width: "28px", height: "28px", borderRadius: "8px",
            background: "rgba(251,191,36,0.15)", border: "1.5px solid #fbbf24",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "15px", fontWeight: "800", color: "#fbbf24", fontFamily: "'Noto Serif KR', serif",
          }}>{word.hint3char.char}</div>
          <span style={{ fontSize: "12px", color: "rgba(20,20,40,0.50)", fontFamily: "'Noto Serif KR', serif" }}>
            {word.hint3char.index + 1}번째 글자
          </span>
        </div>
      )}
    </div>
  );
};

/* ── Korean character utils ── */
const isCompleteKorean = (ch) => {
  if (!ch || ch.length !== 1) return false;
  const code = ch.charCodeAt(0);
  return code >= 0xAC00 && code <= 0xD7A3;
};
const isKoreanJamo = (ch) => {
  if (!ch || ch.length !== 1) return false;
  const code = ch.charCodeAt(0);
  return (code >= 0x3131 && code <= 0x3163) || (code >= 0x1100 && code <= 0x11FF);
};

/* ── Crossword Grid ── */
const CrosswordGrid = ({ chapter, onComplete, isCompleted, points, setPoints, selectedWord, setSelectedWord, hintLevels, setHintLevels, solved, setSolved }) => {
  const { crossword } = chapter;

  // ──── State ────
  const [grid, setGrid] = useState({});
  const [selectedCell, setSelectedCell] = useState(null);
  const [showCorrect, setShowCorrect] = useState(false);
  const [revealedChars, setRevealedChars] = useState({});
  const [hintModal, setHintModal] = useState(null);
  const [wrongCells, setWrongCells] = useState(new Set());

  // ──── Refs (always-fresh values for use in callbacks) ────
  const inputRef = useRef(null);
  const inputOriginCell = useRef(null);
  const gridRef = useRef({});
  const solvedRef = useRef({});
  const selectedWordRef = useRef(selectedWord);
  const composingRef = useRef(false);
  const wrongTimerRef = useRef(null);

  // Sync refs on every render (cheap, no useEffect delay)
  gridRef.current = grid;
  solvedRef.current = solved;
  selectedWordRef.current = selectedWord;

  // ──── Pure helpers (no state dependencies, computed from crossword data) ────

  // Build cell map: key "row-col" → { char, words: [{wordIndex, charIndex}] }
  const cellMap = (() => {
    const map = {};
    crossword.words.forEach((w, wi) => {
      w.word.split("").forEach((ch, ci) => {
        const r = w.direction === "across" ? w.row : w.row + ci;
        const c = w.direction === "across" ? w.col + ci : w.col;
        const key = `${r}-${c}`;
        if (!map[key]) map[key] = { char: ch, words: [] };
        map[key].words.push({ wordIndex: wi, charIndex: ci });
      });
    });
    return map;
  })();

  // Get all cell keys for a word by index
  const getWordKeys = (wordIndex) => {
    const w = crossword.words[wordIndex];
    return w.word.split("").map((_, ci) => {
      const r = w.direction === "across" ? w.row : w.row + ci;
      const c = w.direction === "across" ? w.col + ci : w.col;
      return `${r}-${c}`;
    });
  };

  // Check if a word is correctly filled in a given grid
  const isWordCorrect = (wordIndex, g) => {
    const w = crossword.words[wordIndex];
    return getWordKeys(wordIndex).every((k, ci) => g[k] === w.word[ci]);
  };

  // Check if a cell belongs to any solved word
  const isCellLocked = (key) => {
    const info = cellMap[key];
    if (!info) return false;
    return info.words.some(w => solvedRef.current[w.wordIndex]) || !!revealedChars[key];
  };

  // Get cell keys from origin to end of the selected word
  const getCellKeysFromOrigin = () => {
    const origin = inputOriginCell.current;
    const sw = selectedWordRef.current;
    if (!origin || sw === null) return [];
    const info = cellMap[origin];
    const entry = info?.words.find(we => we.wordIndex === sw);
    if (!entry) return [];
    const w = crossword.words[sw];
    const keys = [];
    for (let ci = entry.charIndex; ci < w.word.length; ci++) {
      const r = w.direction === "across" ? w.row : w.row + ci;
      const c = w.direction === "across" ? w.col + ci : w.col;
      keys.push(`${r}-${c}`);
    }
    return keys;
  };

  const getPrevCellKey = (key) => {
    const sw = selectedWordRef.current;
    if (sw === null) return null;
    const info = cellMap[key];
    const entry = info?.words.find(we => we.wordIndex === sw);
    if (entry && entry.charIndex > 0) {
      const w = crossword.words[sw];
      const ci = entry.charIndex - 1;
      const r = w.direction === "across" ? w.row : w.row + ci;
      const c = w.direction === "across" ? w.col + ci : w.col;
      return `${r}-${c}`;
    }
    return null;
  };

  // ──── Answer checking ────

  // Check for correct answers only. Called on every input event.
  // Safe to call during composition (intermediate chars won't match answers).
  const checkCorrectAnswers = (currentGrid) => {
    const curSolved = { ...solvedRef.current };
    let newlySolved = 0;
    let lockedGrid = { ...currentGrid };

    crossword.words.forEach((_, wi) => {
      if (curSolved[wi]) return;
      if (isWordCorrect(wi, currentGrid)) {
        curSolved[wi] = true;
        newlySolved++;
        const w = crossword.words[wi];
        getWordKeys(wi).forEach((k, ci) => {
          lockedGrid[k] = w.word[ci];
        });
      }
    });

    if (newlySolved > 0) {
      solvedRef.current = curSolved;
      gridRef.current = lockedGrid;
      setGrid({ ...lockedGrid });
      setSolved({ ...curSolved });
      setPoints(p => p + 50 * newlySolved);

      if (inputRef.current) inputRef.current.value = "";
      inputOriginCell.current = null;

      // Cancel any pending wrong-answer feedback
      if (wrongTimerRef.current) {
        clearTimeout(wrongTimerRef.current);
        wrongTimerRef.current = null;
        setWrongCells(new Set());
      }
      if (wrongCheckTimerRef.current) {
        clearTimeout(wrongCheckTimerRef.current);
        wrongCheckTimerRef.current = null;
      }
    }

    if (Object.keys(curSolved).length === crossword.words.length) {
      setShowCorrect(true);
      setTimeout(() => onComplete(), 1200);
    }
  };

  // Check for wrong answers. Only called AFTER composition ends, via debounce.
  const checkWrongAnswer = () => {
    const curSolved = solvedRef.current;
    const sw = selectedWordRef.current;
    const currentGrid = gridRef.current;

    if (sw === null || curSolved[sw]) return;

    const swKeys = getWordKeys(sw);
    const allFilled = swKeys.every(k => currentGrid[k] && isCompleteKorean(currentGrid[k]));
    if (!allFilled) return;

    // Double-check it's actually wrong (not a race with correct check)
    if (isWordCorrect(sw, currentGrid)) return;

    const wrongKeys = swKeys.filter(k => {
      const info = cellMap[k];
      return !info?.words.some(we => curSolved[we.wordIndex]);
    });

    if (wrongKeys.length > 0) {
      setWrongCells(new Set(wrongKeys));
      wrongTimerRef.current = setTimeout(() => {
        wrongTimerRef.current = null;
        const clearGrid = { ...gridRef.current };
        wrongKeys.forEach(k => { clearGrid[k] = ""; });
        gridRef.current = clearGrid;
        setGrid({ ...clearGrid });
        setWrongCells(new Set());
        if (inputRef.current) inputRef.current.value = "";
      }, 800);
    }
  };

  // Schedule a wrong-answer check. Debounced to avoid firing during composition.
  const wrongCheckTimerRef = useRef(null);
  const scheduleWrongCheck = () => {
    if (wrongCheckTimerRef.current) clearTimeout(wrongCheckTimerRef.current);
    wrongCheckTimerRef.current = setTimeout(() => {
      wrongCheckTimerRef.current = null;
      if (!composingRef.current) {
        checkWrongAnswer();
      }
    }, 150);
  };

  // ──── Input handling ────

  const distributeInput = (inputValue) => {
    const origin = inputOriginCell.current;
    if (!origin) return;

    const allKeys = getCellKeysFromOrigin();
    if (allKeys.length === 0) return;

    const editableKeys = allKeys.filter(k => !isCellLocked(k));
    if (editableKeys.length === 0) {
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    const chars = [...inputValue];
    const completed = [];
    let pending = "";

    for (const ch of chars) {
      if (isCompleteKorean(ch) || /^[a-zA-Z0-9]$/.test(ch)) {
        completed.push(ch);
      } else {
        pending = ch;
      }
    }

    const newGrid = { ...gridRef.current };
    for (let i = 0; i < editableKeys.length; i++) {
      const k = editableKeys[i];
      if (i < completed.length) {
        newGrid[k] = completed[i];
      } else if (i === completed.length && pending) {
        newGrid[k] = pending;
      } else if (i === completed.length && !pending) {
        newGrid[k] = "";
      }
    }

    gridRef.current = newGrid;
    setGrid({ ...newGrid });

    const curIdx = Math.min(completed.length, editableKeys.length - 1);
    setSelectedCell(editableKeys[curIdx]);

    // Always check for correct answers immediately
    checkCorrectAnswers(newGrid);

    // Schedule wrong-answer check (will only run after composition ends)
    if (!composingRef.current) {
      scheduleWrongCheck();
    }
  };

  const handleInput = () => {
    const el = inputRef.current;
    if (!el) return;
    distributeInput(el.value);
  };

  const handleCompositionStart = () => {
    composingRef.current = true;
    // Cancel any pending wrong check
    if (wrongCheckTimerRef.current) {
      clearTimeout(wrongCheckTimerRef.current);
      wrongCheckTimerRef.current = null;
    }
  };

  const handleCompositionEnd = () => {
    composingRef.current = false;
    scheduleWrongCheck();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Backspace" && inputRef.current) {
      const val = inputRef.current.value;
      if (val.length === 0) {
        e.preventDefault();
        const origin = inputOriginCell.current;
        if (!origin) return;
        const prevKey = getPrevCellKey(origin);
        if (prevKey && !isCellLocked(prevKey)) {
          const newGrid = { ...gridRef.current, [prevKey]: "" };
          gridRef.current = newGrid;
          setGrid({ ...newGrid });
          setSelectedCell(prevKey);
          inputOriginCell.current = prevKey;
        }
      }
    }
  };

  // ──── Cell selection ────

  const selectCell = (key) => {
    if (isCompleted) return;
    const info = cellMap[key];
    if (!info) return;

    // Determine which word
    let wordIdx = selectedWordRef.current;
    if (wordIdx !== null) {
      const cur = info.words.find(w => w.wordIndex === wordIdx);
      if (!cur) wordIdx = info.words[0].wordIndex;
    } else {
      wordIdx = info.words[0].wordIndex;
    }
    setSelectedWord(wordIdx);
    selectedWordRef.current = wordIdx;

    // Find first editable cell if clicked cell is locked
    let targetKey = key;
    if (isCellLocked(key)) {
      const w = crossword.words[wordIdx];
      let found = false;
      for (let ci = 0; ci < w.word.length; ci++) {
        const r = w.direction === "across" ? w.row : w.row + ci;
        const c = w.direction === "across" ? w.col + ci : w.col;
        const ck = `${r}-${c}`;
        if (!isCellLocked(ck)) { targetKey = ck; found = true; break; }
      }
      if (!found) { setSelectedCell(key); return; } // entire word solved
    }

    setSelectedCell(targetKey);
    inputOriginCell.current = targetKey;
    if (inputRef.current) { inputRef.current.value = ""; inputRef.current.focus(); }
  };

  // ──── Hint unlock ────

  const handleUnlockHint = (level) => {
    const cost = HINT_COSTS[level - 1];
    if (points < cost) return;
    setPoints(p => p - cost);
    setHintLevels(h => ({ ...h, [hintModal]: Math.max(h[hintModal] || 1, level) }));

    if (level === 3) {
      const w = crossword.words[hintModal];
      const ci = w.hint3char.index;
      const r = w.direction === "across" ? w.row : w.row + ci;
      const c = w.direction === "across" ? w.col + ci : w.col;
      const cellKey = `${r}-${c}`;
      const newGrid = { ...grid, [cellKey]: w.hint3char.char };
      gridRef.current = newGrid;
      setGrid(newGrid);
      setRevealedChars(rc => ({ ...rc, [cellKey]: true }));
      checkCorrectAnswers(newGrid);
    }
  };

  // ──── Computed for rendering ────

  const highlighted = (() => {
    if (selectedWord === null) return new Set();
    return new Set(getWordKeys(selectedWord));
  })();

  // ──── Render ────
  return (
    <div style={{ position: "relative" }}>
      {/* Single hidden input */}
      <input
        ref={inputRef}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false}
        inputMode="text"
        style={{
          position: "fixed", bottom: "-100px", left: 0,
          opacity: 0, width: "1px", height: "1px",
          border: "none", padding: 0, fontSize: "16px",
        }}
      />

      {/* Reactive hint area */}
      <div style={{ marginBottom: "20px" }}>
        {selectedWord !== null ? (
          <ReactiveHintArea
            word={crossword.words[selectedWord]}
            wordIndex={selectedWord}
            hintLevel={hintLevels[selectedWord]}
            isSolved={!!solved[selectedWord]}
            accentColor={chapter.accentColor}
            onOpenModal={() => setHintModal(selectedWord)}
          />
        ) : (
          <div style={{
            padding: "14px 18px", borderRadius: "16px",
            background: "rgba(20,20,40,0.03)", border: "1px solid rgba(20,20,40,0.06)",
            textAlign: "center",
          }}>
            <div style={{
              fontSize: "13px", color: "rgba(20,20,40,0.40)",
              fontFamily: "'Noto Serif KR', serif", lineHeight: "1.7",
            }}>
              {chapter.narrativeIntro.split("\n").map((line, i) => (
                <span key={i}>{line}<br /></span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Word pills */}
      <div style={{
        display: "flex", gap: "6px", marginBottom: "16px",
        flexWrap: "wrap", justifyContent: "center",
      }}>
        {crossword.words.map((w, i) => (
          <button key={i} onClick={() => {
            const cellKey = `${w.row}-${w.col}`;
            setSelectedWord(i);
            selectedWordRef.current = i;
            setSelectedCell(cellKey);
            inputOriginCell.current = cellKey;
            if (inputRef.current) { inputRef.current.value = ""; inputRef.current.focus(); }
          }} style={{
            padding: "5px 10px", borderRadius: "10px", border: "none",
            background: solved[i] ? "rgba(34,197,94,0.15)" : selectedWord === i ? `${chapter.accentColor}25` : "rgba(20,20,40,0.06)",
            color: solved[i] ? "#22c55e" : selectedWord === i ? chapter.accentColor : "rgba(20,20,40,0.50)",
            fontSize: "11px", fontWeight: "600", cursor: "pointer",
            fontFamily: "'Noto Serif KR', serif", transition: "all 0.2s ease",
            display: "flex", alignItems: "center", gap: "4px",
          }}>
            <span>{i + 1}</span>
            <span style={{ fontSize: "9px", opacity: 0.7 }}>{w.direction === "across" ? "→" : "↓"}</span>
            {solved[i] && <span>✓</span>}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div style={{
        display: "grid", gridTemplateColumns: `repeat(${crossword.size}, 1fr)`,
        gap: "3px", maxWidth: "350px", margin: "0 auto",
      }}>
        {Array.from({ length: crossword.size }).map((_, r) =>
          Array.from({ length: crossword.size }).map((_, c) => {
            const key = `${r}-${c}`;
            const cell = cellMap[key];
            if (!cell) {
              return <div key={key} style={{
                width: "100%", aspectRatio: "1",
                background: "rgba(0,0,0,0.04)", borderRadius: "4px",
              }} />;
            }
            const isSolved = cell.words.some(w => solved[w.wordIndex]);
            const isRevealed = revealedChars[key];
            const isHighlighted = highlighted.has(key);
            const isSelected = selectedCell === key;
            const cellValue = grid[key] || "";
            const isJamo = cellValue && isKoreanJamo(cellValue);
            const isWrong = wrongCells.has(key);

            return (
              <div key={key} onClick={() => selectCell(key)} style={{
                width: "100%", aspectRatio: "1",
                background: isWrong ? "rgba(239,68,68,0.25)"
                  : showCorrect && isSolved ? "rgba(34,197,94,0.3)"
                  : isRevealed ? "rgba(251,191,36,0.12)"
                  : isSelected ? "rgba(20,20,40,0.22)"
                  : isHighlighted ? "rgba(20,20,40,0.10)"
                  : "rgba(20,20,40,0.05)",
                border: isWrong ? "2px solid rgba(239,68,68,0.6)"
                  : isSelected ? `2px solid ${chapter.accentColor}`
                  : isRevealed ? "1px solid rgba(251,191,36,0.3)"
                  : `1px solid rgba(20,20,40,0.12)`,
                borderRadius: "6px",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", position: "relative",
                transition: "all 0.15s ease",
                userSelect: "none",
                animation: isWrong ? "shake 0.4s ease" : "none",
              }}>
                {cell.words.some(w => w.charIndex === 0) && (
                  <span style={{
                    position: "absolute", top: "1px", left: "3px", fontSize: "7px",
                    color: "rgba(20,20,40,0.45)", fontFamily: "'Noto Serif KR', serif",
                    fontWeight: "700",
                  }}>
                    {cell.words.find(w => w.charIndex === 0).wordIndex + 1}
                  </span>
                )}
                <span style={{
                  fontSize: "18px", fontWeight: "600",
                  fontFamily: "'Noto Serif KR', serif",
                  color: isWrong ? "#ef4444"
                    : isSolved ? "#16a34a"
                    : isRevealed ? "#d97706"
                    : isJamo ? chapter.accentColor
                    : "#1a1a2e",
                  opacity: isJamo ? 0.7 : 1,
                }}>
                  {cellValue}
                </span>
                {isSelected && !cellValue && (
                  <span style={{
                    position: "absolute", bottom: "25%",
                    width: "14px", height: "2px", borderRadius: "1px",
                    background: chapter.accentColor,
                    animation: "blink 1s step-end infinite",
                  }} />
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Hint Modal */}
      {hintModal !== null && (
        <HintModal
          word={crossword.words[hintModal]}
          hintLevel={hintLevels[hintModal] || 1}
          points={points}
          onUnlockHint={handleUnlockHint}
          onClose={() => setHintModal(null)}
          accentColor={chapter.accentColor}
        />
      )}
    </div>
  );
};
/* ── Collection Card ── */
const CollectionCard = ({ word, definition, rarity, chapterTitle, index, onReview }) => {
  const config = RARITY_CONFIG[rarity];
  return (
    <div onClick={onReview} style={{
      background: config.bg, border: `1px solid ${config.color}40`,
      borderRadius: "16px", padding: "20px", position: "relative", overflow: "hidden",
      animation: `fadeSlideIn 0.5s ease ${index * 0.15}s both`,
      cursor: onReview ? "pointer" : "default",
      transition: "transform 0.15s ease",
    }}>
      <div style={{
        position: "absolute", top: "12px", right: "14px",
        fontSize: "10px", fontWeight: "700", letterSpacing: "0.1em",
        color: config.color, fontFamily: "'Noto Serif KR', serif",
        background: `${config.color}20`, padding: "3px 8px", borderRadius: "6px",
      }}>{config.label}</div>
      <div style={{
        fontSize: "28px", fontWeight: "800", color: config.color,
        fontFamily: "'Noto Serif KR', serif", marginBottom: "8px",
      }}>{word}</div>
      <div style={{
        fontSize: "13px", lineHeight: "1.6", color: "rgba(20,20,40,0.70)",
        fontFamily: "'Noto Serif KR', serif",
      }}>{definition}</div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px" }}>
        <span style={{
          fontSize: "10px", color: "rgba(20,20,40,0.45)",
          fontFamily: "'Noto Serif KR', serif",
        }}>수집 챕터: {chapterTitle}</span>
        {onReview && <span style={{
          fontSize: "10px", color: config.color, fontWeight: "600",
          background: `${config.color}15`, padding: "3px 8px", borderRadius: "8px",
        }}>복기하기 →</span>}
      </div>
    </div>
  );
};

/* ── Review Modal (completed puzzle review) ── */
const ReviewModal = ({ chapterIndex, hintLevels, onClose }) => {
  const chapter = CHAPTERS[chapterIndex];
  const { crossword } = chapter;
  const [selectedWord, setSelectedWord] = useState(null);

  const cellMap = (() => {
    const map = {};
    crossword.words.forEach((w, wi) => {
      w.word.split("").forEach((ch, ci) => {
        const r = w.direction === "across" ? w.row : w.row + ci;
        const c = w.direction === "across" ? w.col + ci : w.col;
        const key = `${r}-${c}`;
        if (!map[key]) map[key] = { char: ch, words: [] };
        map[key].words.push({ wordIndex: wi, charIndex: ci });
      });
    });
    return map;
  })();

  const highlighted = (() => {
    if (selectedWord === null) return new Set();
    const w = crossword.words[selectedWord];
    const cells = new Set();
    w.word.split("").forEach((_, ci) => {
      const r = w.direction === "across" ? w.row : w.row + ci;
      const c = w.direction === "across" ? w.col + ci : w.col;
      cells.add(`${r}-${c}`);
    });
    return cells;
  })();

  const hintLabel = (level) => {
    if (!level || level <= 1) return { text: "힌트 없이 풀었어요", color: "#22c55e", icon: "✦" };
    if (level === 2) return { text: "예문 힌트 사용", color: "#818cf8", icon: "📖" };
    return { text: "글자 힌트 사용", color: "#fbbf24", icon: "💡" };
  };

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 1000,
      display: "flex", alignItems: "center", justifyContent: "center",
      animation: "fadeIn 0.2s ease",
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: "92%", maxWidth: "400px", maxHeight: "90vh", overflowY: "auto",
        background: "#ffffff", borderRadius: "24px", padding: "28px 22px",
        border: `1px solid ${chapter.accentColor}30`,
        boxShadow: "0 24px 80px rgba(0,0,0,0.12)",
      }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <div style={{ fontSize: "10px", color: chapter.accentColor, letterSpacing: "0.15em", fontWeight: "700", marginBottom: "6px" }}>
            퍼즐 복기
          </div>
          <div style={{ fontSize: "18px", fontWeight: "800" }}>{chapter.title}</div>
          <div style={{ fontSize: "11px", color: "rgba(20,20,40,0.50)", marginTop: "2px" }}>{chapter.subtitle}</div>
        </div>

        {/* Completed grid */}
        <div style={{
          display: "grid", gridTemplateColumns: `repeat(${crossword.size}, 1fr)`,
          gap: "3px", maxWidth: "280px", margin: "0 auto 20px",
        }}>
          {Array.from({ length: crossword.size }).map((_, r) =>
            Array.from({ length: crossword.size }).map((_, c) => {
              const key = `${r}-${c}`;
              const cell = cellMap[key];
              if (!cell) return <div key={key} style={{ width: "100%", aspectRatio: "1", background: "rgba(0,0,0,0.04)", borderRadius: "4px" }} />;
              const isHighlighted = highlighted.has(key);
              const hl = selectedWord !== null ? hintLabel(hintLevels[selectedWord]) : null;
              return (
                <div key={key} onClick={() => {
                  const wi = cell.words[0].wordIndex;
                  setSelectedWord(selectedWord === wi ? null : wi);
                }} style={{
                  width: "100%", aspectRatio: "1",
                  background: isHighlighted ? `${hl?.color || chapter.accentColor}20` : "rgba(20,20,40,0.05)",
                  border: isHighlighted ? `1.5px solid ${hl?.color || chapter.accentColor}60` : "1px solid rgba(20,20,40,0.10)",
                  borderRadius: "5px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", position: "relative", transition: "all 0.2s ease",
                }}>
                  {cell.words.some(w => w.charIndex === 0) && (
                    <span style={{
                      position: "absolute", top: "1px", left: "2px", fontSize: "6px",
                      color: "rgba(20,20,40,0.40)", fontWeight: "700",
                    }}>{cell.words.find(w => w.charIndex === 0).wordIndex + 1}</span>
                  )}
                  <span style={{
                    fontSize: "15px", fontWeight: "600",
                    color: isHighlighted ? (hl?.color || "#1a1a2e") : "#16a34a",
                  }}>{cell.char}</span>
                </div>
              );
            })
          )}
        </div>

        {/* Word list with hint info */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {crossword.words.map((w, i) => {
            const hl = hintLabel(hintLevels[i]);
            const isActive = selectedWord === i;
            return (
              <div key={i} onClick={() => setSelectedWord(isActive ? null : i)} style={{
                padding: "12px 14px", borderRadius: "12px", cursor: "pointer",
                background: isActive ? `${hl.color}12` : "rgba(20,20,40,0.03)",
                border: isActive ? `1px solid ${hl.color}30` : "1px solid rgba(20,20,40,0.06)",
                transition: "all 0.2s ease",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{
                      fontSize: "10px", fontWeight: "700", color: "rgba(20,20,40,0.40)",
                      background: "rgba(20,20,40,0.06)", padding: "2px 6px", borderRadius: "4px",
                    }}>{i + 1} {w.direction === "across" ? "→" : "↓"}</span>
                    <span style={{ fontSize: "16px", fontWeight: "700", color: "#1a1a2e" }}>{w.word}</span>
                  </div>
                  <span style={{ fontSize: "11px" }}>{hl.icon}</span>
                </div>
                <div style={{ fontSize: "11px", color: "rgba(20,20,40,0.50)", marginBottom: "4px" }}>{w.clue}</div>
                <div style={{ fontSize: "10px", color: hl.color, fontWeight: "600" }}>{hl.text}</div>
              </div>
            );
          })}
        </div>

        {/* Close */}
        <button onClick={onClose} style={{
          width: "100%", marginTop: "20px", padding: "12px",
          borderRadius: "14px", border: "none",
          background: "rgba(20,20,40,0.08)", color: "rgba(20,20,40,0.50)",
          fontSize: "13px", fontWeight: "600", cursor: "pointer",
          fontFamily: "'Noto Serif KR', serif",
        }}>닫기</button>
      </div>
    </div>
  );
};

/* ── Main ── */
export default function WordJourneyGame() {
  const [currentChapter, setCurrentChapter] = useState(0);
  const [completedChapters, setCompletedChapters] = useState([]);
  const [collection, setCollection] = useState([]);
  const [view, setView] = useState("game");
  const [showChapterComplete, setShowChapterComplete] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [points, setPoints] = useState(100);
  const [selectedWord, setSelectedWord] = useState(null);
  const [hintLevels, setHintLevels] = useState({});
  const [solved, setSolved] = useState({});
  const [reviewItem, setReviewItem] = useState(null);

  const chapter = CHAPTERS[currentChapter];
  const avatarMood = gameComplete ? 3 : completedChapters.length > 0 ? CHAPTERS[completedChapters[completedChapters.length - 1]].avatarMood : 0;

  const handleChapterComplete = () => {
    const ch = CHAPTERS[currentChapter];
    setCompletedChapters([...completedChapters, currentChapter]);
    setCollection([...collection, {
      word: ch.crossword.collectibleWord, definition: ch.crossword.collectibleDef,
      rarity: ch.crossword.collectibleRarity, chapterTitle: ch.title,
      chapterIndex: currentChapter, hintLevels: { ...hintLevels },
    }]);
    setPoints(p => p + 100);
    setShowChapterComplete(true);
    if (currentChapter === CHAPTERS.length - 1) setTimeout(() => setGameComplete(true), 2000);
  };

  const nextChapter = () => {
    setShowChapterComplete(false);
    setSelectedWord(null);
    setHintLevels({});
    setSolved({});
    if (currentChapter < CHAPTERS.length - 1) setCurrentChapter(currentChapter + 1);
  };

  const progressPercent = (completedChapters.length / CHAPTERS.length) * 100;
  const solvedCount = Object.keys(solved).length;
  const totalWords = chapter.crossword.words.length;

  return (
    <div style={{ minHeight: "100vh", background: "#f8f7f4", color: "#1a1a2e", fontFamily: "'Noto Serif KR', serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@300;400;600;700;800;900&display=swap');
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes hintFade { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes pulseGlow { 0%, 100% { box-shadow: 0 0 0 0 rgba(251,191,36,0); } 50% { box-shadow: 0 0 20px 4px rgba(251,191,36,0.15); } }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 20% { transform: translateX(-4px); } 40% { transform: translateX(4px); } 60% { transform: translateX(-3px); } 80% { transform: translateX(3px); } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input { font-family: 'Noto Serif KR', serif; }
      `}</style>

      {/* Header */}
      <div style={{
        padding: "16px 20px 12px",
        borderBottom: "1px solid rgba(20,20,40,0.05)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div>
          <div style={{
            fontSize: "16px", fontWeight: "800", letterSpacing: "-0.02em",
            background: "linear-gradient(135deg, #fbbf24, #f59e0b, #d97706)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>단어의 여정</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: "4px",
            padding: "4px 10px", borderRadius: "14px",
            background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.15)",
          }}>
            <span style={{ fontSize: "12px" }}>✦</span>
            <span style={{ fontSize: "13px", fontWeight: "800", color: "#fbbf24" }}>{points}</span>
          </div>
          <div style={{ display: "flex", gap: "3px" }}>
            {[
              { key: "game", label: "퍼즐" },
              { key: "collection", label: `수집 ${collection.length}` },
              { key: "story", label: "이야기" },
            ].map(v => (
              <button key={v.key} onClick={() => setView(v.key)} style={{
                padding: "5px 10px", borderRadius: "16px", border: "none",
                fontSize: "11px", fontWeight: "600", cursor: "pointer",
                fontFamily: "'Noto Serif KR', serif",
                background: view === v.key ? "rgba(20,20,40,0.12)" : "transparent",
                color: view === v.key ? "#1a1a2e" : "rgba(20,20,40,0.45)",
              }}>
                {v.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Progress */}
      <div style={{ padding: "0 20px", marginTop: "10px" }}>
        <div style={{ height: "2px", borderRadius: "1px", background: "rgba(20,20,40,0.05)", overflow: "hidden" }}>
          <div style={{
            height: "100%", borderRadius: "1px",
            background: "linear-gradient(90deg, #94a3b8, #818cf8, #f59e0b)",
            width: `${progressPercent}%`, transition: "width 1s ease",
          }} />
        </div>
        <div style={{
          display: "flex", justifyContent: "space-between",
          marginTop: "4px", fontSize: "9px", color: "rgba(20,20,40,0.35)",
        }}>
          <span>챕터 {currentChapter + 1}/{CHAPTERS.length}</span>
          <span>{solvedCount}/{totalWords} 단어</span>
        </div>
      </div>

      <div style={{ display: view === "game" ? "block" : "none", padding: "16px 20px 24px" }}>
          {/* Avatar compact */}
          <div style={{ textAlign: "center", marginBottom: "14px" }}>
            <div style={{ animation: showChapterComplete ? "float 2s ease infinite" : "none" }}>
              <Avatar mood={avatarMood} size={80} />
            </div>
            <div style={{
              fontSize: "16px", fontWeight: "800", marginTop: "8px",
              color: "rgba(20,20,40,0.90)", letterSpacing: "-0.02em",
            }}>{chapter.title}</div>
            <div style={{
              fontSize: "11px", marginTop: "2px",
              color: "rgba(20,20,40,0.45)", fontStyle: "italic",
            }}>{chapter.subtitle}</div>
          </div>

          {/* Chapter Complete Overlay */}
          {showChapterComplete && (
            <div style={{
              position: "fixed", inset: 0, zIndex: 50,
              background: "rgba(0,0,0,0.4)",
              display: "flex", alignItems: "center", justifyContent: "center",
              animation: "fadeIn 0.4s ease",
            }}>
              <div style={{
                textAlign: "center", padding: "36px 28px", maxWidth: "360px",
                maxHeight: "90vh", overflowY: "auto",
                background: "#ffffff", borderRadius: "24px",
                boxShadow: "0 24px 80px rgba(0,0,0,0.15)",
                width: "90%",
              }}>
                {/* Illustration */}
                <div style={{
                  fontSize: "56px", marginBottom: "16px",
                  animation: "float 3s ease infinite",
                  filter: "drop-shadow(0 4px 20px rgba(20,20,40,0.10))",
                }}>{chapter.completionIllust}</div>

                {/* Completion Narrative */}
                <div style={{
                  fontSize: "13px", lineHeight: "2", color: "rgba(20,20,40,0.55)",
                  marginBottom: "24px", fontStyle: "italic",
                  animation: "fadeSlideIn 0.6s ease 0.2s both",
                }}>
                  {chapter.completionNarrative.split("\n").map((line, i) => (
                    <span key={i}>{line}<br /></span>
                  ))}
                </div>

                {/* Divider */}
                <div style={{
                  width: "40px", height: "1px", margin: "0 auto 20px",
                  background: `linear-gradient(90deg, transparent, ${chapter.accentColor}80, transparent)`,
                }} />

                {/* Collectible Word */}
                <div style={{
                  fontSize: "11px", letterSpacing: "0.2em",
                  color: RARITY_CONFIG[chapter.crossword.collectibleRarity].color, marginBottom: "8px",
                  animation: "fadeSlideIn 0.5s ease 0.4s both",
                }}>✦ 단어 수집 ✦</div>
                <div style={{
                  fontSize: "32px", fontWeight: "900",
                  color: RARITY_CONFIG[chapter.crossword.collectibleRarity].color,
                  marginBottom: "10px",
                  animation: "fadeSlideIn 0.5s ease 0.5s both",
                }}>{chapter.crossword.collectibleWord}</div>
                <div style={{
                  fontSize: "12px", lineHeight: "1.7",
                  color: "rgba(20,20,40,0.50)", marginBottom: "8px",
                  animation: "fadeSlideIn 0.5s ease 0.6s both",
                }}>{chapter.crossword.collectibleDef}</div>
                <div style={{
                  display: "inline-flex", gap: "8px", alignItems: "center",
                  marginBottom: "24px",
                  animation: "fadeSlideIn 0.5s ease 0.7s both",
                }}>
                  <span style={{
                    padding: "3px 10px", borderRadius: "8px",
                    fontSize: "10px", fontWeight: "700",
                    color: RARITY_CONFIG[chapter.crossword.collectibleRarity].color,
                    background: RARITY_CONFIG[chapter.crossword.collectibleRarity].bg,
                  }}>{RARITY_CONFIG[chapter.crossword.collectibleRarity].label}</span>
                  <span style={{ fontSize: "11px", color: "#22c55e", fontWeight: "600" }}>
                    +100P
                  </span>
                </div>

                {/* Action */}
                <div style={{ animation: "fadeSlideIn 0.5s ease 0.8s both" }}>
                  {gameComplete ? (
                    <div>
                      <div style={{ marginBottom: "16px" }}><Avatar mood={3} size={80} /></div>
                      <div style={{ fontSize: "15px", fontWeight: "700", color: "#fbbf24", marginBottom: "6px" }}>여정이 끝났습니다</div>
                      <div style={{ fontSize: "12px", color: "rgba(20,20,40,0.55)", marginBottom: "20px", lineHeight: "1.7" }}>
                        모든 단어를 되찾았습니다.<br />당신의 아바타가 다시 웃고 있습니다.
                      </div>
                      <button onClick={() => { setShowChapterComplete(false); setView("collection"); }} style={{
                        padding: "12px 28px", borderRadius: "24px", border: "none",
                        background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
                        color: "#1a1a1a", fontWeight: "700", fontSize: "14px",
                        cursor: "pointer", fontFamily: "'Noto Serif KR', serif",
                      }}>수집 목록 보기</button>
                    </div>
                  ) : (
                    <button onClick={nextChapter} style={{
                      padding: "12px 28px", borderRadius: "24px", border: "none",
                      background: `linear-gradient(135deg, ${chapter.accentColor}, ${chapter.accentColor}cc)`,
                      color: "#1a1a2e", fontWeight: "700", fontSize: "14px",
                      cursor: "pointer", fontFamily: "'Noto Serif KR', serif",
                    }}>다음 챕터 →</button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Crossword (includes reactive hint area) */}
          {!gameComplete && (
            <CrosswordGrid
              key={currentChapter}
              chapter={chapter}
              onComplete={handleChapterComplete}
              isCompleted={completedChapters.includes(currentChapter)}
              points={points} setPoints={setPoints}
              selectedWord={selectedWord} setSelectedWord={setSelectedWord}
              hintLevels={hintLevels} setHintLevels={setHintLevels}
              solved={solved} setSolved={setSolved}
            />
          )}

          {gameComplete && !showChapterComplete && (
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              <Avatar mood={3} size={120} />
              <div style={{
                fontSize: "20px", fontWeight: "800", marginTop: "16px",
                background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>여정 완료</div>
              <div style={{ fontSize: "12px", color: "rgba(20,20,40,0.50)", marginTop: "6px" }}>
                {collection.length}개의 단어를 수집했습니다
              </div>
              <button onClick={() => setView("collection")} style={{
                marginTop: "16px", padding: "12px 28px", borderRadius: "24px", border: "none",
                background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
                color: "#1a1a1a", fontWeight: "700", fontSize: "14px",
                cursor: "pointer", fontFamily: "'Noto Serif KR', serif",
              }}>수집 목록 보기</button>
            </div>
          )}
        </div>

      {view === "collection" && (
        <div style={{ padding: "24px 20px", animation: "fadeSlideIn 0.4s ease" }}>
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <div style={{ fontSize: "18px", fontWeight: "800", marginBottom: "4px" }}>나의 어휘 수집</div>
            <div style={{ fontSize: "11px", color: "rgba(20,20,40,0.40)" }}>
              {collection.length} / {CHAPTERS.length} 단어 수집됨
            </div>
          </div>
          {collection.length === 0 ? (
            <div style={{ textAlign: "center", padding: "50px 20px", color: "rgba(20,20,40,0.35)", fontSize: "13px" }}>
              아직 수집한 단어가 없습니다.<br />퍼즐을 풀어 단어를 수집하세요.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {collection.map((item, i) => <CollectionCard key={i} index={i} {...item} onReview={() => setReviewItem(item)} />)}
            </div>
          )}
          {collection.length > 0 && (
            <div style={{
              marginTop: "20px", padding: "18px",
              background: "rgba(20,20,40,0.03)", borderRadius: "16px", textAlign: "center",
            }}>
              <div style={{ fontSize: "10px", color: "rgba(20,20,40,0.35)", marginBottom: "8px", letterSpacing: "0.1em" }}>공유하기</div>
              <div style={{
                fontSize: "12px", color: "rgba(20,20,40,0.60)", lineHeight: "1.8",
                padding: "10px", background: "rgba(20,20,40,0.03)",
                borderRadius: "10px", fontFamily: "'Noto Serif KR', serif",
              }}>
                🌅 단어의 여정을 완주했습니다<br />
                수집한 어휘: {collection.map(c => c.word).join(", ")}<br />
                {collection.filter(c => c.rarity === "legendary").length > 0 && "✦ 전설 등급 단어 보유 ✦"}
                <br />#단어의여정 #어휘수집
              </div>
            </div>
          )}
        </div>
      )}

      {/* Review Modal */}
      {reviewItem && (
        <ReviewModal
          chapterIndex={reviewItem.chapterIndex}
          hintLevels={reviewItem.hintLevels}
          onClose={() => setReviewItem(null)}
        />
      )}

      {/* Story View */}
      {view === "story" && (
        <div style={{ padding: "24px 0", animation: "fadeSlideIn 0.4s ease" }}>
          {/* Header */}
          <div style={{ textAlign: "center", padding: "0 20px 28px" }}>
            <div style={{ fontSize: "18px", fontWeight: "800", marginBottom: "4px" }}>단어의 여정</div>
            <div style={{ fontSize: "11px", color: "rgba(20,20,40,0.40)" }}>
              {completedChapters.length}개의 장을 펼쳤습니다
            </div>
          </div>

          {completedChapters.length === 0 ? (
            <div style={{ textAlign: "center", padding: "50px 20px", color: "rgba(20,20,40,0.35)", fontSize: "13px" }}>
              아직 펼쳐진 이야기가 없습니다.<br />퍼즐을 풀어 이야기를 이어가세요.
            </div>
          ) : (
            <div style={{ position: "relative" }}>
              {/* Timeline line */}
              <div style={{
                position: "absolute", left: "29px", top: "0", bottom: "0", width: "1px",
                background: "linear-gradient(180deg, rgba(20,20,40,0.08), rgba(20,20,40,0.03))",
              }} />

              {CHAPTERS.map((ch, i) => {
                const isCompleted = completedChapters.includes(i);
                const isLocked = !isCompleted;
                const rarityConfig = isCompleted ? RARITY_CONFIG[ch.crossword.collectibleRarity] : null;

                return (
                  <div key={ch.id} style={{
                    position: "relative", padding: "0 20px 0 56px",
                    marginBottom: i < CHAPTERS.length - 1 ? "0" : "20px",
                    animation: isCompleted ? `fadeSlideIn 0.5s ease ${i * 0.1}s both` : "none",
                  }}>
                    {/* Timeline dot */}
                    <div style={{
                      position: "absolute", left: "22px", top: "4px",
                      width: "15px", height: "15px", borderRadius: "50%",
                      background: isCompleted ? ch.accentColor : "rgba(20,20,40,0.08)",
                      border: isCompleted ? "none" : "1px solid rgba(20,20,40,0.10)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "7px",
                    }}>
                      {isCompleted && "✦"}
                    </div>

                    {isLocked ? (
                      /* Locked chapter - minimal */
                      <div style={{ padding: "4px 0 24px" }}>
                        <div style={{
                          fontSize: "12px", fontWeight: "600",
                          color: "rgba(20,20,40,0.15)",
                        }}>{ch.title}</div>
                        <div style={{
                          fontSize: "10px", color: "rgba(20,20,40,0.08)",
                          marginTop: "2px",
                        }}>아직 열리지 않은 이야기</div>
                      </div>
                    ) : (
                      /* Completed chapter - full story card */
                      <div style={{ paddingBottom: "32px" }}>
                        {/* Chapter label */}
                        <div style={{
                          fontSize: "9px", fontWeight: "700", letterSpacing: "0.15em",
                          color: ch.accentColor, marginBottom: "6px", textTransform: "uppercase",
                        }}>Chapter {ch.id}</div>

                        {/* Illustration */}
                        <div style={{
                          fontSize: "40px", margin: "8px 0 16px",
                          filter: "drop-shadow(0 2px 12px rgba(20,20,40,0.05))",
                        }}>{ch.completionIllust}</div>

                        {/* Title */}
                        <div style={{
                          fontSize: "17px", fontWeight: "800", color: "rgba(20,20,40,0.90)",
                          marginBottom: "2px",
                        }}>{ch.title}</div>
                        <div style={{
                          fontSize: "11px", color: "rgba(20,20,40,0.40)",
                          fontStyle: "italic", marginBottom: "14px",
                        }}>{ch.subtitle}</div>

                        {/* Narrative */}
                        <div style={{
                          fontSize: "13px", lineHeight: "2.0", color: "rgba(20,20,40,0.50)",
                          marginBottom: "16px", paddingRight: "12px",
                        }}>
                          {ch.completionNarrative.split("\n").map((line, li) => (
                            <span key={li}>{line}<br /></span>
                          ))}
                        </div>

                        {/* Collected word tag */}
                        <div style={{
                          display: "inline-flex", alignItems: "center", gap: "8px",
                          padding: "6px 14px", borderRadius: "10px",
                          background: `${rarityConfig.color}10`,
                          border: `1px solid ${rarityConfig.color}20`,
                        }}>
                          <span style={{
                            fontSize: "15px", fontWeight: "800", color: rarityConfig.color,
                          }}>{ch.crossword.collectibleWord}</span>
                          <span style={{
                            fontSize: "9px", fontWeight: "700", color: rarityConfig.color,
                            background: `${rarityConfig.color}15`, padding: "2px 6px", borderRadius: "4px",
                          }}>{rarityConfig.label}</span>
                        </div>

                        {/* Separator */}
                        {i < CHAPTERS.length - 1 && completedChapters.includes(i + 1) && (
                          <div style={{
                            margin: "28px 0 0",
                            height: "1px",
                            background: `linear-gradient(90deg, ${ch.accentColor}30, transparent)`,
                          }} />
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Epilogue - only when all complete */}
              {completedChapters.length === CHAPTERS.length && (
                <div style={{
                  textAlign: "center", padding: "20px 20px 40px",
                  animation: "fadeSlideIn 0.6s ease 1s both",
                }}>
                  <div style={{
                    width: "40px", height: "1px", margin: "0 auto 20px",
                    background: "linear-gradient(90deg, transparent, #fbbf2480, transparent)",
                  }} />
                  <div style={{ fontSize: "32px", marginBottom: "12px" }}>🌅</div>
                  <div style={{
                    fontSize: "15px", fontWeight: "800",
                    background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                    marginBottom: "8px",
                  }}>여정의 끝, 그리고 시작</div>
                  <div style={{
                    fontSize: "12px", lineHeight: "2.0", color: "rgba(20,20,40,0.50)",
                    maxWidth: "280px", margin: "0 auto",
                  }}>
                    잊혀졌던 {CHAPTERS.length * 4}개의 단어가<br />
                    다시 제자리를 찾았습니다.<br />
                    당신의 여정이 하나의 이야기가 되었습니다.
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
