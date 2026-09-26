#!/bin/bash
# This script generates a file named project_files.txt containing a tree-like structure of the project
# and the content of each file, for another AI to understand the project.

OUTPUT_FILE="project_files.txt"

# Clear the output file if it exists
> "$OUTPUT_FILE"

echo "### Project Tree Structure ###" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# Generate the project tree, excluding common build/dependency directories and the output file itself
tree -a -I "node_modules|dist|.git|'$OUTPUT_FILE'|generate_file_list.sh" >> "$OUTPUT_FILE" 2>&1

echo "" >> "$OUTPUT_FILE"
echo "### File Contents ###" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# Iterate through all files, excluding known binary/large files and the script/output file
find . -type f | grep -vE "^./(node_modules|dist|.git)/" | grep -vE "\.(png|jpg|jpeg|gif|webp|ico|eot|ttf|woff|woff2|svg)$" | grep -vE "^./$OUTPUT_FILE$" | grep -vE "^./generate_file_list.sh$" | while IFS= read -r file; do
    if [ -f "$file" ]; then # Double-check it's a file, just in case
        echo "--- Start of File: $file ---" >> "$OUTPUT_FILE"
        echo "" >> "$OUTPUT_FILE"
        cat "$file" >> "$OUTPUT_FILE"
        echo "" >> "$OUTPUT_FILE"
        echo "--- End of File: $file ---" >> "$OUTPUT_FILE"
        echo "" >> "$OUTPUT_FILE"
    fi
done

echo "" >> "$OUTPUT_FILE"
echo "project_files.txt created with project tree and file contents."

