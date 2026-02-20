"""Generate an HTML preview file for crossword puzzles."""

import json
import os

TEMPLATE_DIR = os.path.join(os.path.dirname(__file__), "templates")


def generate_preview(chapters: list[dict], output_path: str):
    """Generate a standalone HTML file showing crossword grid previews.

    Args:
        chapters: List of CHAPTERS-format dicts.
        output_path: Path to write the HTML file.
    """
    puzzles_html = []
    for ch in chapters:
        puzzles_html.append(_render_puzzle(ch))

    chapters_json = json.dumps(chapters, ensure_ascii=False, indent=2)

    html = f"""<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Word Journey - Puzzle Preview</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;700&display=swap');
  * {{ margin: 0; padding: 0; box-sizing: border-box; }}
  body {{
    font-family: 'Noto Serif KR', serif;
    background: #f8f7f4;
    color: #1a1a1a;
    padding: 40px 20px;
    max-width: 900px;
    margin: 0 auto;
  }}
  h1 {{
    text-align: center;
    font-size: 24px;
    margin-bottom: 8px;
  }}
  .subtitle {{
    text-align: center;
    color: #6b7280;
    font-size: 14px;
    margin-bottom: 40px;
  }}
  .puzzle {{
    background: white;
    border-radius: 16px;
    padding: 32px;
    margin-bottom: 32px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  }}
  .puzzle-header {{
    display: flex;
    align-items: baseline;
    gap: 12px;
    margin-bottom: 8px;
  }}
  .puzzle-header h2 {{
    font-size: 20px;
  }}
  .puzzle-header .chapter-id {{
    color: #9ca3af;
    font-size: 14px;
  }}
  .puzzle-subtitle {{
    color: #6b7280;
    font-size: 14px;
    margin-bottom: 20px;
  }}
  .puzzle-body {{
    display: flex;
    gap: 32px;
    flex-wrap: wrap;
  }}
  .grid-container {{
    flex-shrink: 0;
  }}
  .grid {{
    display: inline-grid;
    gap: 3px;
    background: #e5e7eb;
    padding: 3px;
    border-radius: 8px;
  }}
  .cell {{
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    font-weight: 700;
    border-radius: 4px;
    position: relative;
  }}
  .cell.filled {{
    background: white;
    color: #1a1a1a;
  }}
  .cell.empty {{
    background: #d1d5db;
  }}
  .cell.intersection {{
    background: #fef3c7;
  }}
  .cell .word-num {{
    position: absolute;
    top: 2px;
    left: 4px;
    font-size: 9px;
    color: #9ca3af;
    font-weight: 400;
  }}
  .clues {{
    flex: 1;
    min-width: 250px;
  }}
  .clues h3 {{
    font-size: 14px;
    color: #6b7280;
    margin-bottom: 8px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }}
  .clue-item {{
    margin-bottom: 12px;
    padding-left: 12px;
    border-left: 3px solid #e5e7eb;
  }}
  .clue-word {{
    font-weight: 700;
    font-size: 15px;
  }}
  .clue-text {{
    font-size: 13px;
    color: #4b5563;
    margin-top: 2px;
  }}
  .clue-hint2 {{
    font-size: 12px;
    color: #9ca3af;
    margin-top: 2px;
    font-style: italic;
  }}
  .meta-row {{
    display: flex;
    gap: 8px;
    margin-top: 16px;
    flex-wrap: wrap;
  }}
  .meta-tag {{
    font-size: 12px;
    padding: 4px 10px;
    border-radius: 12px;
    background: #f3f4f6;
    color: #6b7280;
  }}
  .json-section {{
    background: white;
    border-radius: 16px;
    padding: 32px;
    margin-top: 40px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  }}
  .json-section h2 {{
    font-size: 18px;
    margin-bottom: 16px;
  }}
  .json-block {{
    background: #1a1a2e;
    color: #e2e8f0;
    padding: 20px;
    border-radius: 8px;
    font-family: 'Courier New', monospace;
    font-size: 12px;
    line-height: 1.6;
    overflow-x: auto;
    white-space: pre;
    max-height: 500px;
    overflow-y: auto;
  }}
  .copy-btn {{
    display: inline-block;
    margin-top: 12px;
    padding: 10px 24px;
    background: #1a1a1a;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-family: 'Noto Serif KR', serif;
    font-size: 14px;
  }}
  .copy-btn:hover {{
    background: #333;
  }}
  .copy-btn.copied {{
    background: #16a34a;
  }}
</style>
</head>
<body>
<h1>Word Journey Puzzle Preview</h1>
<p class="subtitle">Generated crossword puzzles ready for CHAPTERS array</p>

{''.join(puzzles_html)}

<div class="json-section">
  <h2>CHAPTERS JSON</h2>
  <div class="json-block" id="json-output">{_escape_html(chapters_json)}</div>
  <button class="copy-btn" onclick="copyJSON(this)">Copy to Clipboard</button>
</div>

<script>
const chaptersJSON = {chapters_json};

function copyJSON(btn) {{
  const text = JSON.stringify(chaptersJSON, null, 2);
  navigator.clipboard.writeText(text).then(() => {{
    btn.textContent = 'Copied!';
    btn.classList.add('copied');
    setTimeout(() => {{
      btn.textContent = 'Copy to Clipboard';
      btn.classList.remove('copied');
    }}, 2000);
  }});
}}
</script>
</body>
</html>"""

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(html)


def _render_puzzle(chapter: dict) -> str:
    """Render a single puzzle as HTML."""
    cw = chapter["crossword"]
    size = cw["size"]

    # Build grid
    grid = [[None] * size for _ in range(size)]
    cell_words = [[[] for _ in range(size)] for _ in range(size)]
    word_numbers = {}  # (row, col) -> word number

    for i, w in enumerate(cw["words"]):
        word = w["word"]
        row, col = w["row"], w["col"]
        direction = w["direction"]
        start_key = (row, col)
        if start_key not in word_numbers:
            word_numbers[start_key] = i + 1

        for j, ch in enumerate(word):
            r = row + (j if direction == "down" else 0)
            c = col + (j if direction == "across" else 0)
            grid[r][c] = ch
            cell_words[r][c].append(i)

    # Render grid cells
    grid_html = f'<div class="grid" style="grid-template-columns: repeat({size}, 44px);">\n'
    for r in range(size):
        for c in range(size):
            ch = grid[r][c]
            if ch is None:
                grid_html += '  <div class="cell empty"></div>\n'
            else:
                is_intersection = len(cell_words[r][c]) > 1
                cls = "cell filled intersection" if is_intersection else "cell filled"
                num_html = ""
                if (r, c) in word_numbers:
                    num_html = f'<span class="word-num">{word_numbers[(r, c)]}</span>'
                grid_html += f'  <div class="{cls}">{num_html}{ch}</div>\n'
    grid_html += '</div>'

    # Render clues
    across_clues = []
    down_clues = []
    for i, w in enumerate(cw["words"]):
        entry = f"""<div class="clue-item">
  <div class="clue-word">{i + 1}. {w['word']}</div>
  <div class="clue-text">{w['clue']}</div>
  <div class="clue-hint2">{w.get('hint2', '')}</div>
</div>"""
        if w["direction"] == "across":
            across_clues.append(entry)
        else:
            down_clues.append(entry)

    clues_html = '<div class="clues">'
    if across_clues:
        clues_html += '<h3>Across (가로)</h3>' + "\n".join(across_clues)
    if down_clues:
        clues_html += '<h3>Down (세로)</h3>' + "\n".join(down_clues)
    clues_html += '</div>'

    # Meta tags
    rarity = cw.get("collectibleRarity", "")
    collectible = cw.get("collectibleWord", "")
    accent = chapter.get("accentColor", "")
    meta_html = f"""<div class="meta-row">
  <span class="meta-tag">Grid: {size}x{size}</span>
  <span class="meta-tag">Words: {len(cw['words'])}</span>
  <span class="meta-tag">Rarity: {rarity}</span>
  <span class="meta-tag">Collectible: {collectible}</span>
  <span class="meta-tag" style="background:{accent}22; color:{accent}">Accent: {accent}</span>
</div>"""

    return f"""<div class="puzzle">
  <div class="puzzle-header">
    <h2>{chapter.get('completionIllust', '')} {chapter.get('title', '')}</h2>
    <span class="chapter-id">Chapter {chapter.get('id', '?')}</span>
  </div>
  <div class="puzzle-subtitle">{chapter.get('subtitle', '')}</div>
  <div class="puzzle-body">
    <div class="grid-container">{grid_html}</div>
    {clues_html}
  </div>
  {meta_html}
</div>"""


def _escape_html(text: str) -> str:
    """Escape HTML special characters."""
    return (
        text.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
    )
