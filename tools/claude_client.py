"""Claude API client for extracting Korean crossword words from narrative text."""

import json
import anthropic


def _build_prompt(narrative: str, difficulty: int, word_count: int, grid_size: int) -> str:
    max_word_len = 3 if grid_size <= 6 else 4
    extra = word_count  # request 2x for fallback

    return f"""당신은 한국어 한자어 단어 전문가이자 십자낱말 퍼즐 설계자입니다.

주어진 서사(narrative)를 읽고, 그 분위기와 감정에 어울리는 한자어 단어들을 추출해주세요.
이 단어들은 {grid_size}x{grid_size} 크로스워드 퍼즐에 배치됩니다.

## 서사
\"\"\"
{narrative}
\"\"\"

## 요구사항

### 단어 추출 ({word_count + extra}개)
- 단어 길이: 2~{max_word_len}글자 한자어만
- 서사의 분위기/감정과 밀접하게 연관된 단어
- **중요**: 단어들 사이에 공유되는 한글 음절이 있어야 합니다 (크로스워드 교차용)
  예: "공허"와 "허무"는 "허"를 공유, "허무"와 "무심"은 "무"를 공유
- 최소 {word_count}개는 체인처럼 연결 가능해야 함 (word1↔word2↔word3...)
- 난이도 {difficulty}/5: {"일상적이고 쉬운 단어" if difficulty <= 2 else "보통 난이도의 단어" if difficulty == 3 else "추상적이고 고급스러운 단어"}

### 챕터 메타데이터
서사에 어울리는 챕터 제목과 부제, 완료 시 내러티브도 제안해주세요.

## 응답 형식 (반드시 이 JSON 형식만 출력)
```json
{{
  "words": [
    {{
      "word": "공허",
      "hanja": "空虛",
      "definition": "마음속이 텅 비어 있는 느낌",
      "exampleSentence": "성공을 이뤘지만 마음은 ○○했다."
    }}
  ],
  "metadata": {{
    "title": "잿빛 새벽",
    "subtitle": "아무것도 느끼지 못하는 날들",
    "completionIllust": "🌫️",
    "completionNarrative": "텅 빈 새벽,\\n처음으로 무언가를 느꼈다.\\n그것이 비록 공허일지라도.",
    "suggestedCollectible": "공허",
    "collectibleReason": "서사의 핵심 감정을 대표"
  }}
}}
```

정확히 {word_count + extra}개의 단어를 제공해주세요. JSON만 출력하고 다른 텍스트는 포함하지 마세요."""


def generate_words(
    narrative: str,
    difficulty: int,
    word_count: int,
    grid_size: int,
    api_key: str,
) -> dict:
    """Call Claude API to extract Korean words from narrative.

    Returns dict with 'words' list and 'metadata' dict.
    """
    client = anthropic.Anthropic(api_key=api_key)

    prompt = _build_prompt(narrative, difficulty, word_count, grid_size)

    message = client.messages.create(
        model="claude-sonnet-4-5-20250514",
        max_tokens=4000,
        messages=[{"role": "user", "content": prompt}],
    )

    response_text = message.content[0].text

    # Extract JSON from response (handle possible markdown code blocks)
    text = response_text.strip()
    if text.startswith("```"):
        # Remove markdown code fences
        lines = text.split("\n")
        lines = [l for l in lines if not l.strip().startswith("```")]
        text = "\n".join(lines)

    data = json.loads(text)

    # Validate structure
    if "words" not in data:
        raise ValueError("Claude response missing 'words' field")
    if "metadata" not in data:
        raise ValueError("Claude response missing 'metadata' field")

    for w in data["words"]:
        for field in ("word", "hanja", "definition", "exampleSentence"):
            if field not in w:
                raise ValueError(f"Word entry missing '{field}' field: {w}")

    return data
