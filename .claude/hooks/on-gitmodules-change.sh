#!/bin/bash
# Triggered by PostToolUse hook. Updates docs/index.md when .gitmodules changes.
INPUT=$(cat)
FILE=$(echo "$INPUT" | jq -re '.tool_input.file_path // empty' 2>/dev/null)

if [[ "$FILE" == *".gitmodules" ]]; then
    PROMPT=$(cat .claude/prompts/update-docs-index.md)
    claude -p "$PROMPT" --allowed-tools Edit
fi
