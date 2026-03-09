---
title: Git常用命令工具书
path_name: git-common-commands
date: 2026-02-01 11:57:20
tags:
  - Git
draft: false
---

记录一些常用的Git命令，方便查阅。

## pull

#### 拉取本地没有的分支
从远程pull本地没有的分支，同时关联本地分支与远程分支，然后切换到该分支：

```shell
git fetch // 先fetch
git checkout -b <new_local_branch> <remote_name>/<remote_branch>
```


## push

#### 关联分支并推送
push 本地分支 到 远程分支（如果远程没有该分支则自动创建一个），且将本地分支与远程分支关联起来：
```shell
// 本地分支和远程分支名一样
git push -u <remote_name> <branch>

```

## branch

#### 删除分支

```shell
// 删除本地分支
git branch -d <branch_name>

// 强制删除未merge的分支
git branch -D <branch_name>

// 删除远程分支
git push <remote_name> --delete <branch_name>
```

## rebase

#### 修复历史中某个commit

```shell
// 1. 找到需要修改的commit_id，然后执行交互式rebase
git rebase -i <commit_id>^

// 2. 将需要修改的commit前的pick改为edit，保存退出
// 3. 现在在目标commit上，进行修改，然后add
// 4. amend
git commit --amend
// 5. 继续rebase
git rebase --continue

```


## submodule

#### 给仓库添加子模块
```shell
// 将远程其他仓库作为子模块添加到当前仓库中（可以指定保存路径local_path），local_path下面就是源代码，不会再套一层仓库名
git submodule add <remote_repository_url> [<local_path>]

// 然后会出现 .gitmodules 文件和你指定的文件路径，记得提交
git add .gitmodules <local_path>
git commit -m "Add submodule"
```

#### 初始化 submodule
```shell
// pull主仓库的同时初始化submodule
git pull --recurse-submodules

// submodule没拉取得情况初始化所有submodule
git submodule update --init --recursive
```


#### 更新 submodule
```shell
git submodule update --remote
```



