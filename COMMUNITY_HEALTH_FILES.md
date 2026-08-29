# GitHub Community Health Files

This document provides an overview of all GitHub-recognized community health files in this repository and explains how they appear in GitHub's navigation interface.

## What Are Community Health Files?

Community health files are special files that GitHub recognizes and displays prominently in the repository interface. They help contributors and users understand how to interact with the project, report issues, contribute code, and get support.

## GitHub Repository Navigation

When you view this repository on GitHub (especially on mobile), you'll see navigation tabs that provide quick access to important documentation:

- **README** - Project overview and getting started
- **Code of conduct** - Community standards
- **Contributing** - How to contribute
- **License** - Legal terms
- **Security** - Security policies
- **More** dropdown with additional files

These tabs are automatically generated based on the presence of specific files in the repository.

## Files in This Repository

### Core Documentation Files

#### ✅ README.md

**Location:** `/README.md`  
**Appears In:** Main navigation tab (always visible)  
**Purpose:** Primary project documentation, overview, and quick start guide

Our README includes:

- Project description and purpose
- Quick links to all major documentation
- Organization information (501(c)(3) nonprofit)
- CNCF compliance statement
- Technical stack overview

#### ✅ LICENSE

**Location:** `/LICENSE`  
**Appears In:** License tab in navigation  
**Purpose:** Legal terms under which the project is released

Our license:

- Apache 2.0 open source license
- Copyright by Free For Charity (EIN: 46-2471893)
- Full text of Apache 2.0 terms

#### ✅ CODE_OF_CONDUCT.md

**Location:** `/CODE_OF_CONDUCT.md`  
**Appears In:** Code of conduct tab in navigation  
**Purpose:** Community behavior standards and enforcement

Our code of conduct:

- Based on Contributor Covenant 2.1
- Defines acceptable and unacceptable behavior
- Outlines enforcement responsibilities
- Provides reporting mechanisms

#### ✅ CONTRIBUTING.md

**Location:** `/CONTRIBUTING.md`  
**Appears In:** Contributing tab in navigation (and sidebar)  
**Purpose:** Guidelines for contributing to the project

Our contributing guide includes:

- Getting started instructions
- Development workflow
- Coding standards
- Testing guidelines
- Commit message conventions
- Pull request process
- Reviewer onboarding

#### ✅ SECURITY.md

**Location:** `/SECURITY.md`  
**Appears In:** Security tab in navigation  
**Purpose:** Security policies and vulnerability reporting

Our security documentation includes:

- Branch protection rules
- Signed commits requirement
- Security scanning setup
- Vulnerability reporting process
- Security best practices

#### ✅ SUPPORT.md

**Location:** `/SUPPORT.md`  
**Appears In:** Repository sidebar (Support section)  
**Purpose:** How to get help and support

Our support guide includes:

- Contact information
- How to report bugs
- How to ask questions
- Documentation links
- Response time expectations

### GitHub-Specific Files

#### ✅ .github/FUNDING.yml

**Location:** `/.github/FUNDING.yml`  
**Appears In:** "Sponsor" button in repository header  
**Purpose:** Funding and sponsorship options

Our funding file includes:

- GitHub Sponsors link
- Custom donation links to our website
- Direct links to donation forms

#### ✅ .github/CODEOWNERS

**Location:** `/.github/CODEOWNERS`  
**Appears In:** Pull request review assignments  
**Purpose:** Defines who owns specific files/directories

Our CODEOWNERS file:

- Assigns @clarkemoyer as default owner
- Specifies owners for security files
- Defines ownership for documentation
- Sets ownership for configuration files

#### ✅ .github/PULL_REQUEST_TEMPLATE.md

**Location:** `/.github/PULL_REQUEST_TEMPLATE.md`  
**Appears In:** Automatically populates PR descriptions  
**Purpose:** Standardizes pull request information

Our PR template includes:

- Description section
- Type of change checklist
- Testing performed checklist
- Documentation updates checklist
- Breaking changes section

#### ✅ .github/ISSUE_TEMPLATE/

**Location:** `/.github/ISSUE_TEMPLATE/`  
**Appears In:** Issue creation page  
**Purpose:** Provides templates for different issue types

Our issue templates:

- **bug_report.md** - For reporting bugs
- **feature_request.md** - For suggesting features
- **documentation.md** - For documentation issues
- **reviewer-onboarding.md** - For new reviewer onboarding
- **config.yml** - Configuration with support links

### Additional Documentation Files

#### ✅ CITATION.cff

**Location:** `/CITATION.cff`  
**Appears In:** "Cite this repository" button  
**Purpose:** Provides citation information for academic use

Our citation file includes:

- Author information
- Project metadata
- Version information
- Keywords and abstract

#### ✅ CHANGELOG.md

**Location:** `/CHANGELOG.md`  
**Appears In:** Linked from README and releases  
**Purpose:** Documents all notable changes to the project

Our changelog follows:

- [Keep a Changelog](https://keepachangelog.com/) format
- [Semantic Versioning](https://semver.org/)
- Categorized changes (Added, Changed, Fixed, etc.)

#### ✅ CONTRIBUTORS.md

**Location:** `/CONTRIBUTORS.md`  
**Appears In:** Linked from README, CONTRIBUTING, and community pages  
**Purpose:** Recognition of all project contributors

Our contributors file includes:

- Current contributors list with roles and contributions
- Project leadership information
- Types of contributions recognized (code, docs, design, etc.)
- How to add yourself as a contributor
- Recognition guidelines and levels
- Contribution statistics
- Emeritus contributors and special thanks

This follows CNCF best practices for transparent contributor recognition and community building.

### Project-Specific Documentation

The repository also includes extensive project-specific documentation:

- **GOVERNANCE.md** - Project governance and decision-making
- **MAINTAINERS.md** - List of maintainers and their roles
- **CONTRIBUTORS.md** - Recognition of all project contributors
- **THREAT-MODEL.md** - Security threat analysis
- **TESTING.md** - Comprehensive testing guide
- **DEPLOYMENT.md** - Deployment instructions
- **QUICK_START.md** - 5-minute setup guide
- **ADOPTERS.md** - Organizations using this template
- **EXTERNAL_DEPENDENCIES.md** - Third-party services documentation

And many more technical guides and documentation files.

## How GitHub Surfaces These Files

### Automatic Detection

GitHub automatically detects these files in three locations:

1. **Repository root** (`/`)
2. **`.github` directory** (`/.github/`)
3. **`docs` directory** (`/docs/`) (for some files)

### Navigation Display Priority

GitHub displays files in this order:

1. README (always first)
2. Code of conduct
3. Contributing
4. License
5. Security
6. Additional files in "More" dropdown

### Mobile vs Desktop Display

- **Mobile**: Bottom navigation tabs with "More" dropdown
- **Desktop**: Sidebar links and repository navigation

## Verification

To verify all community health files are properly recognized:

1. Visit the repository on GitHub: https://github.com/FreeForCharity/FFC-IN-FFC_Single_Page_Template
2. Check for navigation tabs (mobile) or sidebar links (desktop)
3. Look for the "Sponsor" button (indicates FUNDING.yml is recognized)
4. Create a new issue to see issue templates
5. Create a new PR to see the PR template
6. Check for "Cite this repository" button (indicates CITATION.cff is recognized)

## Community Standards Checklist

GitHub provides a community standards checklist at:  
`https://github.com/[owner]/[repo]/community`

For this repository:  
https://github.com/FreeForCharity/FFC-IN-FFC_Single_Page_Template/community

This checklist shows which files are present and recognized.

## Best Practices

### Maintaining Community Health Files

1. **Keep files up to date** - Review and update regularly
2. **Use consistent formatting** - Follow GitHub's recommendations
3. **Link between files** - Create a web of documentation
4. **Be clear and concise** - Make information easy to find
5. **Use templates** - Provide templates for common tasks
6. **Test the experience** - View files as a new contributor would

### File Locations

Follow these conventions:

- **Root directory**: README, LICENSE, CODE_OF_CONDUCT, CONTRIBUTING, SECURITY, SUPPORT, CITATION.cff, CHANGELOG
- **.github directory**: FUNDING.yml, CODEOWNERS, PULL_REQUEST_TEMPLATE.md, ISSUE_TEMPLATE/
- **Keep organized**: Group related files together

### Content Guidelines

- **Be welcoming** - Use inclusive language
- **Be specific** - Provide clear instructions
- **Be helpful** - Anticipate questions
- **Be professional** - Maintain appropriate tone
- **Be accurate** - Keep information current

## References

- [GitHub Docs - Community Health Files](https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/creating-a-default-community-health-file)
- [GitHub Docs - About READMEs](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes)
- [GitHub Docs - About Code Owners](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners)
- [GitHub Docs - About Citation Files](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-citation-files)
- [Keep a Changelog](https://keepachangelog.com/)
- [Semantic Versioning](https://semver.org/)

## Contact

For questions about community health files or documentation:

- **Email**: clarkemoyer@freeforcharity.org
- **Create an issue**: [Documentation issue](https://github.com/FreeForCharity/FFC-IN-FFC_Single_Page_Template/issues/new?template=documentation.md)

---

**Last Updated:** December 2025  
**Maintained By:** Free For Charity (@clarkemoyer)
