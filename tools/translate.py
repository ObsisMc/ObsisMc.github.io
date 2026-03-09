"""
Translation automation for iBlog-astro.

Usage:
  uv run python scripts/translate.py one <zh_file>
  uv run python scripts/translate.py all
  uv run python scripts/translate.py diff

  one <zh_file>  Full-translate one zh file → corresponding en/ folder (overwrite)
  all            Full-translate all zh/ files under src/content/ (overwrite)
  diff           Incremental — only git-changed zh/ files
"""

import sys
from pathlib import Path

from md_translator.translate_md import translate_md
from md_translator.increment_translation import process_file, get_changed_md_files
from md_translator.summarize_excerpt import summarize_file

REPO_ROOT = Path(__file__).parent.parent.resolve()
CONTENT_ROOT = REPO_ROOT / "src" / "content"


def en_dir_for(zh_file: Path) -> Path:
    return zh_file.parent.parent / "en"


def translate_one(zh_file: Path) -> bool:
    en_dir = en_dir_for(zh_file)
    en_dir.mkdir(parents=True, exist_ok=True)
    summarize_file(zh_file, force=False)
    print(f"[full] {zh_file.name} → {en_dir}/")
    try:
        translate_md(str(zh_file), str(en_dir))
        return True
    except SystemExit as e:
        return e.code == 0


def update_one(zh_file: Path) -> bool:
    en_dir = en_dir_for(zh_file)
    en_dir.mkdir(parents=True, exist_ok=True)
    english_file = en_dir / zh_file.name
    summarize_file(zh_file, force=False)
    print(f"[diff] {zh_file.name} → {en_dir}/")
    try:
        process_file(zh_file, english_file)
        return True
    except Exception as e:
        print(f"  FAILED: {e}")
        return False


def find_zh_files() -> list[Path]:
    return sorted(p for p in CONTENT_ROOT.rglob("*.md") if p.parent.name == "zh")


def cmd_one(zh_file_arg: str):
    zh_file = Path(zh_file_arg)
    if not zh_file.is_absolute():
        zh_file = REPO_ROOT / zh_file
    translate_one(zh_file)


def cmd_all():
    files = find_zh_files()
    if not files:
        print("No zh/ markdown files found.")
        return
    print(f"Translating {len(files)} file(s)...")
    ok = fail = 0
    for f in files:
        if translate_one(f):
            ok += 1
        else:
            print(f"  FAILED: {f}")
            fail += 1
    print(f"\nDone. OK: {ok}  Failed: {fail}")
    if fail:
        sys.exit(1)


def cmd_diff():
    files = find_zh_files()
    if not files:
        print("No zh/ markdown files found.")
        return
    zh_folder = CONTENT_ROOT / "blog" / "zh"
    changed = get_changed_md_files(zh_folder)
    if not changed:
        print("No changed .md files found.")
        return
    print(f"Updating {len(changed)} file(s)...")
    ok = fail = 0
    for f in sorted(changed):
        if update_one(f):
            ok += 1
        else:
            fail += 1
    print(f"\nDone. OK: {ok}  Failed: {fail}")
    if fail:
        sys.exit(1)


def main():
    args = sys.argv[1:]
    if not args:
        print(__doc__)
        sys.exit(1)

    match args[0]:
        case "one":
            if len(args) < 2:
                print("Usage: translate.py one <zh_file>")
                sys.exit(1)
            cmd_one(args[1])
        case "all":
            cmd_all()
        case "diff":
            cmd_diff()
        case _:
            print(__doc__)
            sys.exit(1)


if __name__ == "__main__":
    main()
