# Content Replacement Guide

This guide identifies all the content you need to provide to replace the Free For Charity template content with your own charity's information. Each section of the website is listed with the specific variables, the current example content, and a space for you to fill in your charity's information.

## How to Use This Guide

1. **Review each section** of the website listed below
2. **Gather the required information** for your charity (text, images, links, etc.)
3. **Fill in the "Your Content" column** with your charity's information
4. **Prepare image files** where indicated (we'll tell you the recommended size)
5. **Have a developer** update the website files using this completed guide

## Understanding File Formats

- **Images**: Should be in common formats like `.png`, `.jpg`, `.webp`, or `.svg`
- **URLs**: Full website addresses starting with `https://` or `http://`
- **Text**: Can be plain text or include simple formatting
- **Video**: Video files or links to hosted videos (like YouTube, Vimeo)

---

## 1. NAVIGATION / HEADER SECTION

### Logo in Top Left Corner

| Section           | Variable              | Current Free For Charity Content                                                                           | Your Content                                                                                                                                                                                               |
| ----------------- | --------------------- | ---------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Header Navigation | Logo Image            | `assetPath('/Images/logo.webp')` (Free For Charity horizontal logo, served from `public/Images/logo.webp`) | _(Replace `public/Images/logo.webp` with your charity's horizontal logo, recommended size: 150px wide × 44px tall for best display. Keep the `assetPath()` wrapper so it works on GitHub Pages subpaths.)_ |
| Header Navigation | Logo Alt Text         | "Free For Charity"                                                                                         | _(Your charity name for accessibility)_                                                                                                                                                                    |
| Header Navigation | Logo Link Destination | "/" (homepage)                                                                                             | _(Usually "/" for homepage)_                                                                                                                                                                               |

### Navigation Menu Items

| Section         | Variable            | Current Free For Charity Content | Your Content |
| --------------- | ------------------- | -------------------------------- | ------------ |
| Navigation Menu | Menu Item 1 - Label | "Home"                           |              |
| Navigation Menu | Menu Item 1 - Link  | "/#hero"                         |              |
| Navigation Menu | Menu Item 2 - Label | "Mission"                        |              |
| Navigation Menu | Menu Item 2 - Link  | "/#mission"                      |              |
| Navigation Menu | Menu Item 3 - Label | "Programs"                       |              |
| Navigation Menu | Menu Item 3 - Link  | "/#programs"                     |              |
| Navigation Menu | Menu Item 4 - Label | "Volunteer"                      |              |
| Navigation Menu | Menu Item 4 - Link  | "/#volunteer"                    |              |
| Navigation Menu | Menu Item 5 - Label | "Donate"                         |              |
| Navigation Menu | Menu Item 5 - Link  | "/#donate"                       |              |
| Navigation Menu | Menu Item 6 - Label | "FAQ"                            |              |
| Navigation Menu | Menu Item 6 - Link  | "/#faq"                          |              |
| Navigation Menu | Menu Item 7 - Label | "Team"                           |              |
| Navigation Menu | Menu Item 7 - Link  | "/#team"                         |              |

---

## 2. HERO SECTION (Top of Homepage)

This is the first thing visitors see - it includes your main message and a circular logo image.

| Section | Variable                  | Current Free For Charity Content                                          | Your Content                                                                                         |
| ------- | ------------------------- | ------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Hero    | Main Heading Line 1       | "Welcome to"                                                              |                                                                                                      |
| Hero    | Main Heading Line 2       | "Free For Charity"                                                        |                                                                                                      |
| Hero    | Tagline / Description     | "Connecting Students, Professionals, & Businesses with Charities in Need" | _(Your charity's main tagline or mission statement, keep it under 100 characters for best display)_  |
| Hero    | Hero Circle Logo/Image    | `/Images/figma-hero-img.webp` (Free For Charity circular logo)            | _(File path to your charity's logo or representative image, recommended size: 445px × 445px square)_ |
| Hero    | Hero Image Alt Text       | "Hero image"                                                              | _(Description of your hero image)_                                                                   |
| Hero    | Primary Button Text       | "Volunteer"                                                               |                                                                                                      |
| Hero    | Primary Button Link       | "#volunteer"                                                              |                                                                                                      |
| Hero    | Secondary Button 1 Text   | "Donate"                                                                  |                                                                                                      |
| Hero    | Secondary Button 1 Link   | "#donate"                                                                 |                                                                                                      |
| Hero    | Secondary Button 2 Text   | "Our Programs"                                                            |                                                                                                      |
| Hero    | Secondary Button 2 Link   | "#programs"                                                               |                                                                                                      |
| Hero    | Background Color - Top    | #2E6F8E (dark blue)                                                       | _(Hex color code like #RRGGBB)_                                                                      |
| Hero    | Background Color - Bottom | #F57C20 (orange)                                                          | _(Hex color code like #RRGGBB)_                                                                      |

---

## 3. MISSION SECTION

This section explains your charity's core mission and purpose.

| Section | Variable                   | Current Free For Charity Content                                                                                                                                                                                                      | Your Content                                                               |
| ------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Mission | Section Heading            | "Free For Charity has a simple mission with broad implications"                                                                                                                                                                       | _(Your mission heading)_                                                   |
| Mission | Mission Statement (Bold)   | "Reduce costs and increase revenues for nonprofits; putting that money back into their charitable mission where it belongs."                                                                                                          | _(Your primary mission statement, 1-2 sentences)_                          |
| Mission | Mission Description        | "This charity for charities seeks to replace as many functions as possible that current nonprofits pay for to for-profit companies with free or at cost work from our campus, on site projects, or partnerships with other entities." | _(Detailed explanation of your mission, 2-3 sentences)_                    |
| Mission | Mission Video URL          | `https://ffcsites.org/videos/mission-video.mp4`                                                                                                                                                                                       | _(URL to your mission video, or leave blank if none)_                      |
| Mission | Mission Video Poster Image | `/videos/mission-video-poster.webp`                                                                                                                                                                                                   | _(Thumbnail image shown before video plays, recommended size: 800px wide)_ |
| Mission | Mission Video Title        | "Learn about Free For Charity's mission to help nonprofits reduce costs"                                                                                                                                                              | _(Descriptive title for accessibility)_                                    |

---

## 4. RESULTS / IMPACT SECTION

This section shows your charity's achievements with numbers and statistics.

| Section | Variable                    | Current Free For Charity Content                         | Your Content                                                  |
| ------- | --------------------------- | -------------------------------------------------------- | ------------------------------------------------------------- |
| Results | Section Heading             | "Results - 2023"                                         | _(Your heading, e.g., "Our Impact 2024" or "Results - 2023")_ |
| Results | Impact Card 1 - Number      | "221"                                                    | _(Your statistic, e.g., "500")_                               |
| Results | Impact Card 1 - Description | "Organizational partners"                                | _(What this number represents)_                               |
| Results | Impact Card 2 - Number      | "3"                                                      |                                                               |
| Results | Impact Card 2 - Description | "Total volunteers"                                       |                                                               |
| Results | Impact Card 3 - Number      | "221"                                                    |                                                               |
| Results | Impact Card 3 - Description | "Organizations accessing technical assistance offerings" |                                                               |
| Results | Impact Card 4 - Number      | "25"                                                     |                                                               |
| Results | Impact Card 4 - Description | "Volunteer hours contributed to the organization"        |                                                               |

_Note: You can add more cards or remove some by providing additional rows or marking cards to delete._

---

## 5. TESTIMONIALS SECTION

Share what people say about your charity. Each testimonial should be a quote from a supporter, partner, or beneficiary.

| Section      | Variable                        | Current Free For Charity Content                                                                                                                                                                                          | Your Content                        |
| ------------ | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| Testimonials | Section Heading                 | "Testimonials"                                                                                                                                                                                                            |                                     |
| Testimonials | Testimonial 1 - Heading         | "American Legion Ahwatukee Post 64"                                                                                                                                                                                       | _(Name of person or organization)_  |
| Testimonials | Testimonial 1 - Quote           | "Knowing that I can reach out to the owner of another veteran to aid with our website's charities' needs completely across the country has been amazing for this disabled veteran."                                       | _(The testimonial quote)_           |
| Testimonials | Testimonial 1 - Name            | "David Green, Public Affairs Officer"                                                                                                                                                                                     | _(Who said this quote)_             |
| Testimonials | Testimonial 1 - Location/Org    | "American Legion Ahwatukee Post 64"                                                                                                                                                                                       | _(Their organization or location)_  |
| Testimonials | Testimonial 1 - Link (optional) | "https://americanlegionpost64.org/"                                                                                                                                                                                       | _(Link to their website, optional)_ |
| Testimonials | Testimonial 2 - Heading         | "TaShonda Payne"                                                                                                                                                                                                          |                                     |
| Testimonials | Testimonial 2 - Quote           | "…I'm so glad the universe aligned me with you"                                                                                                                                                                           |                                     |
| Testimonials | Testimonial 2 - Name            | "Melanin Magic Foundation"                                                                                                                                                                                                |                                     |
| Testimonials | Testimonial 2 - Location/Org    | _(Leave blank if not applicable)_                                                                                                                                                                                         |                                     |
| Testimonials | Testimonial 3 - Heading         | "Pardhasaradhi Namburi"                                                                                                                                                                                                   |                                     |
| Testimonials | Testimonial 3 - Quote           | "Free For Charity was absolutely and outstanding — they really did a terrific job for us, they provided us the proper tech guidance and tools in order to help support the nonprofits that we support at Online Impacts." |                                     |
| Testimonials | Testimonial 3 - Name            | _(Leave blank if included in heading)_                                                                                                                                                                                    |                                     |
| Testimonials | Testimonial 4 - Heading         | "Keith Ray"                                                                                                                                                                                                               |                                     |
| Testimonials | Testimonial 4 - Quote           | "An awesome charity that helps and supports other charities with technology support"                                                                                                                                      |                                     |
| Testimonials | Testimonial 4 - Name            | _(Leave blank if included in heading)_                                                                                                                                                                                    |                                     |

_Note: You can add more testimonials or use fewer by adding rows or removing entries._

---

## 6. VOLUNTEER SECTION

Encourage people to volunteer with your charity.

| Section   | Variable                 | Current Free For Charity Content                                                                                                                                                                         | Your Content                                                                 |
| --------- | ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Volunteer | Section Heading          | "Volunteer with Us"                                                                                                                                                                                      |                                                                              |
| Volunteer | Description Text         | "Your time and skills can create a lasting impact. Whether you're assisting with outreach, providing technical expertise, or supporting our programs, your contributions are invaluable to our mission." | _(Your volunteer appeal text, 2-3 sentences)_                                |
| Volunteer | Volunteer Button Text    | "Volunteer"                                                                                                                                                                                              |                                                                              |
| Volunteer | Volunteer Button Link    | "https://www.idealist.org/en/nonprofit/356bfc8e2ae64f83beea4a4e677e99d7-free-for-charity-state-college#opportunities"                                                                                    | _(Link to your volunteer sign-up page)_                                      |
| Volunteer | Volunteer Image          | `/Images/Volunteer-with-Us.webp`                                                                                                                                                                         | _(Image showing volunteers or your cause, recommended size: 1083px × 607px)_ |
| Volunteer | Volunteer Image Alt Text | "Volunteer-with-Us"                                                                                                                                                                                      | _(Description of the image)_                                                 |
| Volunteer | Background Color         | #2A6682 (dark blue-green)                                                                                                                                                                                | _(Hex color code)_                                                           |

---

## 7. EVENTS SECTION

Display upcoming events for your charity.

| Section | Variable                   | Current Free For Charity Content                                                         | Your Content                                                              |
| ------- | -------------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Events  | Section Heading            | "Upcoming Events"                                                                        |                                                                           |
| Events  | Description Text           | "Join us for upcoming volunteer opportunities, training sessions, and community events." | _(Brief description of your events)_                                      |
| Events  | Facebook Events Widget URL | "https://widgets.sociablekit.com/facebook-page-events/iframe/25631700"                   | _(Your SociableKit Facebook events widget URL, or leave blank to remove)_ |
| Events  | Facebook Page Link Text    | "View all events on Facebook"                                                            |                                                                           |
| Events  | Facebook Page Link URL     | "https://www.facebook.com/freeforcharity"                                                | _(Link to your Facebook page)_                                            |

_Note: If you don't use Facebook events, you can replace this section with a custom event list or calendar._

---

## 8. DONATE / SUPPORT SECTION

This is where people can financially support your charity.

| Section | Variable                  | Current Free For Charity Content                                                                                              | Your Content                                                                      |
| ------- | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Donate  | Section Heading           | "Support Free For Charity"                                                                                                    | _(e.g., "Support [Your Charity Name]")_                                           |
| Donate  | Description Text          | "By donating you help drive our mission and allow us to support more charities with our Domain, Website, and other services." | _(Explain what donations help accomplish, 1-2 sentences)_                         |
| Donate  | Supporting Image          | `/Images/support-free-for-charity.webp`                                                                                       | _(Image file, recommended size: 578px × 386px)_                                   |
| Donate  | Supporting Image Alt Text | "support free for charity image"                                                                                              | _(Description of image)_                                                          |
| Donate  | Donation Form URL         | "https://www.zeffy.com/embed/donation-form/free-for-charity-endowment-fund"                                                   | _(Your donation form embed URL - from Zeffy, PayPal, or other donation platform)_ |
| Donate  | Donation Form Title       | "Donation form powered by Zeffy"                                                                                              | _(Title for accessibility)_                                                       |

_Note: This template uses an embedded donation form. You'll need to set up an account with a donation processor like Zeffy, PayPal Donations, or similar to get your embed URL._

---

## 9. ENDOWMENT / FEATURES SECTION

Highlight special features or aspects of your charity. Free For Charity uses this for their Endowment Fund features.

| Section   | Variable                     | Current Free For Charity Content                                                                                                                 | Your Content                                                      |
| --------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------- |
| Endowment | Section Heading              | "Free For Charity Endowment Features"                                                                                                            | _(Your section heading, e.g., "Why Choose Us" or "Our Approach")_ |
| Endowment | Feature Card 1 - Icon/Image  | `/Svgs/sustainable-funding.svg`                                                                                                                  | _(Icon or small image representing this feature)_                 |
| Endowment | Feature Card 1 - Title       | "Sustainable Funding"                                                                                                                            |                                                                   |
| Endowment | Feature Card 1 - Description | "The Endowment ensures that only the investment gains are used, providing a sustainable funding source for the Free For Charity Domain Program." |                                                                   |
| Endowment | Feature Card 2 - Icon/Image  | `/Svgs/Long-Term-Impact.svg`                                                                                                                     |                                                                   |
| Endowment | Feature Card 2 - Title       | "Long-Term Impact"                                                                                                                               |                                                                   |
| Endowment | Feature Card 2 - Description | "By supporting the Endowment, you contribute to a lasting legacy that will continuously support charities in need of digital resources."         |                                                                   |
| Endowment | Feature Card 3 - Icon/Image  | `/Svgs/Goal-of-$1,000,000.svg`                                                                                                                   |                                                                   |
| Endowment | Feature Card 3 - Title       | "Goal of $1,000,000"                                                                                                                             |                                                                   |
| Endowment | Feature Card 3 - Description | "Our target is to raise $1,000,000 to secure the future of the program, ensuring ongoing support for countless charities."                       |                                                                   |
| Endowment | Feature Card 4 - Icon/Image  | `/Svgs/Be-a-Champion.svg`                                                                                                                        |                                                                   |
| Endowment | Feature Card 4 - Title       | "Be a Champion for Change"                                                                                                                       |                                                                   |
| Endowment | Feature Card 4 - Description | "By taking donations on our behalf, you become an essential part of our mission, creating a ripple effect of generosity and support."            |                                                                   |

---

## 10. PROGRAMS SECTION

Describe the programs or services your charity offers.

### Program 1

| Section  | Variable                          | Current Free For Charity Content                                                                           | Your Content                                                 |
| -------- | --------------------------------- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| Programs | Section Heading                   | "Our Programs"                                                                                             |                                                              |
| Programs | Program 1 - Icon                  | `/Svgs/FFC-Domains.svg`                                                                                    | _(Icon representing your program, recommended: 56px × 56px)_ |
| Programs | Program 1 - Name                  | "FFC Domains"                                                                                              | _(Your program name)_                                        |
| Programs | Program 1 - Description           | "Provides free .org domain names, Microsoft 365 with Outlook email, & Microsoft Teams to 501c3 charities." | _(Brief description of what this program does)_              |
| Programs | Program 1 - Icon Background Color | #2A6682                                                                                                    | _(Hex color code for the circular background)_               |

#### Program 1 - Details (Expandable Sections)

| Section  | Variable                         | Current Free For Charity Content                                                                                                                                                                                                                                                                                                                                                                                            | Your Content |
| -------- | -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| Programs | Program 1 Detail 1 - Title       | ".org Domain Registration"                                                                                                                                                                                                                                                                                                                                                                                                  |              |
| Programs | Program 1 Detail 1 - Description | "For You: Leverage a .org domain name to enhance your charity's credibility, trustworthiness, and online presence, making it easier to attract donors and supporters"                                                                                                                                                                                                                                                       |              |
| Programs | Program 1 Detail 2 - Title       | "Cloudflare DNS"                                                                                                                                                                                                                                                                                                                                                                                                            |              |
| Programs | Program 1 Detail 2 - Description | "For You: Faster website load times and enhanced security\nFor Us: Centralized management and automation tools."                                                                                                                                                                                                                                                                                                            |              |
| Programs | Program 1 Detail 3 - Title       | "Charity Email Address"                                                                                                                                                                                                                                                                                                                                                                                                     |              |
| Programs | Program 1 Detail 3 - Description | "For You: Using a charity email address (e.g., yourname@yourcharity.org) enhances your organization's credibility and professionalism, making it easier to build trust with donors, volunteers, and stakeholders\nFor Us: We benefit by ensuring charities use professional email addresses, which helps maintain our server's integrity and provides a more secure and reliable communication platform for our volunteers" |              |
| Programs | Program 1 Detail 4 - Title       | "Microsoft 365"                                                                                                                                                                                                                                                                                                                                                                                                             |              |
| Programs | Program 1 Detail 4 - Description | "For You: Professional email and collaboration tools\nFor Us: Streamlined communication and support processes"                                                                                                                                                                                                                                                                                                              |              |

### Program 2

| Section  | Variable                | Current Free For Charity Content                                                                                                  | Your Content |
| -------- | ----------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| Programs | Program 2 - Icon        | `/Svgs/FFC-Hosting.svg`                                                                                                           |              |
| Programs | Program 2 - Name        | "FFC Hosting"                                                                                                                     |              |
| Programs | Program 2 - Description | "Free static site hosting for nonprofit organizations using Microsoft GitHub Pages, with websites built using GitHub Copilot AI:" |              |

#### Program 2 - Details

| Section  | Variable                         | Current Free For Charity Content                                                                                                                                                             | Your Content |
| -------- | -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| Programs | Program 2 Detail 1 - Title       | "GitHub Pages Hosting"                                                                                                                                                                       |              |
| Programs | Program 2 Detail 1 - Description | "For You: Free, reliable static site hosting with automatic HTTPS and custom domain support\nFor Us: Simplified deployment and maintenance with version-controlled websites"                 |              |
| Programs | Program 2 Detail 2 - Title       | "GitHub Copilot AI Development"                                                                                                                                                              |              |
| Programs | Program 2 Detail 2 - Description | "For You: Professional, modern websites built using AI-assisted development for faster delivery\nFor Us: Efficient website creation and consistent code quality across all charity projects" |              |
| Programs | Program 2 Detail 3 - Title       | "Static Site Architecture"                                                                                                                                                                   |              |
| Programs | Program 2 Detail 3 - Description | "For You: Fast-loading, secure websites with no server maintenance required\nFor Us: Zero hosting costs and reduced security vulnerabilities for partner organizations"                      |              |
| Programs | Program 2 Detail 4 - Title       | "Modern Web Technologies"                                                                                                                                                                    |              |
| Programs | Program 2 Detail 4 - Description | "For You: Beautiful, responsive websites built with React, Next.js, and Tailwind CSS\nFor Us: Standardized tech stack enabling efficient support and training for our volunteers"            |              |

### Program 3

| Section  | Variable                | Current Free For Charity Content                                                                                                                                                                                                                                                                                                                                     | Your Content |
| -------- | ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| Programs | Program 3 - Icon        | `/Svgs/FFC-Consulting.svg`                                                                                                                                                                                                                                                                                                                                           |              |
| Programs | Program 3 - Name        | "FFC Consulting"                                                                                                                                                                                                                                                                                                                                                     |              |
| Programs | Program 3 - Description | "FFC Consulting is about helping charities get the most out of their digital infrastructure including from other charities for charities like ours or from partners. We introduce charities to each major service that supports the charity mission of our sponsored organizations. We benefit when you use these services as well as your organization benefiting." |              |

#### Program 3 - Details

| Section  | Variable                         | Current Free For Charity Content                                                                                                                                                                                                                                                                                                                                                                      | Your Content |
| -------- | -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| Programs | Program 3 Detail 1 - Title       | "Northwest Registered Agent"                                                                                                                                                                                                                                                                                                                                                                          |              |
| Programs | Program 3 Detail 1 - Description | "For You: Leverage Northwest Registered Agents services to maintain compliance with state requirements, including registered agent services, nonprofit corporation filing, and initial charity IRS application.\nFor Us: Efficiently support charities by ensuring they meet legal requirements and train our volunteers on managing compliance, business formation processes, and IRS applications." |              |
| Programs | Program 3 Detail 2 - Title       | "Idealist.org / VolunteerMatch.org"                                                                                                                                                                                                                                                                                                                                                                   |              |
| Programs | Program 3 Detail 2 - Description | "For You: Access to a large pool of potential volunteers\nFor Us: Validation of your active community engagement"                                                                                                                                                                                                                                                                                     |              |
| Programs | Program 3 Detail 3 - Title       | "TechSoup.org"                                                                                                                                                                                                                                                                                                                                                                                        |              |
| Programs | Program 3 Detail 3 - Description | "For You: Access to discounted software and technology resources\nFor Us: Additional validation of your non-profit status"                                                                                                                                                                                                                                                                            |              |
| Programs | Program 3 Detail 4 - Title       | "PayPal / Zeffy"                                                                                                                                                                                                                                                                                                                                                                                      |              |
| Programs | Program 3 Detail 4 - Description | "For You: Easy, secure online donation processing\nFor Us: Standardized financial transaction system for all partners"                                                                                                                                                                                                                                                                                |              |

### Call to Action

| Section  | Variable        | Current Free For Charity Content     | Your Content |
| -------- | --------------- | ------------------------------------ | ------------ |
| Programs | CTA Heading     | "Ready to Get Started Now?"          |              |
| Programs | CTA Button Text | "Application Form"                   |              |
| Programs | CTA Button Link | _(Link to application/contact form)_ |              |

_Note: You can add more programs or remove programs by duplicating this section structure or marking programs to delete._

---

## 11. FAQ SECTION

Frequently Asked Questions help address common inquiries about your charity.

| Section | Variable        | Current Free For Charity Content | Your Content |
| ------- | --------------- | -------------------------------- | ------------ |
| FAQ     | Section Heading | "Frequently Asked Questions"     |              |

### Individual FAQ Items

| #   | Question                                                                                                               | Answer                                                                                                                                                                       | Your Question | Your Answer |
| --- | ---------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- | ----------- |
| 1   | "What is the organization aiming to accomplish?"                                                                       | "While in the technical process of setting up free charity hosting we discovered that many small or new organizations are stuck well below the need for full web hosting..." |               |             |
| 2   | "What are the organization's key strategies for making this happen?"                                                   | "FFC assists by paying the full cost of the .org domain name if available..."                                                                                                |               |             |
| 3   | "What are the organization's capabilities for doing this?"                                                             | "We already have the accounts set up in eNOM to provide enterprise level domain procurement..."                                                                              |               |             |
| 4   | "What have and haven't they accomplished so far?"                                                                      | "While a lot has been accomplished on the IT hosting side and to a certain degree the IT project management..."                                                              |               |             |
| 5   | "Is there a need for a charity to provide help for charities?"                                                         | "Yes there is a need to provide help for charities in many ways!..."                                                                                                         |               |             |
| 6   | "Where did the idea come from?"                                                                                        | "Free for charity was started when the founder first started as a board member..."                                                                                           |               |             |
| 7   | "Why do charities pay for items they can get for free?"                                                                | "The first reaction to uncovering these issues with the board was anger..."                                                                                                  |               |             |
| 8   | "Where does Free for Charity come in to help our charity or nonprofit?"                                                | "Free for Charity will fill these vital roles for non profits and charities..."                                                                                              |               |             |
| 9   | "How can I tell if we have high overhead? / My charity does not have high overhead!"                                   | "Free for Charity is all about efficiency. Many charities 'fix' this overhead problem..."                                                                                    |               |             |
| 10  | "How do you provide your program services?"                                                                            | "We provide help for charities with efficiency..."                                                                                                                           |               |             |
| 11  | "Are you like Idealist.org or other matching agencies?"                                                                | "Not exactly. That type of charity matches workers with charities..."                                                                                                        |               |             |
| 12  | "What do I need to get started?"                                                                                       | "All you need to do to get free for charity to provide help for your charities mission..."                                                                                   |               |             |
| 13  | "How can you afford to give away free domain names?"                                                                   | "As a 501(c)3 charity ourselves we seek individual, business, and grant sources of funding..."                                                                               |               |             |
| 14  | "Where do you get your domain name packages?"                                                                          | "We are a registered reseller of eNom domain names..."                                                                                                                       |               |             |
| 15  | "Are you really a charity?"                                                                                            | "Yes, We have had IRS designation since 2014..."                                                                                                                             |               |             |
| 16  | "Why do I not see hosting as an option?"                                                                               | "We have a large backlog for new sites and support..."                                                                                                                       |               |             |
| 17  | "If I am an individual or business and donate money for a domain package to Free for Charity, is this tax-deductible?" | "While any official tax guidance should come from your accountant..."                                                                                                        |               |             |

_Note: You should customize these FAQs to match your charity's mission and services. Add or remove questions as needed._

---

## 12. TEAM SECTION

Introduce your charity's leadership team or key staff members.

| Section | Variable        | Current Free For Charity Content | Your Content                                  |
| ------- | --------------- | -------------------------------- | --------------------------------------------- |
| Team    | Section Heading | "The Free For Charity Team"      | _(e.g., "Meet Our Team" or "Our Leadership")_ |

### Team Members

| #   | Photo                  | Name              | Title                                              | LinkedIn URL                                            | Your Photo                                        | Your Name | Your Title | Your LinkedIn |
| --- | ---------------------- | ----------------- | -------------------------------------------------- | ------------------------------------------------------- | ------------------------------------------------- | --------- | ---------- | ------------- |
| 1   | `/Images/member1.webp` | "Clarke Moyer"    | "Free For Charity Founder/ President of the Board" | "https://www.linkedin.com/in/clarkemoyer/"              | _(Photo file, recommended: 400px × 400px square)_ |           |            |               |
| 2   | `/Images/member2.webp` | "Chris Rae"       | "Free For Charity Vice President"                  | "https://www.linkedin.com/in/christopher-rae-540493a5/" |                                                   |           |            |               |
| 3   | `/Images/member3.webp` | "Tyler Carlotto"  | "Free For Charity Secretary"                       | "https://www.linkedin.com/in/tylercarlotto/"            |                                                   |           |            |               |
| 4   | `/Images/member4.webp` | "Brennan Darling" | "Free For Charity Treasurer"                       | "https://www.linkedin.com/in/brennon-darling-80953038/" |                                                   |           |            |               |
| 5   | `/Images/member5.webp` | "Rebecca Cook"    | "Free For Charity Member at Large"                 | "https://www.linkedin.com/in/rebecca-cook-a91599265/"   |                                                   |           |            |               |

_Note: Add more team members or use fewer by adding rows or removing entries. LinkedIn URLs are optional._

---

## 13. FOOTER SECTION

The footer appears at the bottom of every page and contains important links and contact information.

### Column 1 - Endorsements

| Section | Variable                     | Current Free For Charity Content                                                                                                               | Your Content                                                        |
| ------- | ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| Footer  | Column 1 Heading             | "Endorsements"                                                                                                                                 | _(You might use "Certifications", "Verified By", or similar)_       |
| Footer  | Endorsement Image 1          | `/Svgs/footerImage.svg` (GuideStar Platinum Seal) — asset/markup in `src/components/footer/index.tsx`                                          | _(Logo/seal image from your endorsing organizations)_               |
| Footer  | Endorsement Image 1 Alt Text | "GuideStar Platinum Seal of Transparency" — in `src/components/footer/index.tsx`                                                               |                                                                     |
| Footer  | Endorsement Image 1 Link     | "https://www.guidestar.org/profile/46-2471893" — set `guidestar.profileUrl` in `src/lib/site.config.ts`                                        | _(Link to your profile page)_                                       |
| Footer  | Direct Profile Link Text     | "Direct GuideStar Profile Link"                                                                                                                | _(Or your equivalent verification link)_                            |
| Footer  | Direct Profile Link URL      | "https://www.guidestar.org/profile/shared/bbbe173a-87b9-4af9-a8a2-cae255a95742" — set `guidestar.directProfileUrl` in `src/lib/site.config.ts` |                                                                     |
| Footer  | EIN Display Text             | "Free For Charity EIN: 46-2471893" — set `ein` in `src/lib/site.config.ts`                                                                     | _(Your charity's EIN number, e.g., "Your Charity EIN: XX-XXXXXXX")_ |

### Column 2 - Quick Links

| Section | Variable            | Current Free For Charity Content  | Your Content                       |
| ------- | ------------------- | --------------------------------- | ---------------------------------- |
| Footer  | Column 2 Heading    | "Quick Links"                     |                                    |
| Footer  | Quick Link 1 - Text | "Home"                            |                                    |
| Footer  | Quick Link 1 - URL  | "/#hero"                          |                                    |
| Footer  | Quick Link 2 - Text | "Mission"                         |                                    |
| Footer  | Quick Link 2 - URL  | "/#mission"                       |                                    |
| Footer  | Quick Link 3 - Text | "Programs"                        |                                    |
| Footer  | Quick Link 3 - URL  | "/#programs"                      |                                    |
| Footer  | Quick Link 4 - Text | "Events"                          |                                    |
| Footer  | Quick Link 4 - URL  | "/#events"                        |                                    |
| Footer  | Quick Link 5 - Text | "Donate"                          |                                    |
| Footer  | Quick Link 5 - URL  | "/#donate"                        |                                    |
| Footer  | Quick Link 6 - Text | "Volunteer"                       |                                    |
| Footer  | Quick Link 6 - URL  | "/#volunteer"                     |                                    |
| Footer  | Quick Link 7 - Text | "FAQ"                             |                                    |
| Footer  | Quick Link 7 - URL  | "/#faq"                           |                                    |
| Footer  | Quick Link 8 - Text | "Team"                            |                                    |
| Footer  | Quick Link 8 - URL  | "/#team"                          |                                    |
| Footer  | Quick Link 9 - Text | "Supported Charity Login"         | _(Optional - for partner portals)_ |
| Footer  | Quick Link 9 - URL  | "https://freeforcharity.org/hub/" |                                    |

### Column 2 - Policy Links

| Section | Variable               | Current Free For Charity Content                   | Your Content                         |
| ------- | ---------------------- | -------------------------------------------------- | ------------------------------------ |
| Footer  | Policy Section Heading | "Free For Charity Policy"                          | _(e.g., "[Your Charity] Policies")_  |
| Footer  | Policy Link 1 - Text   | "Free For Charity Donation Policy"                 | _(Customize with your charity name)_ |
| Footer  | Policy Link 1 - URL    | "/free-for-charity-donation-policy"                | "/donation-policy"                   |
| Footer  | Policy Link 2 - Text   | "Donation Policy"                                  |                                      |
| Footer  | Policy Link 2 - URL    | "/donation-policy"                                 |                                      |
| Footer  | Policy Link 3 - Text   | "Free For Charity Privacy Policy"                  | _(Customize with your charity name)_ |
| Footer  | Policy Link 3 - URL    | "/privacy-policy"                                  |                                      |
| Footer  | Policy Link 4 - Text   | "Free For Charity Cookie Policy"                   | _(Customize with your charity name)_ |
| Footer  | Policy Link 4 - URL    | "/cookie-policy"                                   |                                      |
| Footer  | Policy Link 5 - Text   | "Free For Charity Terms of Service"                | _(Customize with your charity name)_ |
| Footer  | Policy Link 5 - URL    | "/terms-of-service"                                |                                      |
| Footer  | Policy Link 6 - Text   | "Free For Charity Vulnerability Disclosure Policy" | _(Customize with your charity name)_ |
| Footer  | Policy Link 6 - URL    | "/vulnerability-disclosure-policy"                 |                                      |
| Footer  | Policy Link 7 - Text   | "Free For Charity Security Acknowledgement"        | _(Customize with your charity name)_ |
| Footer  | Policy Link 7 - URL    | "/security-acknowledgements"                       |                                      |

_Note: These policy pages will need to be created with your charity's specific policies._

### Column 3 - Contact Information

_Edit location: `src/lib/site.config.ts` — `contactEmail`, `phone.display` / `phone.tel`, and the `addresses[]` entries (`label`, `lines`, `mapUrl`). The footer renders these from siteConfig._

| Section | Variable                           | Current Free For Charity Content                                                                    | Your Content                                         |
| ------- | ---------------------------------- | --------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| Footer  | Column 3 Heading                   | "Contact Us"                                                                                        |                                                      |
| Footer  | Email Label                        | "E-mail"                                                                                            |                                                      |
| Footer  | Email Address (`contactEmail`)     | "clarkemoyer@freeforcharity.org"                                                                    | _(Your charity's contact email)_                     |
| Footer  | Phone Label                        | "Call Us Today"                                                                                     |                                                      |
| Footer  | Phone Number (`phone.display`)     | "(520) 222-8104"                                                                                    | _(Your charity's phone number)_                      |
| Footer  | Phone Number (`phone.tel`)         | "5202228104"                                                                                        | _(Numbers only, no spaces or dashes)_                |
| Footer  | Main Address Label                 | "Main Address"                                                                                      |                                                      |
| Footer  | Main Address Line 1                | "4030 Wake Forrest Road"                                                                            |                                                      |
| Footer  | Main Address Line 2                | "Suite 349"                                                                                         |                                                      |
| Footer  | Main Address Line 3                | "Raleigh, NC 27609"                                                                                 |                                                      |
| Footer  | Main Address Google Maps Link      | "https://www.google.com/maps/search/?api=1&query=4030+Wake+Forrest+Road+Suite+349+Raleigh+NC+27609" | _(Format: Google Maps search URL with your address)_ |
| Footer  | Secondary Address Label            | "PA Office Address"                                                                                 | _(Optional second location)_                         |
| Footer  | Secondary Address Line 1           | "301 Science Park Road, Suite 119"                                                                  |                                                      |
| Footer  | Secondary Address Line 2           | "State College, PA 16803"                                                                           |                                                      |
| Footer  | Secondary Address Google Maps Link | "https://www.google.com/maps/place/Free+For+Charity/@40.7768455,-77.8963305,17z/..."                |                                                      |

_Note: If you don't have a second location, you can remove the secondary address section._

### Social Media Links

_Edit location: `src/lib/site.config.ts` — the `social[]` array (each entry's `href`). The footer renders the rail from siteConfig._

| Section | Variable              | Current Free For Charity Content                             | Your Content                                         |
| ------- | --------------------- | ------------------------------------------------------------ | ---------------------------------------------------- |
| Footer  | Facebook URL          | "https://www.facebook.com/freeforcharity"                    | _(Your Facebook page URL)_                           |
| Footer  | Twitter/X URL         | "https://x.com/freeforcharity1"                              | _(Your Twitter/X profile URL)_                       |
| Footer  | LinkedIn URL          | "https://www.linkedin.com/company/freeforcharity/"           | _(Your LinkedIn company page URL)_                   |
| Footer  | GitHub URL            | "https://github.com/FreeForCharity/FFC_Single_Page_Template" | _(Your GitHub organization URL, or leave blank)_     |
| Footer  | Icon Background Color | #F57C20 (orange)                                             | _(Hex color code for social media icon backgrounds)_ |

### Copyright / Bottom Bar

| Section | Variable          | Current Free For Charity Content                                             | Your Content                                          |
| ------- | ----------------- | ---------------------------------------------------------------------------- | ----------------------------------------------------- |
| Footer  | Copyright Text    | "© {year} All Rights Are Reserved by Free For Charity a US 501c3 Non Profit" | _(Replace "Free For Charity" with your charity name)_ |
| Footer  | Project Link Text | "A project of"                                                               | _(Optional - if part of a larger organization)_       |
| Footer  | Project Link URL  | "https://freeforcharity.org"                                                 |                                                       |

_Note: The {year} will automatically update to the current year._

---

## 14. METADATA & SEO (Search Engine Information)

This information helps your website appear correctly in search results and social media.

| Section  | Variable                            | Current Free For Charity Content                                                                                                                                                   | Your Content                                                              |
| -------- | ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Metadata | Page Title                          | "Free For Charity - Connecting Students, Professionals, & Businesses with Charities in Need"                                                                                       | _(Your charity name and tagline, under 60 characters for best SEO)_       |
| Metadata | Meta Description                    | "Free For Charity reduces costs and increases revenues for nonprofits by connecting them with students, professionals, and businesses. Join our mission to help charities thrive." | _(Brief description of your charity, 150-160 characters for best SEO)_    |
| Metadata | Open Graph Title (for social media) | "Free For Charity"                                                                                                                                                                 | _(Your charity name)_                                                     |
| Metadata | Open Graph Description              | "Connecting Students, Professionals, & Businesses with Charities in Need"                                                                                                          | _(Your tagline/mission)_                                                  |
| Metadata | Open Graph Image                    | `/Images/og-image.png`                                                                                                                                                             | _(Image shown when sharing on social media, recommended: 1200px × 630px)_ |
| Metadata | Twitter Card Type                   | "summary_large_image"                                                                                                                                                              | _(Usually keep as "summary_large_image")_                                 |
| Metadata | Favicon                             | `/favicon.ico`                                                                                                                                                                     | _(Small icon shown in browser tab, 32px × 32px .ico file)_                |
| Metadata | Apple Touch Icon                    | `/apple-touch-icon.png`                                                                                                                                                            | _(Icon for iOS devices, 180px × 180px)_                                   |

---

## Next Steps After Completing This Guide

1. **Review all your entries** - Make sure all information is accurate and complete
2. **Prepare your image files** - Gather or create all images at the recommended sizes
3. **Set up required accounts** - Create accounts for services like:
   - Donation processor (Zeffy, PayPal, etc.)
   - Facebook Events widget (if using)
   - Email service provider
4. **Share with your developer** - Provide this completed guide to the person who will update the website
5. **Create policy pages** - Work with your legal advisor to create the necessary policy documents
6. **Test everything** - After the website is updated, check all links, images, and functionality

---

## Technical Notes for Developers

When implementing these changes:

- **Logo files**: Located in the `src/components/header/index.tsx` file
- **Hero section**: Edit `src/components/home-page/hero/index.tsx`
- **Mission section**: Edit `src/components/home-page/mission/index.tsx`
- **Results section**: Edit `src/components/home-page/results-2023/index.tsx`
- **Testimonials**: Edit `src/components/home/testimonials/index.tsx` (data stored inline)
- **Volunteer section**: Edit `src/components/home-page/volunteer-with-us/index.tsx`
- **Events section**: Edit `src/components/home-page/events/index.tsx`
- **Donate section**: Edit `src/components/home-page/support-free-for-charity/index.tsx`
- **Endowment section**: Edit `src/components/home-page/endowment-features/index.tsx`
- **Programs section**: Edit `src/components/home-page/our-programs/index.tsx`
- **FAQ section**: Edit `src/components/home-page/frequently-asked-questions/index.tsx`
- **Team section**: Edit `src/components/home-page/the-free-for-charity-team/index.tsx`
- **Footer**: The footer's per-charity values (EIN, phone, addresses, GuideStar links, social, email) come from `src/lib/site.config.ts`. Edit `src/components/footer/index.tsx` only for structural/markup changes (e.g. the endorsement seal image).
- **Metadata**: Edit `src/app/layout.tsx`
- **Navigation menu**: Edit `src/components/header/index.tsx`

All images should be placed in the `public/` directory with appropriate subdirectories (e.g., `public/Images/`, `public/Svgs/`).

**Note**: Folder names listed above follow the required kebab-case naming convention per NAMING_CONVENTIONS.md. If current folder names don't match (e.g., using PascalCase), they should be renamed to kebab-case for SEO optimization and consistency.

---

## Questions?

If you have questions about any part of this guide or need clarification on what information to provide, please create an issue in the GitHub repository or contact the development team.

**Remember**: The goal is to make your charity's website reflect YOUR mission, YOUR team, and YOUR impact. Take your time to gather accurate information and high-quality images that represent your organization well.
