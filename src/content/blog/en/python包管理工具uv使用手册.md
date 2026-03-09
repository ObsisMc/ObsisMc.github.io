---
categories:
- Python
date: 2026-03-09 14:12:59.061000+00:00
draft: false
excerpt: uv is a modern Python package manager written in Rust that can replace pip, virtualenv, pyenv, and poetry in one tool. This guide covers common commands and configuration for project initialization, dependency management, script execution, pyproject.toml setup, and Workspace multi-package management.
fmContentType: blog-zh
path_name: python-uv-manual
tags:
- Python
title: Python Package Manager uv — A Practical Guide
---

A reference guide for common `uv` commands and configuration. uv is a Python package manager written in Rust that can replace pip, virtualenv, pyenv, and poetry.

## Project Initialization

```bash
# Create a new project (generates pyproject.toml + .venv)
uv init my-project
cd my-project

# Initialize in an existing directory
uv init
```

Basic structure of the generated `pyproject.toml`:

```toml
[project]
name = "my-project" # The package name shown on PyPI and used in dependencies — not the import name
version = "0.1.0"
requires-python = ">=3.11"
dependencies = []
```

## Dependency Management

```bash
# Add dependencies
uv add fastapi pydantic

# Add development dependencies
uv add --dev pytest ruff

# Remove a dependency
uv remove fastapi

# Sync the environment (install according to pyproject.toml and uv.lock)
uv sync
```

`uv add` updates both `pyproject.toml` and `uv.lock` at the same time.

## Running Scripts

```bash
# Run via uv (automatically uses the project's .venv)
uv run python main.py

# Run a script defined in pyproject.toml
uv run my-script
```

`uv run` automatically creates `.venv` (if it doesn't exist) and syncs dependencies — no manual activation needed.


## pyproject.toml Configuration

### Build System

If the project needs to be importable as a package (rather than a standalone script), you must configure a build backend. The example below uses the modern `hatchling`:

```toml
[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"

[tool.hatch.build.targets.wheel]
packages = ["src/my_package"]
```

This tells uv/pip how to build the project into an installable package. `packages` specifies the source directory of the package.

> Tips: The name you use in `import` statements is `my_package`, not the `name` defined under `[project]` — that name is for PyPI display and dependency references.

### project.scripts

Define command-line entry points in `pyproject.toml`:

```toml
[project.scripts]
serve = "my_package.server:main"
translate = "my_package.translate:main"
```

After installation, you can run `serve` and `translate` directly from the command line — each call invokes the `main()` function of the corresponding module.

## Workspace

Workspaces allow you to manage multiple Python packages within a single repository. This is ideal for monorepos or projects that have a main package with sub-modules.

### Configuration

Root `pyproject.toml`:

```toml
[project]
name = "my-project"
version = "0.1.0"
requires-python = ">=3.11"
dependencies = ["my-submodule-project"]

[tool.uv.sources]
my-submodule = { workspace = true }

[tool.uv.workspace]
members = ["tools/my-submodule"]
```

What each configuration does:

| Configuration | Purpose |
|------|------|
| `[tool.uv.workspace] members` | Declares which directories are workspace members |
| `dependencies = ["my-submodule-project"]` | Declares that the root project depends on this sub-package |
| `[tool.uv.sources] my-submodule = { workspace = true }` | Tells uv to resolve the dependency from the workspace, not from PyPI |

**All three are required.** Declaring `members` alone without `dependencies` and `sources` means `uv sync` will not install the sub-package into the environment, and imports will raise `ModuleNotFoundError`.

> Tips: `my-submodule-project` is the sub-module's project name, while `tools/my-submodule` is its file path within the repository.

### Usage

```bash
# Sync all workspace dependencies from the root directory
uv sync
```

A workspace shares a single `.venv` and a single `uv.lock`, with all member dependencies managed together.

### Sub-modules as Workspace Members

If a sub-package is a git submodule, the directory structure typically looks like this:

```
my-project/
  pyproject.toml          # Root project (workspace root)
  tools/
    my-submodule/         # git submodule
      pyproject.toml      # Sub-package's own configuration
      src/
        my_submodule/
          __init__.py
          module.py
```

The sub-module needs its own `pyproject.toml` and build backend configuration, but does not need an additional workspace declaration. The root project is responsible for including it in the workspace.

### Notes

- `uv.lock` is generated only once at the root directory. Any existing `uv.lock` inside a sub-module can be ignored or deleted.