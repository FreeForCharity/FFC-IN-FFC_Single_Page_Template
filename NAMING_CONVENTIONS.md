# Naming Conventions and SEO Guidelines

## Folder and File Naming Standard

**All folders in this repository MUST use kebab-case (lowercase with hyphens).**

### Examples:

- ✅ **Correct**: `cookie-policy`, `home-page`, `google-tag-manager`
- ❌ **Incorrect**: `CookiePolicy`, `HomePage`, `GoogleTagManager`
- ❌ **Incorrect**: `cookie_policy`, `homePage`, `googleTagManager`

## Why Kebab-Case?

### 1. SEO (Search Engine Optimization)

Kebab-case is the industry standard for SEO-friendly URLs and is explicitly recommended by Google.

**Primary Sources:**

- **Google Search Central Documentation**
  - "Use hyphens (-) instead of underscores (\_) in your URLs"
  - "Words in the URL are split apart (e.g., `example.com/green-dress` not `example.com/greendress`)"
  - Reference: https://developers.google.com/search/docs/crawling-indexing/url-structure

- **Moz SEO Best Practices**
  - "Google treats hyphens as word separators while an underscore is treated as a word joiner"
  - "Search engines prefer kebab-case URLs for better keyword recognition"
  - Reference: https://moz.com/learn/seo/url

- **Google Webmaster Guidelines**
  - "Use hyphens to separate words in URLs - this helps users and search engines identify concepts in the URL more easily"
  - Reference: https://support.google.com/webmasters/answer/76329

**SEO Impact:**

| URL Format | SEO Recognition                            | Example                                |
| ---------- | ------------------------------------------ | -------------------------------------- |
| kebab-case | ✅ Excellent - Words recognized separately | `/cookie-policy` → "cookie" + "policy" |
| camelCase  | ❌ Poor - Seen as single word              | `/cookiePolicy` → "cookiepolicy"       |
| PascalCase | ❌ Poor - Seen as single word              | `/CookiePolicy` → "cookiepolicy"       |
| snake_case | ⚠️ Acceptable but not preferred            | `/cookie_policy` → debated recognition |

### 2. URL Readability

**User Experience:**

- Kebab-case URLs are easier for humans to read and remember
- Clear word separation improves comprehension
- Professional appearance

**Examples:**

```
✅ Good: https://your-domain.org/cookie-policy
❌ Bad:  https://your-domain.org/CookiePolicy
❌ Bad:  https://your-domain.org/cookiepolicy
```

### 3. Industry Standards

**Framework Conventions:**

- **Next.js**: Recommends kebab-case for route folders
- **React Router**: Uses kebab-case in documentation
- **Vue Router**: Standard convention is kebab-case
- **Angular**: Official style guide uses kebab-case

**Web Standards:**

- HTTP/REST APIs use kebab-case endpoints
- CSS classes traditionally use kebab-case
- HTML attributes use kebab-case

### 4. Accessibility

**Screen Reader Compatibility:**

- Screen readers handle hyphenated text more naturally
- Improved pronunciation and comprehension for users with disabilities
- Better compliance with WCAG (Web Content Accessibility Guidelines)

### 5. Technical Consistency

**Cross-Platform Compatibility:**

- Case-insensitive file systems (Windows) can cause issues with PascalCase
- Unix/Linux systems are case-sensitive, leading to potential bugs
- Kebab-case avoids case-sensitivity issues entirely

## Folder Structure Rules

### Components Folder (`src/components/`)

All component folders must use kebab-case:

```
src/components/
├── header/              ✅ Correct
├── footer/              ✅ Correct
├── cookie-consent/      ✅ Correct
├── google-tag-manager/  ✅ Correct
└── home-page/          ✅ Correct
```

### App Routes Folder (`src/app/`)

All route folders must use kebab-case (this directly impacts URL structure):

```
src/app/
├── cookie-policy/       → https://example.com/cookie-policy ✅
├── privacy-policy/      → https://example.com/privacy-policy ✅
├── terms-of-service/    → https://example.com/terms-of-service ✅
└── home-page/          → Used for components, not routes
```

## Historical Context

This project previously used a mix of PascalCase and kebab-case, which caused:

1. **Inconsistency**: Hard to predict folder names
2. **SEO Issues**: URLs didn't follow best practices
3. **Developer Confusion**: Mixed conventions in imports

**Decision (December 2024)**: Standardized on kebab-case based on:

- SEO requirements
- Industry best practices
- Framework conventions
- Accessibility standards

## Additional Resources

### Official Documentation:

- [Google Search Central - URL Structure](https://developers.google.com/search/docs/crawling-indexing/url-structure)
- [Google SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [Moz - URL Best Practices](https://moz.com/learn/seo/url)

### Research and Analysis:

- [Search Engine Journal - URL Structure and SEO](https://www.searchenginejournal.com/technical-seo/url-structure/)
- [Ahrefs - SEO Best Practices for URLs](https://ahrefs.com/blog/url-structure/)

### Framework Guidelines:

- [Next.js Routing Documentation](https://nextjs.org/docs/app/building-your-application/routing)
- [Web.dev - URL Structure](https://web.dev/url/)

## Enforcement

All pull requests will be reviewed to ensure kebab-case naming conventions are followed. Any violations should be caught during:

1. Code review
2. Linting (where applicable)
3. Build process validation

## Questions?

If you're unsure about naming a new folder or file:

1. Use lowercase letters only
2. Separate words with hyphens (-)
3. Avoid special characters
4. Keep names descriptive but concise

Example: "Free Charity Web Hosting" → `free-charity-web-hosting`
