# Quick Start Guide

Get up and running with the FFC Single Page Template in 5 minutes.

> **Using this as a template?** See [TEMPLATE_USAGE.md](./TEMPLATE_USAGE.md) for complete setup instructions including GitHub settings configuration.

> **Quick checklist?** See [TEMPLATE_SETUP_CHECKLIST.md](./TEMPLATE_SETUP_CHECKLIST.md) for a printable checklist of required steps.

## Prerequisites

- **Node.js 24.x** - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** - [Download here](https://git-scm.com/)

## 5-Minute Setup

### 1. Clone the Repository (30 seconds)

```bash
git clone https://github.com/FreeForCharity/FFC_Single_Page_Template.git
cd FFC_Single_Page_Template
```

### 2. Install Dependencies (17 seconds)

```bash
npm install
```

**Expected output**: 1000+ packages installed successfully

### 3. Start Development Server (1 second)

```bash
npm run dev
```

**Open**: [http://localhost:3000](http://localhost:3000)

**Expected**: Site loads with FFC homepage

### 4. Verify Setup (2 minutes)

Run tests to ensure everything works:

```bash
# Lint code (2 seconds)
npm run lint

# Run unit tests (3 seconds)
npm test

# Build for production (20 seconds)
npm run build
```

**Expected**: All checks pass with 0 errors (8 warnings about `<img>` tags and React hooks are expected)

---

## Common Tasks

### Development

```bash
# Start dev server with hot reload
npm run dev

# Start on different port
PORT=3001 npm run dev
```

### Code Quality

```bash
# Format code with Prettier
npm run format

# Check formatting without changes
npm run format:check

# Lint code with ESLint
npm run lint
```

### Testing

```bash
# Run unit tests
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run E2E tests with Playwright
npm run test:e2e

# Run E2E tests in headed mode (see browser)
npm run test:e2e:headed

# Open Playwright UI
npm run test:e2e:ui
```

### Building & Previewing

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
# Opens at http://localhost:3000

# Check for broken links (requires build first)
npm run check-links
```

### Git Workflow

```bash
# Create a feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "feat: your feature description"

# Push to remote
git push origin feature/your-feature-name
```

**Note**: Pre-commit hooks will automatically run formatting and linting checks.

---

## Project Structure (Quick Reference)

```
FFC_Single_Page_Template/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with metadata
│   │   ├── page.tsx            # Homepage
│   │   └── globals.css         # Global styles
│   ├── components/             # All UI components
│   │   ├── Header/             # Navigation header
│   │   ├── Footer/             # Footer component
│   │   ├── CookieConsent/      # Cookie consent banner
│   │   └── ...                 # 80+ other components
│   ├── lib/
│   │   └── assetPath.ts        # GitHub Pages asset helper
│   └── data/                   # Static content data
├── public/                     # Static assets (images, icons)
├── tests/                      # Playwright E2E tests
├── __tests__/                  # Jest unit tests
├── .github/workflows/          # CI/CD workflows
└── [config files]              # Next.js, ESLint, etc.
```

---

## Key Files to Know

| File                     | Purpose                               |
| ------------------------ | ------------------------------------- |
| `src/app/page.tsx`       | Homepage content                      |
| `src/app/layout.tsx`     | Site-wide layout and metadata         |
| `src/components/Header/` | Navigation and mobile menu            |
| `src/components/Footer/` | Footer with links and copyright       |
| `next.config.ts`         | Next.js configuration (static export) |
| `tailwind.config.ts`     | Tailwind CSS configuration            |
| `package.json`           | Dependencies and scripts              |
| `.prettierrc.json`       | Prettier formatting rules             |
| `commitlint.config.js`   | Commit message format rules           |

---

## Environment Variables

No environment variables are required for local development. The site works out of the box.

**Optional variables**:

```bash
# .env.local (create if needed)

# Optional: Set to 'production' to enable search engine indexing
NEXT_PUBLIC_SITE_ENV=development

# Optional: Override base path for deployment testing
NEXT_PUBLIC_BASE_PATH=

# Optional: Google Tag Manager ID
NEXT_PUBLIC_GTM_ID=
```

---

## Making Your First Change

### 1. Edit Homepage Content

Open `src/app/page.tsx` and find the hero section:

```tsx
<h1 className="text-4xl font-bold">Free For Charity</h1>
```

Change the text, save, and see it update instantly in your browser!

### 2. Add a New Component

Create `src/components/MyComponent/index.tsx`:

```tsx
export default function MyComponent() {
  return (
    <div className="p-4 bg-blue-500 text-white rounded-lg">
      <h2>My New Component</h2>
      <p>This is my first component!</p>
    </div>
  )
}
```

Import and use it in `src/app/page.tsx`:

```tsx
import MyComponent from '../components/MyComponent'

export default function Home() {
  return (
    <>
      <MyComponent />
      {/* ... rest of page */}
    </>
  )
}
```

### 3. Write a Test

Create `__tests__/components/MyComponent.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import MyComponent from '@/components/MyComponent'

describe('MyComponent', () => {
  it('renders the component', () => {
    render(<MyComponent />)
    expect(screen.getByText('My New Component')).toBeInTheDocument()
  })
})
```

Run the test:

```bash
npm test MyComponent
```

---

## Troubleshooting

### Port Already in Use

**Problem**: `Error: listen EADDRINUSE: address already in use :::3000`

**Solution**:

```bash
# Kill process on port 3000
npx kill-port 3000

# Or use a different port
PORT=3001 npm run dev
```

### Build Fails

**Problem**: `npm run build` fails

**Solution**:

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Try building again
npm run build
```

### Tests Fail

**Problem**: Unit tests fail with React warnings

**Solution**: Check if you're using React hooks correctly. Warnings about `act(...)` are common and can usually be ignored if tests pass.

**Problem**: E2E tests fail

**Solution**:

```bash
# Reinstall Playwright browsers
npx playwright install --with-deps chromium

# Run tests again
npm run test:e2e
```

### Pre-commit Hooks Not Running

**Problem**: Git commits succeed without running checks

**Solution**:

```bash
# Reinstall Husky hooks
npm run prepare

# Try committing again
git commit -m "test: verify hooks work"
```

### Module Not Found Errors

**Problem**: `Cannot find module '@/components/...'`

**Solution**: The `@` alias points to `src/`. Make sure:

1. File paths are correct
2. TypeScript can resolve the path (check `tsconfig.json`)
3. Restart your editor/terminal

---

## Next Steps

Now that you're set up, check out:

- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - How to contribute to the project
- **[TESTING.md](./TESTING.md)** - Detailed testing guide
- **[CODE_QUALITY.md](./CODE_QUALITY.md)** - Code quality standards
- **[RESPONSIVE_DESIGN.md](./RESPONSIVE_DESIGN.md)** - Responsive design guide
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Deployment instructions

---

## Getting Help

- **Issues**: [GitHub Issues](https://github.com/FreeForCharity/FFC_Single_Page_Template/issues)
- **Discussions**: [GitHub Discussions](https://github.com/FreeForCharity/FFC_Single_Page_Template/discussions)
- **Documentation**: Check the `*.md` files in the repository root

---

## Quick Command Reference

```bash
# Development
npm run dev                 # Start dev server
npm run build               # Build for production
npm run preview             # Preview production build

# Quality Checks
npm run lint                # Lint code
npm run format              # Format code
npm run format:check        # Check formatting

# Testing
npm test                    # Run unit tests
npm run test:watch          # Watch mode
npm run test:coverage       # With coverage
npm run test:e2e            # E2E tests
npm run test:e2e:headed     # E2E with browser
npm run check-links         # Check for broken links

# Other
npm install                 # Install dependencies
npm run prepare             # Setup git hooks
```

---

**Welcome to FFC Single Page Template! Happy coding! 🚀**

---

**Last Updated**: 2026-07-18  
**Version**: 0.1.0  
**Node.js**: 24.x (validated with v24.18.0)
