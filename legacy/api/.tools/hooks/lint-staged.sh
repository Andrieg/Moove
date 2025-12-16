#!/bin/bash
for file in $(git diff --cached --name-only --diff-filter=d | grep -E '\.(ts|tsx)$')
do
    $(npm bin)/eslint "$file"
done
