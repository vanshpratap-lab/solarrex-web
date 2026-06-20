# Security & RLS Layer

This directory represents the **Security & Row-Level Security (RLS)** layer of the Solar Rex stack.

## Architecture

- **Client-Side Security Hardening**:
  - Content Security Policy (CSP): Strictly limit script execution, image loads, and connection endpoints to avoid XSS vectors.
  - Sanitization checks: Sanitizing user inputs from HTML tags and SQL/JavaScript injection scripts before forwarding.
- **Headers Protection**: 
  - `X-Content-Type-Options: nosniff` (Prevent MIME-type sniffing).
  - `X-Frame-Options: DENY` (Prevent clickjacking).
  - `X-XSS-Protection: 1; mode=block` (Enforce browser XSS protections).
  - `Referrer-Policy: strict-origin-when-cross-origin`.

## Configurations

- [csp-policy.json](file:///c:/Users/maste/OneDrive/Desktop/solarrex-web-Rudra/security-rls/csp-policy.json): A mapping of security headers and policy specifications.
