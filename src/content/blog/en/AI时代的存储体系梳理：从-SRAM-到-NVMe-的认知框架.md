---
categories: [Computer Organization and Architecture]
date: 2026-02-02 21:38:55
draft: false
excerpt: From registers to NVMe SSDs, this article systematically maps the complete storage hierarchy of the AI era — SRAM forms the high-speed CPU cache, the DRAM family (DDR/LPDDR/GDDR/HBM) covers memory needs from mobile devices to AI accelerators, while NAND Flash and magnetic disks underpin SSD and HDD persistent storage respectively, with PCIe/SATA/SAS interfaces and NVMe/SCSI protocols closing the loop across the entire hierarchy.
path_name: ai-era-storage-hierarchy-from-sram-to-nvme
tags: [Computer Organization and Architecture, Storage]
title: "Storage Hierarchy in the AI Era: A Conceptual Framework from SRAM to NVMe"
---

![text](/AI时代的存储体系梳理：从-SRAM-到-NVMe-的认知框架/hierarchy.svg)

Register ⭢ CPU Cache ⭢ Memory ⭢ Storage
- Speed: Fast ⭢ Slow
- Cost per unit: Expensive ⭢ Cheap


# CPU Cache

## Storage Medium: SRAM

- Static Random-Access Memory
- Stores 0/1 "statically" using transistor circuits; volatile storage — data is lost when power is cut
- 1 bit typically requires multiple transistors (usually 6), resulting in high cost and low density
- Fast, expensive, and low-density

# Memory

## Storage Medium: DRAM

- Dynamic Random-Access Memory
- 1 bit typically uses 1 transistor and 1 capacitor
- Must be periodically refreshed because capacitors leak charge; volatile storage

## Standards / Form Factors

### DDR

Double Data Rate — the standard memory type, widely used across all kinds of devices.

### LPDDR

Low-Power DDR — more power-efficient and more compact.

Primarily used in low-power mobile devices such as smartphones, ultrabooks, and smartwatches.

### GDDR

Graphics DDR — designed primarily for GPU VRAM, with an emphasis on bandwidth.

### HBM

High Bandwidth Memory — ultra-high-bandwidth memory targeting GPUs and AI accelerators.

The immense compute power of GPUs and AI accelerators demands fast data delivery from memory. If memory cannot supply data quickly enough, the GPU or AI accelerator sits idle, wasting compute capacity. This is precisely why high-bandwidth memory such as HBM and GDDR is needed.

Key design features:
- 3D stacking: multiple DRAM dies stacked vertically
- TSV (Through-Silicon Via): connects the stacked DRAM dies, providing high-speed data transfer channels
- Ultra-wide I/O bus: extremely wide bus interface (1024-bit per die)


# Storage

## Storage Media

NAND Flash is used primarily in SSDs; magnetic disks are used primarily in HDDs. Both are non-volatile — data persists when power is removed.

### Magnetic Disk
Represents 0/1 using magnetic material; reads and writes are organized by track and sector.

- Poor random I/O performance; good sequential I/O performance (though still much slower than NAND)
- Supports in-place writes — new data can be written directly over existing data (unlike NAND)
- Lifespan: primarily governed by mechanical reliability (vibration, drops, etc.); no write-cycle limit

### NAND Flash

Represents 0/1 using the charge stored in transistors.

- Good performance for both random and sequential I/O
- No in-place writes — data must be erased before it can be rewritten, leading to write amplification
- Writes occur at the page level; erases occur at the block level
  - Note: a block is larger than a page, so before erasing a block, all data in that block must either be no longer needed or migrated to another location. This is the root cause of **write amplification**.
- Lifespan: limited by P/E (program/erase) cycles — more writes mean faster wear, requiring strategies such as wear leveling to extend longevity

**Flash Translation Layer (FTL)**

Maps the logical addresses seen by the operating system to physical locations on the NAND, analogous to virtual memory management in an OS.

This layer is needed because NAND does not support in-place writes — blocks must be erased before new data can be written, and useful data often has to be relocated before a block can be erased. Without FTL, the OS would need to directly manage the physical NAND to handle wear leveling and bad-block avoidance, which is inefficient and tightly coupled. FTL was introduced to shield the OS from the underlying complexity of NAND.


## Physical Interfaces / Buses

- **PCIe**: Peripheral Component Interconnect Express — a general-purpose high-speed interconnect bus; low latency, high bandwidth, well-suited for high-concurrency workloads

- **SATA**: Serial ATA — a low-cost serial interface designed for storage; the most common interface for consumer-grade HDDs and SSDs; affordable with a mature ecosystem

- **SAS**: Serial Attached SCSI — an enterprise-grade storage interface commonly found in servers and storage arrays; emphasizes reliability, scalability, and manageability

## Protocols

- **NVMe**: Non-Volatile Memory Express — an access protocol and command set designed specifically for SSDs, typically running over PCIe; delivers high concurrency and low latency
- **SCSI**: Small Computer System Interface — a command set and protocol family targeting enterprise storage; a well-established ecosystem emphasizing reliability, manageability, and scalability

## Storage Devices

### SSD

Solid State Drive
- Storage medium: NAND Flash
- Common physical interface and protocol combinations:
  - SATA SSD: SATA + AHCI/ATA (strong compatibility, lower performance ceiling)
  - NVMe SSD: PCIe + NVMe (high concurrency, low latency, high bandwidth)
  - SAS SSD: SAS + SCSI (common in enterprise environments)

### HDD

Hard Disk Drive
- Storage medium: magnetic disk
- Common physical interface and protocol combinations:
  - SATA HDD: SATA + ATA/AHCI (most common)
  - SAS HDD: SAS + SCSI (enterprise / storage arrays)