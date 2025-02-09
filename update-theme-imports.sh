#!/bin/bash

# Find all JavaScript and TypeScript files in the src directory
find frontend/src -type f -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" | while read -r file; do
  # Replace the import statement
  sed -i '' 's/import { ThemeContext } from '\''\.\.\/\.\.\/App'\''/import { ThemeContext } from '\''\.\.\/\.\.\/context\/ThemeContext'\''/g' "$file"
  sed -i '' 's/import { ThemeContext } from '\''\.\.\/App'\''/import { ThemeContext } from '\''\.\.\/context\/ThemeContext'\''/g' "$file"
done
