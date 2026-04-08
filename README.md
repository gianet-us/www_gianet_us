# Website

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator.

## Installation

```bash
yarn
```

## Local Development

```bash
yarn start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

## Build

```bash
yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

## Deployment

Using SSH:

```bash
USE_SSH=true yarn deploy
```

Not using SSH:

```bash
GIT_USER=<Your GitHub username> yarn deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.

## Adding a Git Submodule

**1. Add the submodule** (clones the repo and registers everything in one step)
```bash
git submodule add --depth 1 <url> external/<name>
```

**2. Edit `.gitmodules`** to add the `branch` and `shallow` options:
```
[submodule "external/<name>"]
	path = external/<name>
	url = <url>
	branch = main
	shallow = true
```

**3. Stage and commit**
```bash
git add .gitmodules external/<name>
git commit -m "feat: add <name> submodule"
```

> **Note:** Never manually edit `.gitmodules` alone — `git submodule add` must be run to register the gitlink in the index.
