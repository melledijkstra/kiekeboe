# AI Agent Documentation for the current repository

This document provides guidance for AI agents working on the repository. It outlines the structure, conventions, and key components of the project to ensure consistent and efficient contributions.

## Repository Overview

The `kiekeboe` repository contains multiple applications and configurations, including a browser extension and a mobile application. The project uses modern web development tools and frameworks such as Svelte, Vite, and TailwindCSS, alongside backend integrations with Google APIs.

### Monorepo Packages

- **`apps/extension`**: Contains the browser extension package.
- **`apps/mobile`**: Contains the mobile application codebase.
- **`apps/server`**: Contains the Odysea server code. A server which is deployed to a small device on the network like a RaspberryPi. It acts as a backup for storing information in an SQLite database. (to avoid data loss in browser storage)
- **`apps/serverless`**: Contains serverless code which is deployed to the internet. It handles any API logic which cannot be done on the frontend. For example requesting data from API's which need API keys that cannot be exposed to the frontend.

## Development Tools and Configurations

### Extension

The browser extension uses Vite for bundling and development. The configuration is defined in `apps/extension/vite.config.ts`. Key features include:

- **Svelte**: Svelte is the frontend framework that powers the UI of the extension.
- **Plugins**: TailwindCSS, Svelte, and static file copying.

### Mobile App

**VS Code Launch Configurations**:
The `.vscode/launch.json` file provides launch configurations for the mobile application, supporting development, profile, and release modes for Flutter.

---

## Dependency Management

Dependabot is configured in `.github/dependabot.yml` to manage dependencies for the following ecosystems:

- **pnpm**: Weekly updates for TailwindCSS, Storybook, and Vite-related packages.

---

## Coding Conventions

### TypeScript and Svelte

- Use TypeScript for type safety in both API and UI components.
- Follow Svelte conventions for component-based development.

### File Structure

- Organize files by feature or functionality.
- Use descriptive filenames and maintain consistent naming conventions.

---

## Notes for AI Agents

1. **Respect Existing Conventions**: Follow the established patterns and structures in the repository.
2. **Use Environment Variables**: Ensure sensitive data like API keys are loaded from environment variables.
3. **Test Changes**: Validate functionality using the provided configurations and tools.
4. **Document Contributions**: Update this document or relevant code comments when introducing new features or changes.

---

This document serves as a guide for AI agents to navigate and contribute effectively to the repository. For further details, refer to the specific files and configurations mentioned above.