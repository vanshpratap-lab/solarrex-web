# Caching & CDN Layer

This directory represents the **Caching & CDN** layer of the Solar Rex stack.

## Architecture

- **Content Delivery Network**: Vercel Smart Edge Network (Global CDN).
- **Caching Policies**:
  - Static Assets (`/dist/assets/*`): Highly optimized caching using long-expiry configurations (`Cache-Control: public, max-age=31536000, immutable`).
  - Dynamic API Endpoints (`/api/*`): Strictly bypasses caching to ensure direct transactional execution (`Cache-Control: private, no-cache, no-store, must-revalidate`).

## Configurations

- [cache-control-headers.json](file:///c:/Users/maste/OneDrive/Desktop/solarrex-web-Rudra/caching-cdn/cache-control-headers.json): Define header values for various application asset folders.
