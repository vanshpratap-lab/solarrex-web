# Auth & Permissions Layer

This directory represents the **Auth & Permissions** layer of the Solar Rex stack.

## Architecture

Since Solar Rex is a landing page capturing client leads, the auth & permissions layer focuses on:
- **Serverless API Authentication**: Restricting lead submissions to verified frontend domains using origin locking.
- **Credential Storage Policies**: Environment variables management for backend forwarding credentials.
- **Database Access Control**: Google Workspace access controls to lock access to the destination Google Sheet.

## Configurations

- [permissions-policy.json](file:///c:/Users/maste/OneDrive/Desktop/solarrex-web-Rudra/auth-permissions/permissions-policy.json): Outlines origin rules and authorization configuration patterns.
