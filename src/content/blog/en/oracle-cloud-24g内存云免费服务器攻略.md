---
categories:
- Cloud Computing
date: 2026-04-06 13:16:44.427000+00:00
draft: false
excerpt: Oracle Cloud offers a permanently free ARM VPS with up to 4 cores, 24 GB RAM, and 200 GB disk — no VPN required. This guide walks you through account registration, claiming free resources, and network configuration, with a full breakdown of the Always Free tier limits.
path_name: oracle-always-free-vps
tags: []
title: Oracle Cloud Always Free 24 GB VPS Guide
---

Oracle Cloud currently offers permanently free cloud computing resources with up to 4 cores, 24 GB of RAM, and 200 GB of disk storage.

Benefits of this server:
- Permanently free (at least until Oracle decides to discontinue the program)
- Up to 24 GB of RAM — no more worrying about running out of memory with a couple of extra processes
- Direct connection without a VPN (from mainland China, latency to US West is approximately 200 ms)

**Prerequisites for new Oracle users:** You must have a credit card issued in your country of residence. For example, users in China need a China-issued credit card (UnionPay is not accepted); US users need a US-issued card. Otherwise, registration may fail.

For the full list of free services, see the [Always Free tier limits](#always_free) section at the end of this article.


## Creating an Account

To register an Oracle Cloud account, refer to this [YouTube guide](https://www.youtube.com/watch?v=n7tcyLLfAGs).

> **Note:** If registering from mainland China, do **not** use a VPN. Use a Chinese address and a Chinese Visa/Mastercard/Amex credit card. Using a VPN with a US address and a US card has been confirmed to result in registration failure.

## Claiming Compute Resources

The free compute resources available are:
1. AMD — 1 core, 1 GB RAM
2. ARM — up to 4 cores, 24 GB RAM

Total disk space is capped at 200 GB.

However, ARM instances are very difficult to claim under the free tier. Upgrading to the **Pay-As-You-Go** plan significantly improves your chances.

Upgrading to Pay-As-You-Go requires verifying a credit card — the one you used during registration works fine. Again, if you are in China, it is best to avoid using a VPN and to use a domestic card, as doing otherwise may prevent the upgrade. The upgrade requires a review period. Once the upgrade is complete, you can claim an ARM instance immediately.


## Network Configuration


The default images on Oracle Cloud ship with extremely restrictive built-in `iptables` rules that need to be cleared:

```bash
# Stop the firewall service
sudo systemctl stop ufw
# Allow all traffic (for testing only — configure fine-grained rules afterward)
sudo iptables -P INPUT ACCEPT
sudo iptables -P FORWARD ACCEPT
sudo iptables -P OUTPUT ACCEPT
sudo iptables -F
```

After that, configure the required inbound and outbound network rules through the Oracle Cloud Console as you normally would.

<a id="always_free"></a>
## Always Free Tier Limits

Refer to [Oracle Cloud Free Tier](https://www.oracle.com/cloud/free/) and search for items marked **"Always Free"**.

The following figures are accurate as of 2026-04-07. The focus here is on compute instance-related quotas.

### Compute

- **AMD:** Up to two instances, each with 1 core and 1 GB RAM
- **ARM:** Up to 4 cores and 24 GB RAM total (6 GB per core)

Each month includes 3,000 free CPU-hours and 18,000 GB memory-hours — just enough to run a 4-core 24 GB ARM instance for a full month.

**Note:** Reportedly, if CPU usage stays below 10% (or 20% in some regions) for 7 consecutive days, the instance may be reclaimed.

### Storage

Boot volumes and block storage volumes are limited to a maximum of 2 volumes and a combined total of 200 GB per account.

This means the total disk space allocated across all compute instances cannot exceed 200 GB, or you will be charged.

### IP Addresses

A public IP address is required for server access. Oracle provides 2 free **Virtual Cloud Networks (VCNs)**.

### Network Traffic

Inbound traffic is free. **Outbound data transfer** is capped at **10 TB per month**, which includes all front-end assets such as HTML, CSS, JavaScript, images, and video.


Many other services also have Always Free allocations, including load balancing and object storage. Check the link above for the full details.