# Availability & Recovery Layer

This directory represents the **Availability & Recovery** layer of the Solar Rex stack.

## Architecture

- **High Availability**: Google Apps Script environment uses Google's redundant global infrastructure.
- **Data Recovery (Disaster Recovery)**:
  - Lead backup scheduler: Automatically back up sheets to cloud storage or secure drives at intervals.
  - Multi-region deployment configuration: Deploy App Script API proxies on secondary backup URLs.
- **Failover**: If the script is unavailable, frontend fallback mode displays backup phone contacts to users.

## Configurations

- [backup-recovery-plan.json](file:///c:/Users/maste/OneDrive/Desktop/solarrex-web-Rudra/availability-recovery/backup-recovery-plan.json): Plan outline for disaster recovery schedules.
