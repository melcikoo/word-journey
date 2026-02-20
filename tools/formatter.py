"""Format crossword placement results into word-journey CHAPTERS JSON format."""

from __future__ import annotations

import json
import random

# Difficulty → ACT configuration mapping
ACT_CONFIGS = {
    1: {"avatarMood": 0, "rarity": "uncommon", "accentColors": ["#6b7280", "#4b5563", "#64748b"]},
    2: {"avatarMood": 0, "rarity": "uncommon", "accentColors": ["#6b7280", "#4b5563", "#64748b"]},
    3: {"avatarMood": 1, "rarity": "rare", "accentColors": ["#818cf8", "#60a5fa", "#a78bfa", "#34d399"]},
    4: {"avatarMood": 2, "rarity": "legendary", "accentColors": ["#fb923c", "#e879f9", "#f59e0b"]},
    5: {"avatarMood": 3, "rarity": "legendary", "accentColors": ["#fb923c", "#e879f9", "#f59e0b"]},
}


def _make_clue(word_data: dict) -> str:
    """Format clue string: 'definition. 漢字.'"""
    definition = word_data["definition"].rstrip(".")
    hanja = word_data["hanja"]
    return f"{definition}. {hanja}."


def _make_hint2(word_data: dict) -> str:
    """Format hint2 string with ○○ masking."""
    sentence = word_data["exampleSentence"]
    word = word_data["word"]
    # Replace the word with ○ marks
    masked = sentence.replace(word, "○" * len(word))
    # Ensure it's wrapped in quotes
    if not masked.startswith('"'):
        masked = f'"{masked}"'
    return masked


def _make_hint3char(word: str) -> dict:
    """Auto-select hint3 character (first character of the word)."""
    return {"index": 0, "char": word[0]}


def format_chapter(
    placement: dict,
    word_data_list: list[dict],
    metadata: dict,
    narrative_intro: str,
    difficulty: int,
    chapter_id: int = 11,
) -> dict:
    """Convert a crossword placement into a CHAPTERS-compatible dict.

    Args:
        placement: Output from crossword_engine.place_crossword().
        word_data_list: Original word data from Claude with hanja/definition/etc.
        metadata: Chapter metadata from Claude (title, subtitle, etc.).
        narrative_intro: The original narrative text (used as narrativeIntro).
        difficulty: 1-5 difficulty level.
        chapter_id: Chapter ID number.

    Returns:
        Dict in CHAPTERS format, ready for JSON export.
    """
    act_config = ACT_CONFIGS[difficulty]

    # Build word entries
    words = []
    for p in placement["placements"]:
        # Find matching word data
        wd = next((w for w in word_data_list if w["word"] == p["word"]), None)
        if wd is None:
            raise ValueError(f"No word data found for '{p['word']}'")

        words.append({
            "word": p["word"],
            "clue": _make_clue(wd),
            "hint2": _make_hint2(wd),
            "hint3char": _make_hint3char(p["word"]),
            "direction": p["direction"],
            "row": p["row"],
            "col": p["col"],
        })

    # Determine collectible word
    collectible_word_str = metadata.get("suggestedCollectible", words[0]["word"])
    collectible_data = next(
        (w for w in word_data_list if w["word"] == collectible_word_str),
        word_data_list[0],
    )

    return {
        "id": chapter_id,
        "title": metadata.get("title", f"Chapter {chapter_id}"),
        "subtitle": metadata.get("subtitle", ""),
        "avatarMood": act_config["avatarMood"],
        "accentColor": random.choice(act_config["accentColors"]),
        "narrativeIntro": narrative_intro.replace("\n", "\\n") if "\\n" not in narrative_intro else narrative_intro,
        "completionIllust": metadata.get("completionIllust", "✨"),
        "completionNarrative": metadata.get("completionNarrative", ""),
        "crossword": {
            "size": placement["size"],
            "words": words,
            "collectibleWord": collectible_data["word"],
            "collectibleDef": f"{collectible_data['hanja']} — {collectible_data['definition']}",
            "collectibleRarity": act_config["rarity"],
        },
    }


def format_as_js(chapters: list[dict]) -> str:
    """Format chapters as JavaScript code ready to paste into CHAPTERS array."""
    lines = []
    for ch in chapters:
        lines.append("  " + _dict_to_js(ch, indent=2))
    return ",\n".join(lines)


def _dict_to_js(obj, indent=2) -> str:
    """Convert dict to JS object literal string (not JSON — no key quoting for simple keys)."""
    # Use JSON for simplicity, since JS accepts JSON as valid object literals
    return json.dumps(obj, ensure_ascii=False, indent=indent)


def format_as_json(chapters: list[dict]) -> str:
    """Format chapters as JSON string."""
    return json.dumps(chapters, ensure_ascii=False, indent=2)
