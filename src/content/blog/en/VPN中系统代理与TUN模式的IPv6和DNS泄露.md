---
categories:
- Computer Networking
date: 2026-03-07 10:51:24
draft: false
excerpt: When using Claude via VPN in China, enabling TUN mode alone causes IPv6 and DNS leaks, making the Claude web app inaccessible; while enabling system proxy alone breaks the terminal tool Claude Code. Enabling both modes simultaneously is currently the simplest and most reliable solution.
path_name: vpn-proxy-tun-ipv6-dns-leak
tags:
- Computer Networking
title: IPv6 and DNS Leaks with System Proxy and TUN Mode in VPN
---

## Problem

When using Claude and Claude Code via VPN in regions where Claude is restricted, such as China, the following issues arise:

| System Proxy       | TUN Mode           | Claude Web                   | Claude Code                  |
| ------------------ | ------------------ | ---------------------------- | ---------------------------- |
| :white_check_mark: | :x:                | :white_check_mark: available | :x:  not available           |
| :x:                | :white_check_mark: | :x:  not available           | :white_check_mark: available |
| :white_check_mark: | :white_check_mark: | :white_check_mark: available | :white_check_mark: available |

It makes sense that Claude Code becomes unavailable without TUN mode, since the terminal needs TUN for proxying — but why does the Claude web app stop working when only TUN mode is enabled? In theory, TUN should be proxying all traffic.



## Analysis

Checking IP and DNS status on [ipleak.net](https://ipleak.net/) revealed the following:

1. With system proxy enabled, IPv4 and DNS are proxied correctly, while IPv6 is blocked. ![alt text](/VPN中系统代理与TUN模式的IPv6和DNS泄露/system_normal.png)



2. With **only** TUN mode enabled, IPv4 is proxied, but IPv6 and DNS still show the original IP. ![alt text](/VPN中系统代理与TUN模式的IPv6和DNS泄露/tun_leak.png)



## Conclusion

The root cause appears to be that TUN mode does not proxy IPv6 traffic and also does not block it, resulting in IP and DNS leaks. Therefore, when only TUN mode is active, the Claude web app detects an incorrect IPv6 address and becomes inaccessible.

The question remains as to why TUN fails to proxy IPv6 — it may be a misconfiguration, or IPv6 simply may not be proxied by design. Regardless, the simplest workaround for now is to enable both system proxy and TUN mode simultaneously.