#!/bin/bash

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Pulling latest AUM Core updates..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Pull latest changes from aum-core aum-core-dist branch
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
