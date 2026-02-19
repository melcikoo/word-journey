"""Crossword layout engine for placing Korean words on an NxN grid.

Supports grid sizes from 5x5 to 10x10. Uses backtracking search with
intersection-based placement to arrange words into valid crossword layouts.
"""

from __future__ import annotations

import random
from itertools import combinations
from typing import Optional


def find_shared_chars(word1: str, word2: str) -> list[tuple[int, int, str]]:
    """Find all shared syllable positions between two Korean words.

    Returns list of (idx_in_word1, idx_in_word2, shared_char).
    """
    result = []
    for i, c1 in enumerate(word1):
        for j, c2 in enumerate(word2):
            if c1 == c2:
                result.append((i, j, c1))
    return result


def _can_place(grid: list[list[str | None]], word: str, row: int, col: int,
               direction: str, grid_size: int) -> bool:
    """Check if a word can be placed at given position without conflicts."""
    chars = list(word)
    for i, ch in enumerate(chars):
        r = row + (i if direction == "down" else 0)
        c = col + (i if direction == "across" else 0)
        if r < 0 or r >= grid_size or c < 0 or c >= grid_size:
            return False
        cell = grid[r][c]
        if cell is not None and cell != ch:
            return False
    return True


def _place_word(grid: list[list[str | None]], word: str, row: int, col: int,
                direction: str) -> list[tuple[int, int, str | None]]:
    """Place a word on the grid. Returns list of (r, c, old_value) for undo."""
    undo = []
    for i, ch in enumerate(word):
        r = row + (i if direction == "down" else 0)
        c = col + (i if direction == "across" else 0)
        undo.append((r, c, grid[r][c]))
        grid[r][c] = ch
    return undo


def _undo_place(grid: list[list[str | None]], undo: list[tuple[int, int, str | None]]):
    """Undo a word placement."""
    for r, c, old in undo:
        grid[r][c] = old


def _has_intersection(grid: list[list[str | None]], word: str, row: int, col: int,
                      direction: str) -> bool:
    """Check if placing this word creates at least one intersection with existing words."""
    for i, ch in enumerate(word):
        r = row + (i if direction == "down" else 0)
        c = col + (i if direction == "across" else 0)
        if grid[r][c] == ch:
            return True
    return False


def _check_adjacency(grid: list[list[str | None]], word: str, row: int, col: int,
                     direction: str, grid_size: int) -> bool:
    """Check that the word doesn't create unwanted parallel adjacency.

    Allows intentional intersections (same character at crossing) but prevents
    words from running in parallel in adjacent rows/columns, which would create
    unintended "bonus words" in the grid.
    """
    chars = list(word)
    for i, ch in enumerate(chars):
        r = row + (i if direction == "down" else 0)
        c = col + (i if direction == "across" else 0)

        # Skip intersection cells (these are intentional)
        if grid[r][c] is not None:
            continue

        # Check perpendicular neighbors for non-intersection cells
        if direction == "across":
            for dr in [-1, 1]:
                nr = r + dr
                if 0 <= nr < grid_size and grid[nr][c] is not None:
                    return False
        else:
            for dc in [-1, 1]:
                nc = c + dc
                if 0 <= nc < grid_size and grid[r][nc] is not None:
                    return False

    return True


def _find_placement_options(grid: list[list[str | None]], word: str,
                            grid_size: int, must_intersect: bool) -> list[tuple[int, int, str]]:
    """Find all valid positions for a word on the grid.

    Returns list of (row, col, direction) options.
    """
    options = []
    for direction in ["across", "down"]:
        for r in range(grid_size):
            for c in range(grid_size):
                if not _can_place(grid, word, r, c, direction, grid_size):
                    continue
                if must_intersect and not _has_intersection(grid, word, r, c, direction):
                    continue
                if not _check_adjacency(grid, word, r, c, direction, grid_size):
                    continue
                options.append((r, c, direction))
    return options


def _backtrack_place(grid: list[list[str | None]], words: list[str],
                     idx: int, placements: list[dict], grid_size: int) -> bool:
    """Recursively try to place all words using backtracking."""
    if idx >= len(words):
        return True

    word = words[idx]
    must_intersect = idx > 0  # First word can go anywhere
    options = _find_placement_options(grid, word, grid_size, must_intersect)

    # Shuffle options for variety
    random.shuffle(options)

    for row, col, direction in options:
        undo = _place_word(grid, word, row, col, direction)
        placements.append({"word": word, "row": row, "col": col, "direction": direction})

        if _backtrack_place(grid, words, idx + 1, placements, grid_size):
            return True

        placements.pop()
        _undo_place(grid, undo)

    return False


def place_crossword(words: list[dict], grid_size: int = 5,
                    max_attempts: int = 100) -> dict | None:
    """Place words on an NxN grid.

    Args:
        words: List of word dicts with at least a 'word' key.
        grid_size: Grid dimension (5-10).
        max_attempts: Maximum shuffle+backtrack attempts.

    Returns:
        Dict with 'size' and 'placements' list, or None on failure.
        Each placement: {word, row, col, direction}.
    """
    if grid_size < 5 or grid_size > 10:
        raise ValueError(f"grid_size must be 5-10, got {grid_size}")

    word_strings = [w["word"] for w in words]

    # Validate all words fit in grid
    for w in word_strings:
        if len(w) > grid_size:
            raise ValueError(f"Word '{w}' ({len(w)} chars) exceeds grid_size {grid_size}")

    for attempt in range(max_attempts):
        grid = [[None] * grid_size for _ in range(grid_size)]
        placements = []

        # Shuffle word order for variety (but keep attempting different orderings)
        order = list(range(len(word_strings)))
        random.shuffle(order)
        shuffled = [word_strings[i] for i in order]

        if _backtrack_place(grid, shuffled, 0, placements, grid_size):
            # Map placements back to original word dicts
            result_placements = []
            for p in placements:
                original = next(w for w in words if w["word"] == p["word"])
                result_placements.append({
                    **original,
                    "row": p["row"],
                    "col": p["col"],
                    "direction": p["direction"],
                })
            return {"size": grid_size, "placements": result_placements}

    return None


def validate_placement(placement: dict) -> tuple[bool, str]:
    """Validate a crossword placement for correctness.

    Returns (is_valid, error_message).
    """
    size = placement["size"]
    grid = [[None] * size for _ in range(size)]

    for p in placement["placements"]:
        word = p["word"]
        row, col = p["row"], p["col"]
        direction = p["direction"]

        for i, ch in enumerate(word):
            r = row + (i if direction == "down" else 0)
            c = col + (i if direction == "across" else 0)

            if r >= size or c >= size:
                return False, f"Word '{word}' goes out of bounds at ({r},{c})"

            if grid[r][c] is not None and grid[r][c] != ch:
                return False, f"Conflict at ({r},{c}): '{grid[r][c]}' vs '{ch}' for word '{word}'"

            grid[r][c] = ch

    # Check connectivity: all words should share at least one cell with another word
    if len(placement["placements"]) > 1:
        cells_per_word = []
        for p in placement["placements"]:
            cells = set()
            word = p["word"]
            row, col = p["row"], p["col"]
            direction = p["direction"]
            for i in range(len(word)):
                r = row + (i if direction == "down" else 0)
                c = col + (i if direction == "across" else 0)
                cells.add((r, c))
            cells_per_word.append(cells)

        # Build adjacency: words that share a cell
        adj = {i: set() for i in range(len(cells_per_word))}
        for i, j in combinations(range(len(cells_per_word)), 2):
            if cells_per_word[i] & cells_per_word[j]:
                adj[i].add(j)
                adj[j].add(i)

        # BFS to check connectivity
        visited = {0}
        queue = [0]
        while queue:
            node = queue.pop(0)
            for neighbor in adj[node]:
                if neighbor not in visited:
                    visited.add(neighbor)
                    queue.append(neighbor)

        if len(visited) != len(cells_per_word):
            return False, "Not all words are connected"

    return True, ""


def print_grid(placement: dict) -> str:
    """Print the grid as a string for debugging."""
    size = placement["size"]
    grid = [["." for _ in range(size)] for _ in range(size)]

    for p in placement["placements"]:
        word = p["word"]
        row, col = p["row"], p["col"]
        direction = p["direction"]
        for i, ch in enumerate(word):
            r = row + (i if direction == "down" else 0)
            c = col + (i if direction == "across" else 0)
            grid[r][c] = ch

    lines = []
    for row in grid:
        lines.append(" ".join(row))
    return "\n".join(lines)
