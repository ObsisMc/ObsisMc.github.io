---
title: Oracle Cloud 24G内存云免费服务器领取攻略
date: 2026-04-06T13:16:44.427Z
tags: []
draft: true
fmContentType: draft
---


目前 Oracle Cloud 可以永久免费使用 ARM 4 核 24 G 内存且磁盘 200 G 的云计算资源。

## 免费额度的范围

参考 [Oracle Cloud Free Tier](https://www.oracle.com/cloud/free/)，里面可以搜索哪些是 "Always Free"。
以下是截至 2026.04.07 的数据，主要关注计算实例相关的额度

### 计算资源

- AMD架构：最多两个 1核1G 的实例
- ARM架构：最多4核24G的实例（每个核6G）

每个月提供免费的 3,000 CPU时间以及 18,000 GB 内存时间，这个基本上是正好够4核24G的ARM实例跑一个月。

注意：听说7天之内CPU没跑到10%（部分地区20%），会被回收。

### 存储

启动卷核块存储卷（Boot and block volume storage）最多申请2个，且当前账户下最多总共200G。

也就是说，在申请计算实例时申请的磁盘空间总共不能超过200G，否则收费。

### IP

服务器需要公网IP，Oracle提供 2 个免费的 Virtual Cloud Networks (VCN)。

### 网络流量

入站流量免费，出站流（Outbound Data Transfer）量每个月最多10 TB。出站流量包括了前端的各种HTML、CSS、JS、图片、视频等。


还有很多其他服务也有免费额度，包括负载均衡、对象存储等，想了解的话还是详细看看上面贴出的网址。


## 申请账号

申请Oracle Cloud 账号：[youtube 攻略](https://www.youtube.com/watch?v=n7tcyLLfAGs)

> 注意：如果在国内注册，不要开梯子，地址填写国内的，同时使用国内visa/mastercard/amex等信用卡注册，不然会注册失败。亲测注册时开梯子且用美国地址和美卡，注册不成功。

## 申请计算资源

免费的计算资源有
1. amd 1 核 1 G
2. arm 最高 4 核 24 G

磁盘空间总共 200 G。

但是 arm 资源free tier很难申请，升级成 Pay-As-You-Go plan 会好申请。

升级到 Pay-As-You-Go plan 需要认证一个信用卡，用注册时候的信用卡就行，同样的，最好不要开梯子同时用国内的卡，不然可能不让你升级。升级需要等待审核。

升级plan完成后，再去申请arm实例，可以马上申请成功。


## 配置网络


甲骨文云的默认镜像中，内置的 iptables 规则极其严格，需要删除

```bash
# 停止防火墙服务
sudo systemctl stop ufw
# 彻底放行所有流量（仅限测试，之后建议精细配置）
sudo iptables -P INPUT ACCEPT
sudo iptables -P FORWARD ACCEPT
sudo iptables -P OUTPUT ACCEPT
sudo iptables -F
```

之后便是常规的去Oracle Cloud Console上配置需要的网络入站出站规则。