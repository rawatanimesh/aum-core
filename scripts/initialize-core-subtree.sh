#!/bin/bash

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Initializing AUM Core Subtree Setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

AUM_CORE_REMOTE="https://github.com/rawatanimesh/aum-core.git"
AUM_CORE_BRANCH="aum-core-dist"

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
  echo "Error: Not in a git repository"
  echo "   Please run this script from the root of your git repository"
  exit 1
fi

# Check if there are uncommitted changes
if ! git diff-index --quiet HEAD -- 2>/dev/null; then
  echo "Error: You have uncommitted changes"
  echo "   Please commit or stash your changes first"
  git status --short
  exit 1
fi

echo "Step 1: Checking remote configuration..."

# Check if aum-core remote already exists
if git remote | grep -q "^aum-core$"; then
  echo "Remote 'aum-core' already exists"
  EXISTING_URL=$(git remote get-url aum-core)
  if [ "$EXISTING_URL" != "$AUM_CORE_REMOTE" ]; then
    echo "Warning: Remote URL differs"
    echo "   Expected : $AUM_CORE_REMOTE"
    echo "   Found    : $EXISTING_URL"
    read -p "   Update remote URL? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
      git remote set-url aum-core "$AUM_CORE_REMOTE"
      echo "Remote URL updated"
    fi
  fi
else
  echo "Adding remote 'aum-core'..."
  git remote add aum-core "$AUM_CORE_REMOTE"
  if [ $? -eq 0 ]; then
    echo "Remote 'aum-core' added"
  else
    echo "Failed to add remote"
    exit 1
  fi
fi

echo ""
echo "Step 2: Fetching from aum-core remote..."
git fetch aum-core
if [ $? -ne 0 ]; then
  echo "Failed to fetch from remote"
  exit 1
fi
echo "Fetched successfully"

echo ""
echo "Step 3: Checking libs/aum-core directory..."

if [ -d "libs/aum-core" ]; then
  echo "libs/aum-core directory exists"
  echo ""
  echo "   This directory will be removed and replaced with the subtree."
  echo "   Make sure you have:"
  echo "   1. Committed all changes"
  echo "   2. Backed up any important custom modifications"
  echo ""
  read -p "   Continue? (y/n) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Aborted by user"
    exit 1
  fi

  echo "Removing existing libs/aum-core..."
  git rm -r libs/aum-core
  git commit -m "chore: prepare for aum-core subtree setup - remove old aum-core"
  echo "Removed and committed"
else
  echo "libs/aum-core does not exist (clean slate)"
fi

echo ""
echo "Step 4: Adding aum-core as subtree..."
git subtree add --prefix=libs/aum-core aum-core "$AUM_CORE_BRANCH" --squash

if [ $? -eq 0 ]; then
  echo "Subtree added successfully"
else
  echo "Failed to add subtree"
  exit 1
fi

echo ""
echo "Step 5: Verifying subtree setup..."
if [ -d "libs/aum-core" ]; then
  echo "libs/aum-core directory exists and looks good"
else
  echo "Something went wrong - libs/aum-core not found"
  exit 1
fi

echo ""
echo "Step 6: Checking for update script..."
if [ -f "scripts/update-aum-core.sh" ]; then
  echo "Update script already exists"
else
  echo "Update script not found - creating scripts/update-aum-core.sh..."

  mkdir -p scripts
  cat > scripts/update-aum-core.sh << 'EOF'
#!/bin/bash

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Pulling latest AUM Core updates..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

git subtree pull --prefix=libs/aum-core aum-core aum-core-dist --squash -m "chore: update aum-core from aum-core-dist"

if [ $? -eq 0 ]; then
  echo ""
  echo "Successfully pulled AUM Core updates"
  echo ""
  echo "Next steps:"
  echo "1. Review changes : git diff HEAD~1"
  echo "2. Run tests      : npm run test"
  echo "3. Run build      : npm run build"
  echo "4. Test locally   : npm run serve"
  echo ""
else
  echo ""
  echo "Failed to pull AUM Core updates"
  echo "Please resolve any conflicts manually"
  echo ""
fi
EOF

  chmod +x scripts/update-aum-core.sh
  echo "Update script created"
fi

echo ""
echo "Step 7: Checking package.json for update-core script..."
if grep -q '"update-core"' package.json; then
  echo "npm script 'update-core' already exists"
else
  echo "npm script not found in package.json"
  echo "   Please add the following to your package.json scripts:"
  echo "   \"update-core\": \"./scripts/update-aum-core.sh\""
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "AUM Core Subtree Setup Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Next Steps:"
echo ""
echo "1. Ensure package.json has the update command:"
echo "   \"update-core\": \"./scripts/update-aum-core.sh\""
echo ""
echo "2. Test the setup:"
echo "   npm run build"
echo ""
echo "3. To pull future updates:"
echo "   npm run update-core"
echo ""
echo "Remote configured : aum-core -> $AUM_CORE_REMOTE"
echo "Branch            : $AUM_CORE_BRANCH"
echo "Location          : libs/aum-core/"
echo ""
