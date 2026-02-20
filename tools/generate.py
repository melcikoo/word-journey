#!/usr/bin/env python3
"""Word Journey crossword puzzle generator.

Usage:
    python generate.py \\
        --narrative "내러티브 문장..." \\
        --difficulty 3 \\
        --count 2 \\
        --api-key sk-ant-xxx

    # Or with environment variable:
    export ANTHROPIC_API_KEY=sk-ant-xxx
    python generate.py --narrative "..." --difficulty 3 --count 2
"""

from __future__ import annotations

import argparse
import json
import os
import sys

from claude_client import generate_words
from crossword_engine import place_crossword, validate_placement, print_grid
from formatter import format_chapter, format_as_json
from preview import generate_preview


def get_word_count(difficulty: int, grid_size: int, explicit_count: int | None) -> int:
    """Determine word count based on difficulty and grid size."""
    if explicit_count is not None:
        return explicit_count

    # Default word counts by difficulty (for 5x5)
    base_counts = {1: 3, 2: 3, 3: 4, 4: 5, 5: 5}
    base = base_counts[difficulty]

    # Scale up for larger grids
    if grid_size > 5:
        extra = (grid_size - 5) * 1  # +1 word per grid size increase
        base = min(base + extra, grid_size * 2)

    return base


def main():
    parser = argparse.ArgumentParser(
        description="Generate crossword puzzles for Word Journey",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Basic usage (3 puzzles, difficulty 2, 5x5 grid)
  python generate.py --narrative "서사 텍스트" --difficulty 2 --count 3

  # Larger grid with more words
  python generate.py --narrative "서사 텍스트" --difficulty 4 --count 1 --grid-size 7

  # Custom word count
  python generate.py --narrative "서사 텍스트" --difficulty 3 --count 2 --word-count 6 --grid-size 8
        """,
    )
    parser.add_argument("--narrative", required=True, help="Korean narrative text for word extraction")
    parser.add_argument("--difficulty", type=int, required=True, choices=[1, 2, 3, 4, 5],
                        help="Difficulty level (1=easy, 5=hard)")
    parser.add_argument("--count", type=int, default=1, help="Number of puzzles to generate (default: 1)")
    parser.add_argument("--grid-size", type=int, default=5, choices=range(5, 11),
                        metavar="5-10", help="Grid size NxN (default: 5, max: 10)")
    parser.add_argument("--word-count", type=int, default=None,
                        help="Override word count per puzzle (default: auto based on difficulty)")
    parser.add_argument("--start-id", type=int, default=11,
                        help="Starting chapter ID (default: 11)")
    parser.add_argument("--api-key", default=None,
                        help="Anthropic API key (or set ANTHROPIC_API_KEY env var)")
    parser.add_argument("--output-dir", default="output",
                        help="Output directory (default: output)")

    args = parser.parse_args()

    # Resolve API key
    api_key = args.api_key or os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        print("Error: API key required. Use --api-key or set ANTHROPIC_API_KEY env var.", file=sys.stderr)
        sys.exit(1)

    word_count = get_word_count(args.difficulty, args.grid_size, args.word_count)

    print(f"=== Word Journey Puzzle Generator ===")
    print(f"Narrative: {args.narrative[:60]}...")
    print(f"Difficulty: {args.difficulty}/5")
    print(f"Grid: {args.grid_size}x{args.grid_size}")
    print(f"Words per puzzle: {word_count}")
    print(f"Puzzles to generate: {args.count}")
    print()

    # Step 1: Extract words from Claude
    print("[1/4] Calling Claude API for word extraction...")
    try:
        claude_result = generate_words(
            narrative=args.narrative,
            difficulty=args.difficulty,
            word_count=word_count,
            grid_size=args.grid_size,
            api_key=api_key,
        )
    except Exception as e:
        print(f"Error calling Claude API: {e}", file=sys.stderr)
        sys.exit(1)

    all_words = claude_result["words"]
    metadata = claude_result["metadata"]
    print(f"  Got {len(all_words)} words: {', '.join(w['word'] for w in all_words)}")
    print()

    # Step 2: Place crosswords
    print(f"[2/4] Placing words on {args.grid_size}x{args.grid_size} grid...")
    chapters = []
    used_words_sets = []  # Track which words each puzzle uses to avoid duplicates

    for i in range(args.count):
        print(f"  Puzzle {i + 1}/{args.count}...", end=" ")

        # Select word_count words, trying to use different ones for each puzzle
        available = [w for w in all_words if w["word"] not in
                     {ww for s in used_words_sets for ww in s}]
        if len(available) < word_count:
            # Fallback: reuse words if we've run out
            available = all_words

        selected = available[:word_count]

        placement = place_crossword(selected, grid_size=args.grid_size, max_attempts=100)

        if placement is None:
            # Try with different word combinations
            import random
            for retry in range(5):
                random.shuffle(all_words)
                selected = all_words[:word_count]
                placement = place_crossword(selected, grid_size=args.grid_size, max_attempts=50)
                if placement:
                    break

        if placement is None:
            print("FAILED (could not find valid placement)")
            continue

        # Validate
        is_valid, err = validate_placement(placement)
        if not is_valid:
            print(f"INVALID: {err}")
            continue

        print("OK")
        print(print_grid(placement))
        print()

        used_words_sets.append({p["word"] for p in placement["placements"]})

        # Step 3: Format as chapter
        chapter = format_chapter(
            placement=placement,
            word_data_list=all_words,
            metadata=metadata,
            narrative_intro=args.narrative,
            difficulty=args.difficulty,
            chapter_id=args.start_id + i,
        )
        chapters.append(chapter)

    if not chapters:
        print("Error: No puzzles were generated successfully.", file=sys.stderr)
        sys.exit(1)

    print(f"[3/4] Formatting {len(chapters)} chapter(s)...")

    # Write JSON output
    output_dir = os.path.join(os.path.dirname(__file__), args.output_dir)
    os.makedirs(output_dir, exist_ok=True)

    json_path = os.path.join(output_dir, "chapters.json")
    with open(json_path, "w", encoding="utf-8") as f:
        f.write(format_as_json(chapters))
    print(f"  JSON saved: {json_path}")

    # Step 4: Generate preview
    print("[4/4] Generating HTML preview...")
    preview_path = os.path.join(output_dir, "preview.html")
    generate_preview(chapters, preview_path)
    print(f"  Preview saved: {preview_path}")

    print()
    print("=== Done! ===")
    print(f"  Open {preview_path} in your browser to preview")
    print(f"  Copy JSON from {json_path} into CHAPTERS array in src/App.jsx")


if __name__ == "__main__":
    main()
