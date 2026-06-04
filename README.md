# Website

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator.

## Local Development

```bash
npm install
git submodule init
git submodule update --remote --checkout
./sync-docs.sh
npm run start
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

## Auto-updating docs/index.md

`docs/index.md` is the documentation landing page. The auto-generated section (between the `{/* AUTO-GENERATED */}` MDX comments) is kept in sync with `.gitmodules` by a Claude Code hook — no manual edits needed.

**How it works:**

1. A `PostToolUse` hook in `.claude/settings.json` fires whenever Claude Code edits a file.
2. If the modified file is `.gitmodules`, the hook runs `.claude/hooks/on-gitmodules-change.sh`.
3. That script invokes `claude -p` with the system prompt at `.claude/prompts/update-docs-index.md`.
4. The model reads `.gitmodules`, derives each doc path (`ansible_role_proxy` → `ansible/role/proxy/`), reads the submodule README for a one-line description, and rewrites the auto-generated block in `docs/index.md`.

**When adding or removing a submodule via Claude Code**, the index updates automatically in the same session.

**When editing `.gitmodules` outside Claude Code** (e.g. manually), run the update prompt explicitly:
```bash
claude -p "$(cat .claude/prompts/update-docs-index.md)" --allowed-tools Edit
```
