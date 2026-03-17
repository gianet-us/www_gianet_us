#!/bin/bash
EXTERNAL_DIR="external"
DOCS_DIR="docs"

# Ensure the base docs directory exists
mkdir -p "$DOCS_DIR"

echo "📂 Starting documentation sync and path transformation..."

# Get all submodule paths from .gitmodules
submodule_paths=$(git config --file .gitmodules --get-regexp path | awk '{ print $2 }')

for sub_path in $submodule_paths; do
    # Get the folder name (e.g., ansible_role_proxy)
    raw_folder_name=$(basename "$sub_path")
    
    # 1. Transform underscores to slashes for the directory structure
    # ansible_role_proxy -> ansible/role/proxy
    path_structure=$(echo "$raw_folder_name" | tr '_' '/')
    
    # 2. Define the target directory and the final file path
    # We use index.md so the URL remains pretty
    target_dir="$DOCS_DIR/$path_structure"
    target_file="$target_dir/index.md"
    source_file="$sub_path/README.md"

    if [ -f "$source_file" ]; then
        # Create the nested subfolders
        mkdir -p "$target_dir"
        
        # Copy the file
        cp "$source_file" "$target_file"
        
        echo "✅ Processed: $raw_folder_name -> $target_file"
    else
        echo "⚠️  Skipped: No README.md found in $sub_path"
    fi
done

echo "✨ All documentation synchronized."
