# Issue Resolution Guide

This document provides solutions to common issues, troubleshooting steps, and frequently asked questions for the Free For Charity project.

## Table of Contents

1. [Development Environment Issues](#development-environment-issues)
2. [Build Issues](#build-issues)
3. [Testing Issues](#testing-issues)
4. [Deployment Issues](#deployment-issues)
5. [Runtime Issues](#runtime-issues)
6. [FAQ](#faq)

---

## Development Environment Issues

### Issue: Node.js Version Mismatch

**Symptoms**:

- Build fails with incompatibility errors
- Packages fail to install
- Runtime errors about unsupported features

**Solution**:

```bash
# Check your Node.js version
node --version

# Should be 24.x or higher
# Install Node 24 if needed
# Using nvm (recommended):
nvm install 24
nvm use 24

# Or download from nodejs.org
```

### Issue: Port 3000 Already in Use

**Symptoms**:

```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solutions**:

**Option 1**: Kill the process using port 3000

```bash
# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Option 2**: Use a different port

```bash
PORT=3001 npm run dev
```

### Issue: npm install Fails

**Symptoms**:

- Permission errors
- Network timeouts
- Dependency conflicts

**Solutions**:

**Permission errors**:

```bash
# Don't use sudo with npm
# Fix npm permissions instead
npm config set prefix ~/.npm-global
export PATH=~/.npm-global/bin:$PATH
```

**Network timeouts**:

```bash
# Clear npm cache
npm cache clean --force

# Try again
npm install

# Or use a different registry
npm install --registry=https://registry.npmjs.org/
```

**Dependency conflicts**:

```bash
# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Clean install
npm install
```

### Issue: TypeScript Errors in IDE but Build Succeeds

**Symptoms**:

- VS Code shows TypeScript errors
- `npm run build` succeeds
- Types appear incorrect

**Solutions**:

1. **Restart TypeScript server** in VS Code:
   - Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows)
   - Type "TypeScript: Restart TS Server"
   - Select it

2. **Ensure VS Code is using workspace TypeScript**:
   - Check status bar at bottom right
   - Should show TypeScript version
   - Click and select "Use Workspace Version"

3. **Rebuild TypeScript types**:
   ```bash
   rm -rf node_modules/.cache
   npm run build
   ```

---

## Build Issues

### Issue: Build Fails with "Cannot find module"

**Symptoms**:

```
Error: Cannot find module '@/components/Header'
```

**Solutions**:

1. **Check the import path**:

   ```tsx
   // Correct
   import Header from '@/components/Header'

   // Wrong
   import Header from '@/components/header' // Case sensitivity!
   ```

2. **Verify the file exists**:

   ```bash
   ls -la src/components/Header
   ```

3. **Check tsconfig.json paths**:
   ```json
   {
     "compilerOptions": {
       "paths": {
         "@/*": ["./src/*"]
       }
     }
   }
   ```

### Issue: Build Succeeds but Images Don't Load

**Symptoms**:

- Build completes successfully
- Site displays but images return 404
- Console shows "Failed to load resource: 404"

**Solutions**:

1. **Use assetPath helper**:

   ```tsx
   import { assetPath } from '@/lib/assetPath'

   // Correct
   <img src={assetPath('/logo.png')} alt="Logo" />

   // Wrong
   <img src="/logo.png" alt="Logo" />
   ```

2. **Verify images are in public directory**:

   ```bash
   ls -la public/
   # Your images should be here
   ```

3. **Check NEXT_PUBLIC_BASE_PATH**:

   ```bash
   # For GitHub Pages
   NEXT_PUBLIC_BASE_PATH=/FFC_Single_Page_Template npm run build

   # For custom domain
   npm run build
   ```

### Issue: Out of Memory During Build

**Symptoms**:

```
FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory
```

**Solutions**:

1. **Increase Node.js memory**:

   ```bash
   NODE_OPTIONS="--max-old-space-size=4096" npm run build
   ```

2. **Add to package.json**:

   ```json
   {
     "scripts": {
       "build": "NODE_OPTIONS='--max-old-space-size=4096' next build"
     }
   }
   ```

3. **Check for memory leaks**:
   - Look for large circular references
   - Check for unused imports
   - Verify no infinite loops in build-time code

---

## Testing Issues

### Issue: Jest Tests Fail with "Cannot use import statement"

**Symptoms**:

```
SyntaxError: Cannot use import statement outside a module
```

**Solutions**:

1. **Check jest.config.js has correct setup**:

   ```javascript
   const nextJest = require('next/jest')
   const createJestConfig = nextJest({ dir: './' })
   ```

2. **Add transformIgnorePatterns** if needed:

   ```javascript
   module.exports = {
     transformIgnorePatterns: ['/node_modules/(?!(module-to-transform)/)'],
   }
   ```

3. **Verify jest.setup.js is loaded**:
   ```javascript
   setupFilesAfterEnv: ['<rootDir>/jest.setup.js']
   ```

### Issue: Tests Pass Locally but Fail in CI

**Symptoms**:

- All tests pass with `npm test`
- GitHub Actions shows test failures
- Different behavior in CI vs local

**Solutions**:

1. **Check environment variables**:

   ```yaml
   # In workflow file
   env:
     CI: true
     NODE_ENV: test
   ```

2. **Ensure deterministic tests**:

   ```tsx
   // Bad - relies on current date
   expect(getToday()).toBe('2024-12-03')

   // Good - mock the date
   jest.useFakeTimers()
   jest.setSystemTime(new Date('2024-12-03'))
   ```

3. **Clean up after tests**:
   ```tsx
   afterEach(() => {
     jest.clearAllMocks()
     cleanup()
   })
   ```

### Issue: Playwright Tests Timeout

**Symptoms**:

```
Error: Test timeout of 30000ms exceeded
```

**Solutions**:

1. **Increase timeout** for slow operations:

   ```typescript
   test('loads page', async ({ page }) => {
     await page.goto('/', { timeout: 60000 })
   })
   ```

2. **Wait for specific elements**:

   ```typescript
   // Bad - arbitrary wait
   await page.waitForTimeout(5000)

   // Good - wait for specific element
   await page.waitForSelector('h1', { state: 'visible' })
   ```

3. **Check if server is running**:
   ```bash
   # Make sure build was successful
   npm run build
   # Then run tests
   npm run test:e2e
   ```

---

## Deployment Issues

### Issue: GitHub Actions Deployment Fails

**Symptoms**:

- Workflow shows failure
- Site doesn't update
- Red X on commits

**Common Causes & Solutions**:

#### Build Failure

```bash
# Check build logs in Actions tab
# Fix reported errors locally first
npm run lint
npm test
npm run build
```

#### Test Failure

```bash
# Run tests locally
npm test
npm run test:e2e

# Fix failing tests
# Commit and push
```

#### Permission Issues

- Check repository Settings → Actions → General
- Ensure "Read and write permissions" is enabled
- Verify GitHub Pages is enabled in Settings → Pages

### Issue: Site Deployed but Shows 404

**Symptoms**:

- Workflow completes successfully
- Visiting site shows 404 error
- Console shows "Page not found"

**Solutions**:

1. **Check GitHub Pages settings**:
   - Go to Settings → Pages
   - Source should be "Deploy from a branch"
   - Branch should be set to `gh-pages` or correct branch
   - Folder should be `/ (root)`

2. **Verify base path configuration**:

   ```typescript
   // next.config.ts should have:
   output: 'export'

   // Build should use:
   NEXT_PUBLIC_BASE_PATH=/FFC_Single_Page_Template
   ```

3. **Check CNAME file** (if using custom domain):
   ```bash
   # Should be in public/CNAME
   cat public/CNAME
   # Should contain: ffcworkingsite1.org
   ```

### Issue: Images Load Locally but Not in Production

**Symptoms**:

- `npm run build && npm run preview` works fine
- Production site shows broken images
- 404 errors for images in console

**Solutions**:

1. **Ensure assetPath is used everywhere**:

   ```bash
   # Search for hardcoded paths
   grep -r 'src="/' src/
   # Should use assetPath helper
   ```

2. **Verify images in public directory**:

   ```bash
   npm run build
   ls -la out/_next/static/media/
   ```

3. **Check browser console** for exact 404 URLs:
   - Note the path being requested
   - Verify it matches your build output

---

## Runtime Issues

### Issue: "Hydration failed" Error

**Symptoms**:

```
Error: Hydration failed because the initial UI does not match what was rendered on the server
```

**Common Causes & Solutions**:

1. **HTML mismatch**:

   ```tsx
   // Bad - browser and server return different values
   ;<div>{new Date().toLocaleString()}</div>

   // Good - use useState to only show on client
   const [mounted, setMounted] = useState(false)
   useEffect(() => setMounted(true), [])
   if (!mounted) return null
   ```

2. **Nesting violations**:

   ```tsx
   // Bad - div inside p
   <p>
     <div>Content</div>
   </p>

   // Good - proper nesting
   <div>
     <p>Content</p>
   </div>
   ```

3. **Whitespace differences**:
   ```tsx
   // Can cause issues in some cases
   <div>{someCondition && <span>Text</span>}</div>
   ```

### Issue: "localStorage is not defined"

**Symptoms**:

```
ReferenceError: localStorage is not defined
```

**Solution**:

```tsx
// Bad - runs on server
const data = localStorage.getItem('key')

// Good - only runs on client
const [data, setData] = useState(null)
useEffect(() => {
  setData(localStorage.getItem('key'))
}, [])

// Or check for window
if (typeof window !== 'undefined') {
  const data = localStorage.getItem('key')
}
```

### Issue: Styles Not Applied After Deployment

**Symptoms**:

- Site loads but has no styling
- Looks like plain HTML
- CSS files return 404

**Solutions**:

1. **Check build output**:

   ```bash
   npm run build
   ls -la out/_next/static/css/
   ```

2. **Verify Tailwind config**:

   ```javascript
   // tailwind.config.js
   module.exports = {
     content: ['./src/**/*.{js,ts,jsx,tsx}'],
   }
   ```

3. **Check globals.css is imported**:
   ```tsx
   // src/app/layout.tsx
   import './globals.css'
   ```

---

## FAQ

### How do I add a new page?

Create a new directory in `src/app/`:

```bash
# Create new page
mkdir -p src/app/my-page
touch src/app/my-page/page.tsx

# Add content
echo 'export default function MyPage() {
  return <div>My Page</div>
}' > src/app/my-page/page.tsx
```

### How do I add a new component?

Create a new component in `src/components/`:

```bash
# Create component directory
mkdir -p src/components/MyComponent

# Create index file
touch src/components/MyComponent/index.tsx
```

### How do I run tests for a specific file?

```bash
# Unit test
npm test -- __tests__/components/Header.test.tsx

# E2E test
npm run test:e2e -- tests/logo.spec.ts
```

### How do I update dependencies?

```bash
# Check for updates
npm outdated

# Update specific package
npm update package-name

# Update all to latest
npm update

# Major version updates (careful!)
npx npm-check-updates -u
npm install
```

### How do I add environment variables?

1. **Local development**: Create `.env.local`

   ```env
   NEXT_PUBLIC_MY_VAR=value
   ```

2. **Production**: Add to GitHub Secrets
   - Go to Settings → Secrets → Actions
   - Add new secret
   - Reference in workflow with `${{ secrets.MY_SECRET }}`

### How do I debug a failing test?

```bash
# Run test in watch mode
npm run test:watch

# Run with verbose output
npm test -- --verbose

# Run specific test
npm test -- -t "test name"

# Debug in VS Code
# Add breakpoint and run Debug Jest Tests
```

### How do I check security vulnerabilities?

```bash
# Check for vulnerabilities
npm audit

# Fix automatically
npm audit fix

# Force fix (may break things)
npm audit fix --force

# View details
npm audit --json
```

### How do I improve Lighthouse scores?

See [LIGHTHOUSE.md](./LIGHTHOUSE.md) for detailed guidance. Quick tips:

1. Optimize images (WebP, proper sizes)
2. Remove unused JavaScript
3. Enable caching
4. Lazy load below-the-fold content
5. Minimize third-party scripts

### Where do I report bugs?

1. **Check existing issues** first: [GitHub Issues](https://github.com/FreeForCharity/FFC_Single_Page_Template/issues)
2. **Open a new issue** with:
   - Clear description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Your environment (OS, Node version, browser)

---

## Still Having Issues?

If your issue isn't covered here:

1. **Search GitHub Issues**: Someone may have encountered it before
2. **Check documentation**:
   - [README.md](./README.md)
   - [CONTRIBUTING.md](./CONTRIBUTING.md)
   - [TESTING.md](./TESTING.md)
   - [DEPLOYMENT.md](./DEPLOYMENT.md)
3. **Open a discussion**: GitHub Discussions for questions
4. **Contact maintainers**: hello@freeforcharity.org

---

**Last Updated**: 2026-07-18  
**Repository**: FreeForCharity/FFC_Single_Page_Template  
**Node.js**: 24.x (validated with v24.18.0)

_This document is continuously updated. If you solve an issue not listed here, please contribute by adding it!_
