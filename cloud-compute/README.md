# Cloud & Compute Layer

This directory represents the **Cloud & Compute** layer of the Solar Rex stack.

## Architecture

- **Runtime**: Vercel Serverless Functions (Node.js 18+)
- **Execution Model**: On-demand stateless execution triggered by API posts.
- **Serverless Limits**:
  - Max Execution Duration: 10s (standard plan limit)
  - Memory Allocation: 1024MB
  - Region: `iad1` (Washington D.C., USA - Vercel Default) or close to user database regions.

## Specifications

- [serverless-specs.json](file:///c:/Users/maste/OneDrive/Desktop/solarrex-web-Rudra/cloud-compute/serverless-specs.json): Serverless limits, specs, and environment setup template.
