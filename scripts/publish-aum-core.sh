#!/bin/bash

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Publishing AUM Core to distribution branch..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Function to remove Git lock file if it exists
remove_git_lock() {
  if [ -f ".git/index.lock" ]; then
    echo "Removing stale Git lock file..."
    rm -f ".git/index.lock"
  fi
}

# Check if we're on main branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$CURRENT_BRANCH" != "main" ]; then
  echo "Error: You must be on the main branch"
  echo "   Current branch: $CURRENT_BRANCH"
  exit 1
fi

# Check if there are uncommitted changes
if ! git diff-index --quiet HEAD --; then
  echo "Error: You have uncommitted changes"
  echo "   Please commit or stash your changes first"
  git status --short
  exit 1
fi

# Check if libs/aum-core exists
if [ ! -d "libs/aum-core" ]; then
  echo "Error: libs/aum-core directory not found"
  exit 1
fi

echo ""
echo "Current status:"
git log -1 --oneline
echo ""

CURRENT_DATE=$(date +"%Y-%m-%d")

# Delete old local aum-core-dist branch if it exists
echo "Cleaning up old aum-core-dist branch..."
git branch -D aum-core-dist 2>/dev/null || true

# Split libs/aum-core to aum-core-dist branch
echo "Splitting libs/aum-core to aum-core-dist branch..."
SPLIT_COMMIT=$(git subtree split --prefix=libs/aum-core)

if [ $? -ne 0 ]; then
  echo ""
  echo "Failed to split libs/aum-core"
  exit 1
fi

# Create local aum-core-dist branch from split commit
git branch aum-core-dist $SPLIT_COMMIT

echo ""
echo "Updating README.md with changelog in aum-core-dist branch..."

remove_git_lock

git checkout aum-core-dist

if [ $? -ne 0 ]; then
  echo "Failed to checkout aum-core-dist branch"
  remove_git_lock
  git checkout main
  exit 1
fi

README_PATH="README.md"
TEMP_README="${README_PATH}.tmp"

# Get last 3 commits that affected libs/aum-core (from main branch)
CHANGELOG=$(git log main -3 --pretty=format:"- %s (%h)" -- libs/aum-core/)

# Create README if it doesn't exist
if [ ! -f "$README_PATH" ]; then
  echo "README.md not found, creating new one..."
  cat > "$README_PATH" << 'EOF'
# AUM Core Component Library

Shared component library for AUM applications.

## Contents

- `ui/`        — Reusable UI components (buttons, form controls, layout, dialogs)
- `theme/`     — Material Design 3 theme, SCSS abstracts, rem() function
- `utils/`     — Services and interfaces (AppConfigService, ViewportService, etc.)
- `common/`    — Shared assets (i18n translation files, SVGs) and common components
- `templates/` — Application shell templates (AumTemplate, AumTemplate2)
EOF
fi

# Create updated README
{
  awk '
    /^## Latest Changes/ { exit }
    /^---$/ && seen_last_updated { exit }
    /^Last Updated:/ { seen_last_updated=1; next }
    !seen_last_updated || !/^Last Updated:/ { print }
  ' "$README_PATH"

  echo ""
  echo "## Latest Changes"
  echo ""
  echo "$CHANGELOG"
  echo ""
  echo "---"
  echo ""
  echo "**Last Updated:** $CURRENT_DATE"
} > "$TEMP_README"

mv "$TEMP_README" "$README_PATH"
echo "README.md updated with latest changes"

# Commit the README update
echo ""
echo "Committing README update to aum-core-dist..."
git add "$README_PATH"
git commit -m "chore: update README with changelog - $CURRENT_DATE" --no-verify

if [ $? -ne 0 ]; then
  echo "No changes to commit (README already up to date)"
fi

# Push aum-core-dist to remote
echo ""
echo "Pushing aum-core-dist to remote..."
git push origin aum-core-dist --force

if [ $? -ne 0 ]; then
  echo ""
  echo "Failed to push aum-core-dist to remote"
  echo "Please check your network connection and try again"
  remove_git_lock
  git checkout main
  exit 1
fi

# Switch back to main
echo ""
echo "Switching back to main branch..."

remove_git_lock

git checkout main

if [ $? -ne 0 ]; then
  echo "Warning: Failed to switch back to main branch"
  echo "   You are still on aum-core-dist branch"
  exit 1
fi

echo ""
echo "Successfully published AUM Core!"
echo ""
echo "Next steps:"
echo "1. App repos can now pull updates with: npm run update-core"
echo "2. Or manually: git subtree pull --prefix=libs/aum-core aum-core aum-core-dist --squash"
echo ""
echo "Distribution branch : aum-core-dist"
echo "Contents            : ui/, theme/, utils/, common/, templates/"
echo "Last Updated        : $CURRENT_DATE"
echo ""
