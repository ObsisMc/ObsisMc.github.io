# tools

Translation tooling for iBlog-astro, powered by Claude via the `md_translator` submodule.

## Setup

```bash
# Initialize submodule
git submodule update --init --recursive

# Install dependencies (run from repo root)
uv sync
```

Requires the [Claude Code CLI](https://claude.ai/code) (`claude`) to be installed and logged in.


## Usage

Run all commands from the **repo root**:

```bash
# Translate a single zh post (full, overwrites en/)
uv run python tools/translate.py one src/content/blog/zh/my-post.md

# Translate all zh posts (full, overwrites en/)
uv run python tools/translate.py all

# Incremental — only git-changed zh posts
uv run python tools/translate.py diff
```

Each command automatically generates an `excerpt` in the zh source file's front matter (if not already present) before translating.

## How it works

| Step | What happens |
|------|-------------|
| 1 | `summarize_excerpt` — generates `excerpt` in zh front matter if missing |
| 2 | `translate_md` (`one`/`all`) — full translation of zh → en |
| 2 | `increment_translation` (`diff`) — applies only git-changed sections to existing en translation |

## Structure

```
tools/
  translate.py        # Entry point (this repo)
  md_translator/      # Git submodule — LLM wrapper + translation logic
    src/md_translator/
      translate_md.py
      increment_translation.py
      summarize_excerpt.py
      llm/
        claude.py
        server.py
```
