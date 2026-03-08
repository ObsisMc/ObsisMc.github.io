---
title: Windows/Linux双系统删除Linux教程
path_name: delete-linux
date: 2026-03-03 23:53:22
categories:
    - Misc
tag:
    - Misc
draft: false
---

> Tips: 最好配合AI食用，确保每一步都知道在做什么，避免系统崩溃


windows 11 + Linux (Ubuntu) 双系统，把Linux删除，只留下Windows.

本文的Linux启动项是EFI+GRUB引导。

## 恢复Windows启动项/引导

双系统开机的时候一般都是有选择windows还是linux的界面，删除Linux后只存在Windows，所以不需要这个选系统的界面，直接默认走Windows。

1. 进 Windows，打开 管理员 PowerShell/命令提示符，执行：

    ```shell
    bcdedit /enum firmware
    ```
    看有没有 ubuntu / grub 一类条目

2. 把 Windows 引导文件写回 EFI

    ```shell
    mountvol S: /s
    bcdboot C:\Windows /s S: /f UEFI
    ```

3. 执行完重启，进 BIOS/UEFI，把 **Windows Boot Manager** 放到第一启动项。


## 删除 Linux 分区

1. 打开 “磁盘管理” 或者叫 “创建并格式化硬盘分区”
2. 找到linux分区，右键linux相关分区然后选择“删除卷”，分区应该会变成黑色的“未分配”空间
   1. 如果分区变为绿色，右键绿色区域的外框/边界 -> “删除分区/删除扩展分区”，删完它会变成黑色的 未分配。


可能存在Linux相关分区如“UBUNTU BOOT”无法在 “创建并格式化硬盘分区” 里面进行 “删除卷”，需要用指令：

管理员身份打开终端

```powershell
diskpart
list disk
select disk 1 // 这里假设linux分区在disk 1，需要根据自己情况修改
list partition
```

然后能看到disk 1的分区列表，假设要删除的分区是2

```powershell
select partition 2
delete partition override
```

`override` 参数可以强制删除受保护的分区。
删完后输入 `exit` 退出 diskpart


## 新建卷

1. 右键"未分配"空间 → 新建简单卷
2. 大小默认最大即可
3. 分配一个盘符（比如 D: 或 F:）
4. 格式化选 NTFS，勾选"快速格式化"
5. 完成