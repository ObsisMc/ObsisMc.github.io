---
categories:
- Python
date: 2026-03-09 14:12:59.061000+00:00
draft: false
excerpt: uv 是用 Rust 编写的现代 Python 包管理工具，可一站式替代 pip、virtualenv、pyenv 和 poetry。本文系统整理了项目初始化、依赖管理、脚本运行、pyproject.toml
  配置及 Workspace 多包管理的常用命令与注意事项，适合随时查阅参考。
fmContentType: blog-zh
path_name: python-uv-manual
tags:
- Python
title: Python包管理工具uv使用手册
---

记录 uv 的常用命令和配置，方便查阅。uv 是 Rust 编写的 Python 包管理工具，可以替代 pip、virtualenv、pyenv 和 poetry。

## 项目初始化

```bash
# 创建新项目（生成 pyproject.toml + .venv）
uv init my-project
cd my-project

# 在已有目录初始化
uv init
```

生成的 `pyproject.toml` 基本结构：

```toml
[project]
name = "my-project" # 这是PyPI里展示的包名，也是dependencies里使用的引用，但不是import用的名字
version = "0.1.0"
requires-python = ">=3.11"
dependencies = []
```

## 依赖管理

```bash
# 添加依赖
uv add fastapi pydantic

# 添加开发依赖
uv add --dev pytest ruff

# 移除依赖
uv remove fastapi

# 同步环境（按 pyproject.toml 和 uv.lock 安装）
uv sync
```

`uv add` 会同时更新 `pyproject.toml` 和 `uv.lock`。

## 运行脚本

```bash
# 通过 uv 运行（自动使用项目 .venv）
uv run python main.py

# 运行 pyproject.toml 中定义的 script
uv run my-script
```

`uv run` 会自动创建 `.venv`（如果不存在）并同步依赖，不需要手动 activate。


## pyproject.toml 配置详解

### 构建系统

如果项目需要作为包被 import（而不是纯脚本），需要配置构建后端，这里用比较新的hatchling：

```toml
[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"

[tool.hatch.build.targets.wheel]
packages = ["src/my_package"]
```

这告诉 uv/pip 如何将项目构建为可安装的包。`packages` 指定包的源码目录。

> Tips: 代码里import的是 `my_package` 而不是 `[project]` 下面定义的 `name`，那是PyPI里展示的包名以及dependencies里使用的引用

### project.scripts

在 `pyproject.toml` 中定义命令行入口：

```toml
[project.scripts]
serve = "my_package.server:main"
translate = "my_package.translate:main"
```

安装后可以直接运行 `serve`、`translate` 命令，等价于调用对应模块的 `main()` 函数。

## Workspace

Workspace 用于在一个仓库中管理多个 Python 包。适合 monorepo 或主项目 + 子模块的场景。

### 配置

根目录 `pyproject.toml`：

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

三个配置的作用：

| 配置 | 作用 |
|------|------|
| `[tool.uv.workspace] members` | 声明哪些目录是 workspace 成员 |
| `dependencies = ["my-submodule-project"]` | 声明根项目依赖这个子包 |
| `[tool.uv.sources] my-submodule = { workspace = true }` | 告诉 uv 从 workspace 成员解析依赖，而不是去 PyPI 下载 |

**三者缺一不可。** 只声明 `members` 不加 `dependencies` 和 `sources`，`uv sync` 不会把子包安装到环境中，import 会报 `ModuleNotFoundError`。

> Tips: `my-submodule-project`是子模块的project name，而`tools/my-submodule`是子模块所在文件路径

### 使用

```bash
# 在根目录同步所有 workspace 依赖
uv sync
```

Workspace 共享一个 `.venv` 和一个 `uv.lock`，所有成员的依赖统一管理。

### 子模块作为 Workspace 成员

如果子包是 git submodule，目录结构通常是：

```
my-project/
  pyproject.toml          # 根项目（workspace root）
  tools/
    my-submodule/         # git submodule
      pyproject.toml      # 子包自己的配置
      src/
        my_submodule/
          __init__.py
          module.py
```

子模块需要自己的 `pyproject.toml` 和构建后端配置，但不需要额外的 workspace 声明。根项目负责把它纳入 workspace。

### 注意事项

- `uv.lock` 只在根目录生成一份，子模块里的旧 `uv.lock` 可以忽略或删除