---
categories: [Operating Systems]
date: 2026-03-03 23:53:22
draft: false
excerpt: On a Windows 11 + Ubuntu dual-boot setup, you can cleanly remove Linux and
  keep Windows intact by restoring the Windows EFI bootloader, force-deleting the
  Linux partitions via Disk Management or diskpart, and formatting the freed space
  as a new NTFS volume.
path_name: delete-linux
tag:
- Misc
tags: [Operating Systems, Windows, Linux]
title: How to Remove Linux from a Windows/Linux Dual-Boot System
---

> Tips: It's best to follow along with an AI assistant so you understand each step and avoid accidentally breaking your system.


Windows 11 + Linux (Ubuntu) dual-boot — removing Linux and keeping only Windows.

This guide assumes the Linux boot entry uses EFI + GRUB.

## Restore the Windows Bootloader

On a dual-boot system, startup normally presents a menu to choose between Windows and Linux. Once Linux is removed, that menu is no longer needed — the system should boot directly into Windows by default.

1. Boot into Windows, open an **administrator** PowerShell or Command Prompt, and run:

    ```shell
    bcdedit /enum firmware
    ```
    Check whether any entries for ubuntu or grub appear.

2. Write the Windows boot files back to the EFI partition:

    ```shell
    mountvol S: /s
    bcdboot C:\Windows /s S: /f UEFI
    ```

3. After the command completes, restart and enter your BIOS/UEFI settings. Move **Windows Boot Manager** to the top of the boot order.


## Delete the Linux Partitions

1. Open **Disk Management** (also labeled "Create and format hard disk partitions").
2. Locate the Linux partitions, right-click each one, and select **Delete Volume**. The partition should turn black, indicating **Unallocated** space.
   1. If a partition turns green instead, right-click the green border/outline and choose **Delete Partition / Delete Extended Partition**. Once deleted, it will become black Unallocated space.


Some Linux-related partitions (such as "UBUNTU BOOT") may not allow **Delete Volume** from within Disk Management. In that case, use the command line:

Open a terminal as administrator:

```powershell
diskpart
list disk
select disk 1 // Assuming the Linux partition is on disk 1 — adjust based on your setup
list partition
```

This displays the partition list for disk 1. Assuming the partition to delete is partition 2:

```powershell
select partition 2
delete partition override
```

The `override` flag forces deletion of protected partitions.
After deletion, type `exit` to quit diskpart.


## Create a New Volume

1. Right-click the **Unallocated** space → **New Simple Volume**
2. Leave the size at the maximum default
3. Assign a drive letter (e.g., D: or F:)
4. Format as **NTFS** and check **Perform a quick format**
5. Click Finish