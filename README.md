# Website

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator.

## Local Development

```bash
npm install
git submodule init
git submodule update --remote --checkout
npm run dev
```

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
