# Error Tracking & Logs Layer

This directory represents the **Error Tracking & Logs** layer of the Solar Rex stack.

## Architecture

- **Server-Side Logs**: Vercel Runtime Console logs automatically capture serverless function invocations, runtime warnings, database proxy successes, and connection failures.
- **Client-Side Exception Tracking**: Handles and logs input validation alerts inside custom terminal containers and logs warnings to browser consoles.
- **Integration**: Designed to support external reporting payloads (such as Sentry hooks) for enterprise deployments.

## Configurations

- [logger-config.json](file:///c:/Users/maste/OneDrive/Desktop/solarrex-web-Rudra/error-tracking-logs/logger-config.json): Logging levels, targets, and reporting specifications.
