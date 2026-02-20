#!/usr/bin/env python3
"""Test crossword engine with existing chapter data from word-journey."""

from crossword_engine import place_crossword, validate_placement, print_grid

# Existing chapter words from App.jsx
EXISTING_CHAPTERS = [
    # Chapter 1 - ACT 1 (3 words, 5x5)
    {
        "name": "Chapter 1: 잿빛 새벽",
        "words": [
            {"word": "공허"},
            {"word": "허무"},
            {"word": "무심"},
        ],
        "grid_size": 5,
    },
    # Chapter 2
    {
        "name": "Chapter 2: 고요한 밤",
        "words": [
            {"word": "고독"},
            {"word": "독백"},
            {"word": "백지"},
        ],
        "grid_size": 5,
    },
    # Chapter 3
    {
        "name": "Chapter 3: 멈춘 시계",
        "words": [
            {"word": "침묵"},
            {"word": "묵상"},
            {"word": "상념"},
        ],
        "grid_size": 5,
    },
    # Chapter 4 - ACT 2 (4 words, 5x5)
    {
        "name": "Chapter 4: 흐린 오후",
        "words": [
            {"word": "행동"},
            {"word": "감동적"},
            {"word": "감사"},
            {"word": "적막"},
        ],
        "grid_size": 5,
    },
    # Chapter 8 - ACT 3 (5 words, 5x5)
    {
        "name": "Chapter 8: 따뜻한 손",
        "words": [
            {"word": "평온"},
            {"word": "온기"},
            {"word": "기원"},
            {"word": "원만"},
            {"word": "만복"},
        ],
        "grid_size": 5,
    },
    # Chapter 10
    {
        "name": "Chapter 10: 새벽이 온다",
        "words": [
            {"word": "여명"},
            {"word": "명상"},
            {"word": "상생"},
            {"word": "생동"},
            {"word": "동행"},
        ],
        "grid_size": 5,
    },
]

# Test with larger grids
LARGER_GRID_TESTS = [
    {
        "name": "7x7 test with 6 words",
        "words": [
            {"word": "공허"},
            {"word": "허무"},
            {"word": "무심"},
            {"word": "심장"},
            {"word": "장벽"},
            {"word": "벽화"},
        ],
        "grid_size": 7,
    },
    {
        "name": "8x8 test with 4-char words",
        "words": [
            {"word": "여명"},
            {"word": "명상"},
            {"word": "상생"},
            {"word": "생동"},
            {"word": "동행"},
            {"word": "행복"},
            {"word": "복잡"},
        ],
        "grid_size": 8,
    },
]


def test_chapters(chapters):
    passed = 0
    failed = 0

    for ch in chapters:
        print(f"\n--- {ch['name']} (grid: {ch['grid_size']}x{ch['grid_size']}, words: {len(ch['words'])}) ---")
        print(f"  Words: {', '.join(w['word'] for w in ch['words'])}")

        result = place_crossword(ch["words"], grid_size=ch["grid_size"], max_attempts=100)

        if result is None:
            print("  FAILED: Could not place words")
            failed += 1
            continue

        is_valid, err = validate_placement(result)
        if not is_valid:
            print(f"  INVALID: {err}")
            failed += 1
            continue

        print(f"  Placement:")
        for line in print_grid(result).split("\n"):
            print(f"    {line}")

        print(f"  Details:")
        for p in result["placements"]:
            print(f"    '{p['word']}' {p['direction']} at ({p['row']},{p['col']})")

        passed += 1
        print("  PASSED")

    return passed, failed


if __name__ == "__main__":
    print("=" * 60)
    print("Testing with existing chapter words (5x5)")
    print("=" * 60)
    p1, f1 = test_chapters(EXISTING_CHAPTERS)

    print()
    print("=" * 60)
    print("Testing with larger grids")
    print("=" * 60)
    p2, f2 = test_chapters(LARGER_GRID_TESTS)

    total_passed = p1 + p2
    total_failed = f1 + f2
    print()
    print("=" * 60)
    print(f"Results: {total_passed} passed, {total_failed} failed out of {total_passed + total_failed}")
    print("=" * 60)
