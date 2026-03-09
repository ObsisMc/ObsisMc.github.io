---
categories:
- 计算机组成原理
date: 2026-02-02 21:38:55
draft: false
excerpt: 从寄存器到 NVMe SSD，本文系统梳理了 AI 时代完整的存储体系：SRAM 构成高速 CPU 缓存，DRAM 家族（DDR/LPDDR/GDDR/HBM）覆盖从移动端到
  AI 加速器的内存需求，NAND Flash 与磁盘则分别支撑 SSD 和 HDD 的持久化存储，并配以 PCIe/SATA/SAS 接口与 NVMe/SCSI
  协议完成整个层次结构的闭环。
path_name: ai-era-storage-hierarchy-from-sram-to-nvme
title: AI时代的存储体系梳理：从 SRAM 到 NVMe 的认知框架
---

![text](/AI时代的存储体系梳理：从-SRAM-到-NVMe-的认知框架/hierarchy.svg)

Register ⭢ CPU Cache  ⭢ Memory ⭢ Storage
- 速度：快  ⭢ 慢
- 单位价格：贵  ⭢ 便宜


# CPU Cache

## 存储介质 SRAM

- Static Random-Access Memory（静态随机存取存储器）
- 用晶体管电路“静态地”保存 0/1 的存储，易失存储（volatile），断电数据丢失
- 1 bit 需要多个晶体管（通常为 6 个），因此成本高，密度低
- 速度快，成本高，密度低

# 内存

## 存储介质 DRAM

- Dynamic Random-Access Memory（动态随机存取存储器）
- 1 bit 通常 1 个晶体管 和 1 个电容
- 必须定期刷新，因为电容会漏电。易失存储

## 标准/形态

### DDR

Double Data Rate，标准内存， 广泛用于各种设备。

### LPDDR

Low-Power DDR，更省电，体积更小。

主要应用于移动式电子产品等低功耗设备上，如手机、轻薄本、智能穿戴扽。

### GDDR

Graphics DDR，主要面向 GPU 显存，强调带宽。

### HBM

High Bandwidth Memory 高带宽内存，面向 GPU/AI 加速器的超高带宽内存。

GPU/AI 加速器强大的算力需要内存快速的数据传递来支持，要是内存提供数据的速度跟不上，
GPU/AI 加速器就只能空转，导致算力浪费。这就是为什么需要HBM/GDDR等高带宽内存的原因。

关键设计：
- 3D 堆叠：多片DRAM立体堆叠，
- TSV（Through-Silicon Via，硅通孔）：连接立体的DRAM，提供高速数据传输通道
- 超宽 I/O 总线：超宽的总线接口（单片1024-bit）


# 存储

## 存储介质

NAND Flash 主要用于 SSD，磁盘 主要用于 HDD，都是非易失存储，断电数据不丢失。

### 磁盘
用磁性材料表示 0/1，读写是 按 磁道（track）和 扇区（sector）。

- 随机读写性能差，顺序读写性能好（但还是比NAND慢很多）
- 可以覆盖写，直接覆盖原有数据写入新数据（和NAND不同）
- 寿命：主要是机械可靠性（震动、摔落等），没有写入次数限制

### NAND Flash

用晶体管里“存的电荷”表示 0/1

- 随机读写和顺序读写性能都很好
- 无覆盖写，需要先擦除后再写，且有写放大
- 写入 按页（page），擦除 按块（block）
  - 注意：block 比 page大，所以每次每次擦除前需要保证整个block的数据都不需要了（或者将有用数据移出该block后），才能擦除，
  所以导致了 **写放大**
- 寿命：有写入寿命限制（P/E cycles），写越多磨损越快，需要磨损均衡等策略延长寿命

**Flash Translation Layer FTL 闪存转换层**

把操作系统看到的 逻辑地址 映射到 NAND 的 物理位置，类似操作系统的 虚拟内存管理。

需要这一层的原因是：NAND不能覆盖写，需要不断擦除块然后才写入，很多时候擦除前还得将该块里的有用数据写入其他页。
在没有FTL的情况下，操作系统需要直接考虑和管理物理NAND来均衡磨损以及避开坏块等，这样效率很低且耦合。
由此产生了FTL来给OS屏蔽底层NAND的复杂性。


## 物理接口/总线

- **PCIe**：Peripheral Component Interconnect Express，通用高速互连总线，低延迟、高带宽，适合高并发

- **SATA**：Serial ATA，面向存储的低成本串行接口，消费级 HDD/SSD 最常见，成本低、生态成熟

- **SAS**：Serial Attached SCSI，企业级存储接口，常见于服务器/阵列，强调可靠性、扩展性与管理能力

## 协议

- **NVMe**：Non-Volatile Memory Express，专为 SSD 设计的访问协议/命令体系，通常跑在 PCIe 上，高并发、低延迟
- **SCSI**：Small Computer System Interface，面向企业存储的命令体系/协议家族，可靠性、管理能力、扩展性强的存储生态

## 存储设备

### SSD

Solid State Drive，固态硬盘
- 存储介质：NAND Flash
- 常见物理接口和协议组合：
  - SATA SSD：SATA + AHCI/ATA（兼容强、性能上限较低） 
  - NVMe SSD：PCIe + NVMe（高并发、低延迟、高带宽） 
  - SAS SSD：SAS + SCSI（企业常用）

### HDD

Hard Disk Drive，机械硬盘
- 存储介质：磁盘
- 常见物理接口/协议组合 
  - SATA HDD：SATA + ATA/AHCI（常见）
  - SAS HDD：SAS + SCSI（企业/阵列）