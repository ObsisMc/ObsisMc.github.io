---
title: VPN中系统代理与TUN模式的IPv6和DNS泄露
path_name: vpn-proxy-tun-ipv6-dns-leak
date: 2026-03-07 10:51:24
categories:
    - 计算机网络
tags:
    - 计算机网络
draft: false
---



## 问题

在claude限制区域如中国通过vpn使用claude和claude code出现问题:

| 系统代理           | TUN模式            | Claude网页                   | Claude Code                  |
| ------------------ | ------------------ | ---------------------------- | ---------------------------- |
| :white_check_mark: | :x:                | :white_check_mark: available | :x:  not available           |
| :x:                | :white_check_mark: | :x:  not available           | :white_check_mark: available |
| :white_check_mark: | :white_check_mark: | :white_check_mark: available | :white_check_mark: available |

没开TUN模式导致Claude Code不可用可以理解，因为终端需要TUN来代理，但是为什么只开TUN的话网页版用不了，理论上TUN应该是代理了所有流量？



## 分析

去[ipleak网站](https://ipleak.net/)查IP和DNS情况发现以下现象：

1. 开启系统代理的情况下，ipv4和DNS正常代理，而ipv6被禁止![alt text](/VPN中系统代理与TUN模式的IPv6和DNS泄露/system_normal.png)



2. **只开** TUN模式，ipv4被代理，但是ipv6和DNS还是原IP![alt text](/VPN中系统代理与TUN模式的IPv6和DNS泄露/tun_leak.png)



## 结论

问题的原因大概是因为 TUN模式 没有代理IPv6同时也没禁止它，导致IP和DNS泄露了。所以如果只开 TUN 的话，网页版检测到IPv6不对就无法使用Claude。

不过问题是为什么 TUN 没代理IPv6，可能是没配置好或者就是不代理IPv6？不管怎么样，目前最简单的解决方法就是同时打开系统代理和TUN。

