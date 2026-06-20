# Load Balancing & Scaling Layer

This directory represents the **Load Balancing & Scaling** layer of the Solar Rex stack.

## Architecture

- **Static Assets Load Balancing**: Automatically distributed globally via Anycast routing across Vercel edge points.
- **Serverless API Scale Model**: Serverless routes auto-scale up to hundreds of concurrent executions instantly upon burst traffic.
- **Database Scale Capability**: App Script execution queues handles form requests asynchronously to process peaks.

## Configurations

- [scaling-policy.json](file:///c:/Users/maste/OneDrive/Desktop/solarrex-web-Rudra/load-balancing-scaling/scaling-policy.json): Outlines horizontal auto-scaling rules and failover architectures.
