# Rate Limiting Layer

This directory represents the **Rate Limiting** layer of the Solar Rex stack.

## Architecture

- **Serverless API Rate Limiting**: Limit API submission requests to guard Google Sheet forwarding from abuse and denial of service.
- **Vercel Limits**: Max requests per window duration configured at routing and serverless function wrappers.
- **Client-Side Debouncing**: Form submit buttons are disabled instantly on submit to prevent duplicate submissions.

## Configurations

- [rate-limit-config.json](file:///c:/Users/maste/OneDrive/Desktop/solarrex-web-Rudra/rate-limiting/rate-limit-config.json): Standard settings defining rates and timing thresholds.
