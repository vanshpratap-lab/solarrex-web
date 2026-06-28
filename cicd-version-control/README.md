# CI/CD & Version Control Layer

This directory represents the **CI/CD & Version Control** layer of the Solar Rex stack.

## Architecture

- **Version Control**: Git & GitHub
- **Deployment Pipelines**: Integrated Vercel Git Integration. Every push to the `main` or `Rudra` branch automatically triggers Vercel static build checking, serverless bundle packing, and edge distribution deployment.
- **Workflow Automation**: Build check processes run locally and on GitHub to verify correct bundling of scripts and CSS.

## Configurations

- [github-workflow.yml](file:///c:/Users/maste/OneDrive/Desktop/solarrex-web-Rudra/cicd-version-control/github-workflow.yml): Example integration pipeline for building and checking asset compliance.
