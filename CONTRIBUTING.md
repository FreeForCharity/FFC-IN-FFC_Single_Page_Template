# Contributing to Free For Charity

Thank you for your interest in contributing to Free For Charity! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [AI-Assisted Development](#ai-assisted-development)
3. [Reviewer Onboarding](#reviewer-onboarding)
4. [Getting Started](#getting-started)
5. [Development Workflow](#development-workflow)
6. [Coding Standards](#coding-standards)
7. [Testing Guidelines](#testing-guidelines)
8. [Commit Message Guidelines](#commit-message-guidelines)
9. [Pull Request Process](#pull-request-process)
10. [Communication Channels](#communication-channels)

---

## Code of Conduct

We are committed to providing a welcoming and inclusive environment for all contributors. By participating in this project, you agree to abide by our [Code of Conduct](./CODE_OF_CONDUCT.md).

**Key principles**:

- **Be respectful**: Treat all contributors with respect and courtesy
- **Be collaborative**: Work together to improve the project
- **Be constructive**: Provide helpful feedback and be open to receiving it
- **Be inclusive**: Welcome contributors from all backgrounds and experience levels

For full details on community standards and reporting procedures, please read the complete [Code of Conduct](./CODE_OF_CONDUCT.md)

---

## AI-Assisted Development

We encourage the use of AI tools, particularly **GitHub Copilot**, to enhance the quality and efficiency of contributions to this project.

### GitHub Copilot for Issue-to-PR Workflow

We prefer using GitHub Copilot's issue-to-PR functionality for creating pull requests. This approach helps to:

- Generate consistent, well-structured code changes
- Ensure comprehensive coverage of the issue requirements
- Reduce manual coding errors
- Accelerate the development process

**To use Copilot for creating PRs from issues:**

1. Navigate to an issue in the repository.
2. Assign Copilot to the issue by selecting `copilot` from the "Assignees" dropdown in the issue sidebar. This is the primary way to invoke Copilot from the GitHub UI.
3. Copilot will automatically analyze the issue and generate a proposed pull request with code changes.
4. Review the generated code changes in the PR before requesting human review.

For more details, see [GitHub's documentation on using Copilot to work on issues](https://docs.github.com/en/copilot/how-tos/use-copilot-for-common-tasks/use-copilot-to-create-or-update-issues).

### Copilot-Based Code Reviews

**All code submissions should undergo Copilot-based reviews.** Contributors should:

1. Request a Copilot code review on your pull request by selecting Copilot as a reviewer from the "Reviewers" dropdown, or by commenting `@copilot review` on the PR. For more details, see [GitHub Copilot Code Review documentation](https://docs.github.com/en/copilot/using-github-copilot/code-review/using-copilot-code-review).
2. Review all comments and suggestions provided by Copilot.
3. Address relevant feedback (use your judgment—not all suggestions may apply to the project context).
4. Re-run the Copilot review after making changes.
5. Repeat this process until no additional actionable comments remain.
6. Then request human reviewer approval.

This iterative review process helps ensure that:

- Code quality is higher
- Coding standards are consistently adhered to
- Potential issues are detected early
- Code changes are comprehensively documented

### Best Practices for Using GitHub Copilot

Follow these best practices when using GitHub Copilot:

1. **Review all suggestions carefully** - Never blindly accept Copilot suggestions; always verify the code is correct and appropriate
2. **Provide clear context** - Write descriptive comments and function names to help Copilot generate better suggestions
3. **Use Copilot Chat for explanations** - Ask Copilot to explain complex code or suggest improvements
4. **Verify security implications** - Review generated code for potential security vulnerabilities
5. **Test generated code thoroughly** - Always test Copilot-generated code before committing
6. **Keep suggestions contextual** - Ensure generated code follows the project's existing patterns and conventions
7. **Use inline suggestions wisely** - Accept partial suggestions when they're helpful, modify or reject when they're not
8. **Leverage Copilot for documentation** - Use it to generate JSDoc comments, README updates, and code documentation

### Accessing Multiple AI Models in GitHub Copilot (VS Code)

GitHub Copilot in VS Code provides access to multiple advanced AI models—including **OpenAI GPT-4**, **Google Gemini**, and **Anthropic Claude**—directly through GitHub's infrastructure. You do not need to integrate external AI providers or supply your own API keys; model selection is managed within Copilot's interface.

#### Model Selection and Availability

You can choose among available AI models using Copilot's model selector feature. The specific models offered depend on your subscription tier and GitHub's current offerings.

1. **Install GitHub Copilot Chat Extension**
   - Ensure you have the GitHub Copilot Chat extension installed in VS Code
   - Sign in with your GitHub account that has Copilot access

2. **Access Model Selection**
   - Open the Copilot Chat panel in VS Code
   - Look for the model selector dropdown (typically at the bottom of the chat input)
   - Available models may include GPT-4, Claude, Gemini, and others depending on your subscription tier

3. **Using Claude Models**
   - Select a Claude model from the model picker (availability depends on subscription tier)
   - Claude excels at detailed code explanations, complex refactoring, and nuanced code reviews
   - Use for tasks requiring deep reasoning about code architecture

4. **Using OpenAI Models**
   - GPT-4 and GPT-4o models are the primary models available through Copilot (availability depends on subscription tier)
   - Particularly effective for general coding tasks and broad language support
   - Good for quick iterations and code completion

5. **Using Google Gemini Models**
   - Gemini models may be accessed through the Copilot interface (availability depends on subscription tier)
   - Strong performance on multi-modal tasks and code understanding
   - Useful for analyzing code alongside documentation or images

#### Best Practices for Multi-Model Usage

- **Match the model to the task** - Different models have different strengths; experiment to find what works best for specific tasks
- **Maintain consistency** - When working on a single feature, try to use the same model for consistency
- **Compare outputs** - For critical code changes, consider getting suggestions from multiple models
- **Document your approach** - If you use a specific model for a particular type of task, note it in PR descriptions for team awareness

#### VS Code Configuration Tips

```json
// Example VS Code settings for Copilot (settings.json)
// Adjust languages based on your project needs
{
  "github.copilot.enable": {
    "*": true,
    "typescript": true,
    "typescriptreact": true
  }
}
```

**Note:** Access to alternative AI providers may require specific subscription tiers. GitHub Copilot Individual provides access to core models, while GitHub Copilot Business and Enterprise may offer additional model options. Check your GitHub Copilot subscription details and the [GitHub Copilot documentation](https://docs.github.com/copilot) for currently available models.

---

## Reviewer Onboarding

### Your First Contribution: Perform a Fresh Review

**New to the project? Start here!** We believe fresh perspectives are invaluable for identifying usability issues, bugs, and enhancement opportunities that long-time contributors might overlook.

### What is a Fresh Review?

A fresh review is a comprehensive evaluation of the live Free For Charity website from a new user's perspective. As a new reviewer, your first contribution will be to:

1. **Explore the live application** thoroughly
2. **Document your findings** - both positive and negative
3. **Report any issues** you discover
4. **Suggest improvements** based on your experience

This approach helps you:

- Understand the project deeply before making code contributions
- Provide valuable feedback from a user's viewpoint
- Identify real-world usability and functionality issues
- Build familiarity with the codebase and architecture

### How to Perform Your Fresh Review

#### Step 1: Visit the Live Site

Start by exploring the live Free For Charity website:

- **Production Site:** [https://ffcworkingsite1.org](https://ffcworkingsite1.org)
- **GitHub Pages:** [https://freeforcharity.github.io/FFC_Single_Page_Template/](https://freeforcharity.github.io/FFC_Single_Page_Template/)

#### Step 2: Comprehensive Evaluation

Test the application thoroughly across multiple dimensions:

**Functionality:**

- Navigate through all sections of the homepage
- Test the navigation menu (both desktop and mobile)
- Try the Donate and Volunteer CTAs (if enabled)
- Explore all policy pages (Privacy Policy, Terms, etc.)
- Test all interactive elements (buttons, links, forms)

**Usability:**

- Evaluate the clarity of the site's purpose and messaging
- Assess ease of navigation and information architecture
- Check for broken links or missing pages
- Verify that CTAs are clear and prominent

**Design & Responsiveness:**

- Test on multiple devices (desktop, tablet, mobile)
- Check responsive behavior at different screen sizes
- Evaluate visual consistency and branding
- Assess color contrast and readability

**Performance:**

- Note page load times
- Check for smooth scrolling and transitions
- Identify any slow-loading resources

**Accessibility:**

- Test keyboard navigation
- Check color contrast for readability
- Verify alt text on images
- Test with screen readers if possible

**Content:**

- Review text for clarity, grammar, and accuracy
- Check that information is up-to-date
- Identify any missing or incomplete content

#### Step 3: Create Your Review Issue

Once you've completed your evaluation, create a review issue to document your findings:

1. **Navigate to the Issues tab** in the GitHub repository
2. **Click "New Issue"**
3. **Select the "Reviewer Onboarding - Fresh Review" template**
4. **Fill out all sections** of the template:
   - Reviewer information (your name, date, duration)
   - Areas you evaluated
   - Review environment (browsers, devices tested)
   - Overall impressions
   - Positive observations
   - Issues discovered
   - Enhancement recommendations
   - Accessibility and performance notes

5. **Use a clear title** format: `[REVIEW] Fresh Review by [Your Name] - [Date]`
6. **Assign yourself** to the issue
7. **Add labels:** `documentation`, `review`, `onboarding`

#### Step 4: Report Individual Issues

For each bug or problem you discovered:

1. **Create a separate issue** for each distinct problem
2. **Use appropriate labels:**
   - `bug` - for broken functionality
   - `enhancement` - for improvement suggestions
   - `accessibility` - for accessibility issues
   - `performance` - for performance problems
   - `documentation` - for documentation issues

3. **Link back to your review issue** by mentioning it (e.g., "Discovered during review #123")
4. **Provide detailed information:**
   - Clear description of the problem
   - Steps to reproduce
   - Expected vs. actual behavior
   - Screenshots or recordings when helpful
   - Browser/device information

#### Step 5: Engage with the Team

After creating your review issue:

1. **Share your review** in GitHub Discussions or mention maintainers
2. **Be responsive** to questions or feedback on your findings
3. **Prioritize your findings** if asked (what's most critical?)
4. **Offer to help** fix issues you're capable of addressing

### Direct Link to Create a Review Issue

You can create a new reviewer onboarding issue directly using this link:

[**Create Reviewer Onboarding Issue**](https://github.com/FreeForCharity/FFC_Single_Page_Template/issues/new?assignees=&labels=documentation%2Creview%2Conboarding&template=reviewer-onboarding.md)

### Tips for a Great Review

**Be Thorough:**

- Spend at least 30-60 minutes exploring the site
- Test on multiple browsers and devices if possible
- Click every link and button
- Try edge cases (very long text, small screens, etc.)

**Be Honest:**

- Report everything you find, even small issues
- Don't hold back on constructive criticism
- Highlight what works well, not just problems

**Be Specific:**

- Include screenshots or screen recordings
- Provide exact steps to reproduce issues
- Note browser/device details for bugs
- Quote specific text that's unclear or incorrect

**Be Constructive:**

- Explain why something is a problem
- Suggest possible solutions when you can
- Think about the user experience
- Consider accessibility and inclusivity

**Be Professional:**

- Use respectful, collaborative language
- Focus on the work, not the people
- Assume good intentions
- Remember we're all learning

### What Happens Next?

After you submit your fresh review:

1. **Maintainers will review** your findings
2. **Issues will be triaged** and prioritized
3. **You may be asked** for clarification or additional testing
4. **You'll be welcomed** to contribute fixes or improvements
5. **Your input will help** improve the site for all users

### Benefits of Starting with a Review

Starting your contribution journey with a fresh review:

- **Builds familiarity** with the project without diving into code immediately
- **Provides value** even if you're not ready to code yet
- **Identifies real issues** that affect actual users
- **Creates opportunities** to contribute fixes later
- **Establishes credibility** and shows initiative
- **Helps maintainers** see the project through new eyes

### Ready to Review?

1. Visit [https://ffcworkingsite1.org](https://ffcworkingsite1.org)
2. Explore thoroughly and take notes
3. [Create your review issue](https://github.com/FreeForCharity/FFC_Single_Page_Template/issues/new?assignees=&labels=documentation%2Creview%2Conboarding&template=reviewer-onboarding.md)
4. Report individual issues you discover
5. Engage with the team on your findings

**Thank you for helping make Free For Charity better! Your fresh perspective is valuable.**

---

## Getting Started

### Prerequisites

- **Node.js**: Version 24.x (validated with v24.18.0)
- **npm**: Package manager (comes with Node.js)
- **Git**: Version control
- **Code Editor**: We recommend VS Code with the following extensions:
  - ESLint
  - Prettier (if formatting is enabled)
  - Tailwind CSS IntelliSense

### Setting Up Your Development Environment

1. **Fork the repository** on GitHub

2. **Clone your fork**:

   ```bash
   git clone https://github.com/YOUR_USERNAME/FFC_Single_Page_Template.git
   cd FFC_Single_Page_Template
   ```

3. **Add upstream remote**:

   ```bash
   git remote add upstream https://github.com/FreeForCharity/FFC_Single_Page_Template.git
   ```

4. **Install dependencies**:

   ```bash
   npm install
   ```

5. **Start the development server**:

   ```bash
   npm run dev
   ```

   Visit http://localhost:3000 to see the site running locally.

### Verify Your Setup

Run the following commands to ensure everything is working:

```bash
# Run linting
npm run lint

# Run unit tests
npm test

# Build the project
npm run build

# Run E2E tests (requires build first)
npm run test:e2e
```

---

## Development Workflow

### Creating a New Branch

Always create a new branch for your work:

```bash
# Update your main branch
git checkout main
git pull upstream main

# Create a new feature branch
git checkout -b feature/your-feature-name
```

Branch naming conventions:

- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `test/description` - Test additions or updates
- `refactor/description` - Code refactoring

### Making Changes

1. **Make your changes** in your feature branch
2. **Test your changes** locally:

   ```bash
   npm run lint        # Check for linting errors
   npm test           # Run unit tests
   npm run build      # Ensure it builds successfully
   npm run test:e2e   # Run E2E tests
   ```

3. **Commit your changes** with clear, descriptive messages (see [Commit Message Guidelines](#commit-message-guidelines))

4. **Keep your branch up to date**:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

### Testing Your Changes

Before submitting a pull request:

1. **Run all tests**:

   ```bash
   npm test              # Unit tests
   npm run test:coverage # Check test coverage
   npm run test:e2e     # E2E tests
   ```

2. **Test manually**:
   - Test on different screen sizes (mobile, tablet, desktop)
   - Test navigation and all interactive elements
   - Verify images and assets load correctly
   - Check console for errors

3. **Verify the build**:
   ```bash
   npm run build
   npm run preview
   ```

---

## Coding Standards

### TypeScript/JavaScript

- Use **TypeScript** for all new files
- Follow **functional programming** principles where possible
- Use **arrow functions** for component definitions
- Prefer **const** over **let**, avoid **var**
- Use **meaningful variable names** that describe their purpose

### React Components

- Use **functional components** with hooks
- Keep components **small and focused** (single responsibility)
- Use **TypeScript interfaces** for props and state
- Place **"use client"** directive at the top when client-side features are needed
- Organize components in the appropriate directory:
  - `/src/components` - Shared/reusable components
  - `/src/app` - Page-specific components

### Styling

- Use **Tailwind CSS** for styling
- Follow a **mobile-first** approach
- Use **existing Tailwind classes** before creating custom CSS
- Group related classes together for readability
- Use consistent spacing and sizing scales

Example:

```tsx
// Good
<div className="flex flex-col gap-4 p-6 bg-white rounded-lg shadow-md">
  <h2 className="text-2xl font-bold text-gray-900">Title</h2>
  <p className="text-gray-600">Content</p>
</div>

// Avoid inline styles
<div style={{ padding: '24px' }}> // ❌
```

### File Organization

- One component per file
- Name files using **PascalCase** for components: `MyComponent.tsx`
- Name files using **camelCase** for utilities: `assetPath.ts`
- Keep related files together in directories
- Use `index.tsx` for directory exports when appropriate

---

## Testing Guidelines

### Unit Tests

- Write tests for all new components and utilities
- Place tests in `__tests__` directory, mirroring the source structure
- Name test files: `ComponentName.test.tsx` or `utilityName.test.ts`
- Use **Jest** and **React Testing Library**
- Aim for meaningful test coverage, not just high percentages

#### Writing Good Tests

```tsx
// Good test structure
describe('ComponentName', () => {
  it('should render correctly', () => {
    render(<ComponentName />)
    expect(screen.getByRole('heading')).toBeInTheDocument()
  })

  it('should handle user interaction', () => {
    render(<ComponentName />)
    fireEvent.click(screen.getByRole('button'))
    expect(screen.getByText('Updated')).toBeInTheDocument()
  })
})
```

### E2E Tests

- Write E2E tests for critical user flows
- Place E2E tests in the `tests` directory
- Use **Playwright** for E2E testing
- Test across different viewports when relevant

### Test Coverage Goals

- **Current**: 26 unit tests passing (4 test suites)
- **Minimum**: 5% overall coverage (current threshold)
- **Target**: 15-20% coverage for initial implementation
- **Long-term goal**: 50%+ coverage

---

## Commit Message Guidelines

We follow a conventional commit message format to maintain a clear and organized git history.

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semicolons, etc.)
- `refactor`: Code refactoring without changing functionality
- `test`: Adding or updating tests
- `chore`: Maintenance tasks, dependency updates
- `perf`: Performance improvements
- `ci`: CI/CD changes

### Examples

```bash
# Feature addition
git commit -m "feat: add dark mode toggle component"

# Bug fix
git commit -m "fix: resolve mobile navigation menu not closing"

# Documentation
git commit -m "docs: update README with new deployment instructions"

# Multiple lines
git commit -m "feat: implement user authentication

- Add login component
- Add logout functionality
- Add protected route wrapper
- Update navigation to show user status"
```

### Guidelines

- Use the **imperative mood** ("add" not "added" or "adds")
- Keep the subject line under **50 characters**
- Capitalize the subject line
- Do not end the subject line with a period
- Use the body to explain **what** and **why**, not **how**
- Reference issues and pull requests when relevant

### Automated Validation

**Git hooks are configured to enforce code quality standards:**

- **Pre-commit hook**: Runs before every commit
  - Checks code formatting with Prettier
  - Runs ESLint to catch errors
  - Prevents commits with formatting or linting issues
- **Commit-msg hook**: Validates commit message format
  - Enforces conventional commit format
  - Ensures commit messages follow the type format above
  - Prevents commits with improperly formatted messages

**If a hook fails:**

```bash
# Fix formatting issues
npm run format

# Check linting
npm run lint

# If you need to bypass hooks in an emergency (NOT RECOMMENDED)
git commit --no-verify -m "your message"
```

**Note**: Husky git hooks are automatically installed when you run `npm install`.

---

## Pull Request Process

### Before Submitting

1. **Ensure all tests pass**:

   ```bash
   npm run lint
   npm test
   npm run test:e2e
   ```

2. **Update documentation** if needed:
   - Update README.md for new features
   - Add JSDoc comments to new functions
   - Update TESTING.md for new test approaches

3. **Verify the build works**:

   ```bash
   npm run build
   npm run preview
   ```

4. **Commit all changes** with proper commit messages

5. **Rebase on main** to ensure a clean history:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

### Creating a Pull Request

1. **Push your branch** to your fork:

   ```bash
   git push origin feature/your-feature-name
   ```

2. **Open a Pull Request** on GitHub from your fork to the main repository

3. **Fill out the PR template** with:
   - Clear description of changes
   - Related issue numbers (if applicable)
   - Screenshots for UI changes
   - Testing performed
   - Breaking changes (if any)

### PR Title Format

Use the same format as commit messages:

```
feat: add new feature
fix: resolve bug in component
docs: update contributing guidelines
```

### Review Process

1. **Automated checks** will run:
   - Linting
   - Unit tests
   - E2E tests
   - Build verification
   - CodeQL security scan

2. **Code review** by maintainers:
   - At least one approval required
   - Address all review comments
   - Make changes in new commits (don't force push during review)

3. **Merge**:
   - Once approved and all checks pass, a maintainer will merge your PR
   - Your contribution will be included in the next release

### After Your PR is Merged

1. **Delete your branch**:

   ```bash
   git branch -d feature/your-feature-name
   git push origin --delete feature/your-feature-name
   ```

2. **Update your local main**:
   ```bash
   git checkout main
   git pull upstream main
   ```

---

## Communication Channels

### GitHub Issues

- Report bugs and request features through [GitHub Issues](https://github.com/FreeForCharity/FFC_Single_Page_Template/issues)
- Search existing issues before creating a new one
- Provide clear, detailed information
- Use issue templates when available

### GitHub Discussions

- Ask questions about the project
- Discuss ideas and proposals
- Share knowledge with other contributors

### Email

For sensitive matters, contact the maintainers directly:

- **Email**: hello@freeforcharity.org

---

## Additional Resources

- [README.md](./README.md) - Project overview and setup
- [TESTING.md](./TESTING.md) - Testing documentation
- [SECURITY.md](./SECURITY.md) - Security policies and procedures
- [SITE_IMPROVEMENTS.md](./SITE_IMPROVEMENTS.md) - Planned improvements and roadmap
- [Microsoft Learn: Contribute to an open-source project on GitHub](https://learn.microsoft.com/en-us/training/modules/contribute-open-source/) - Training module for contributing to open source

---

## Recognition

All contributors will be recognized in multiple ways:

- **[CONTRIBUTORS.md](./CONTRIBUTORS.md)** - Featured list of all project contributors
- **[CHANGELOG.md](./CHANGELOG.md)** - Mentioned in release notes
- **Git History** - Credited in commit messages
- **Pull Requests** - Acknowledged in PR descriptions and comments
- **Annual Reports** - Featured in Free For Charity's annual reports

We value all contributions, whether code, documentation, design, testing, or community support. Visit our [CONTRIBUTORS.md](./CONTRIBUTORS.md) page to see all the amazing people who have helped make this project possible.

Thank you for helping make Free For Charity better!

---

**Questions?** Feel free to open an issue or reach out to the maintainers. We're here to help!
