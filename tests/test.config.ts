/**
 * Test Configuration for Template Customization
 *
 * This file contains all content-specific values used in E2E tests.
 * When customizing this template for a new organization, update these
 * values to match your content instead of modifying individual test files.
 *
 * This makes it easy to:
 * 1. Identify what needs to change when using the template
 * 2. Keep tests working with customized content
 * 3. Maintain a single source of truth for test expectations
 */

import { analyticsConfig, isConfigured } from '../src/lib/analytics.config'
import { isSupportingOrgSite, siteConfig } from '../src/lib/site.config'
import { results } from '../src/data/results'
import { resultsSectionVisible, visibleTestimonials } from '../src/lib/section-visibility'

/**
 * These specs run in the template AND in every charity site provisioned from
 * it, and provisioning rewrites src/lib/site.config.ts but not this file. So
 * anything that differs between the two is read from siteConfig here, and the
 * specs for FFC-only content (the mission video, the application form in the
 * Programs section) skip when the build does not render it — using the same
 * predicates the components use, so a spec skips exactly when its section is
 * absent.
 */
const supportingOrgSite = isSupportingOrgSite()
const taxStatusLabel = siteConfig.taxStatusLabel.trim()

export const testConfig = {
  /**
   * True on the supporting organization's own site (the template as shipped),
   * false on a provisioned charity site. Mirrors isSupportingOrgSite().
   */
  supportingOrgSite,

  /**
   * Mission Video Configuration
   * Used in: tests/mission-video.spec.ts
   */
  missionVideo: {
    // The video is FFC's own; a charity site's Mission section has none
    // (src/components/home-page/Mission/index.tsx).
    rendered: supportingOrgSite,
    ariaLabel: 'Free For Charity mission video',
    playLabel: 'Play the Free For Charity mission video',
    title: "Learn about Free For Charity's mission to help nonprofits reduce costs",
  },

  /**
   * Application Form Configuration
   * Used in: tests/application-form.spec.ts
   */
  applicationForm: {
    // The button lives in the Programs section, which renders only on the
    // supporting org's site (programsSectionVisible in section-visibility.ts).
    rendered: siteConfig.sections.showPrograms && supportingOrgSite,
    buttonText: 'Apply to Become a Supported Charity',
    modalTitle: 'Charity Application Form',
    loadingText: 'Loading application form...',
    closeButtonAriaLabel: 'Close application form',
  },

  /**
   * Events Section Configuration
   * Used in: tests/events.spec.ts
   */
  events: {
    sectionId: 'events',
    heading: 'Upcoming Events',
    footerLinkText: 'Events',
    facebookLinkText: 'View all events on Facebook',
    // Sourced from siteConfig so the expected link always matches what the
    // Events component renders (single source of truth).
    facebookUrl: siteConfig.integrations.eventsFacebookPageUrl,
    descriptionText: 'volunteer opportunities',
    emptyStateHeading: 'No upcoming events right now',
    emptyStateButton: 'Follow us on Facebook',
  },

  /**
   * Social Media Links Configuration
   * Used in: tests/social-links.spec.ts
   */
  socialLinks: {
    // Exactly the links the footer renders: every siteConfig.social entry with
    // an href, labelled by its `label` (src/components/footer/index.tsx).
    active: siteConfig.social
      .filter((s) => s.href.trim())
      .map((s) => ({ href: s.href, ariaLabel: s.label })),
  },

  /**
   * Copyright Configuration
   * Used in: tests/copyright.spec.ts
   */
  copyright: {
    // Mirrors the footer bottom bar: "All Rights Are Reserved by <name> <taxStatusLabel>".
    text: ['All Rights Are Reserved by', siteConfig.name, taxStatusLabel].filter(Boolean).join(' '),
    searchText: 'All Rights Are Reserved',
    // The permanent "Supported by" attribution (FFC footer standard) — sourced
    // from siteConfig.supportedBy, which is required and always rendered.
    supportedByUrl: siteConfig.supportedBy.url,
    supportedByText: siteConfig.supportedBy.name,
    // Sourced from siteConfig so the parent-org link expectations track the
    // footer (which now shows the org name, not the raw URL, as link text).
    linkUrl: siteConfig.parentOrg?.url ?? '',
    linkText: siteConfig.parentOrg?.name ?? siteConfig.name,
  },

  /**
   * Animated Numbers Configuration
   * Used in: tests/animated-numbers.spec.ts
   */
  animatedNumbers: {
    // Sourced from src/data/results.ts, and `rendered` from the predicate the
    // Results component uses: FFC's own numbers (supportingOrgOnly) show only
    // on its own site, so a charity site without results of its own has no
    // section and these specs expect its absence instead.
    rendered: resultsSectionVisible(),
    sectionHeading: results.heading,
    statistics: results.stats.map((s) => ({ description: s.label, value: s.value })),
  },

  /**
   * Testimonials Configuration
   * Used in: tests/testimonials-navigation.spec.ts
   *
   * How many testimonials the carousel shows, from the same visibleTestimonials()
   * the component renders: FFC's own (supportingOrgOnly) only on its own site.
   */
  testimonials: {
    count: visibleTestimonials().length,
  },

  /**
   * Google Tag Manager Configuration
   * Used in: tests/google-tag-manager.spec.ts
   *
   * Sourced from the same src/lib/analytics.config.ts the component reads, so
   * the expected ID always matches what the build embedded. A charity site's
   * id is empty until its own container is provisioned; the site then renders
   * no tag, and the specs that need the tag itself skip (the consent test,
   * which needs only the dataLayer, still runs). `configured` uses the same
   * isConfigured() test the loader does.
   */
  googleTagManager: {
    id: analyticsConfig.gtmId.trim(),
    configured: isConfigured(analyticsConfig.gtmId),
  },

  /**
   * Logo Configuration
   * Used in: tests/logo.spec.ts
   */
  logo: {
    // The header logo's alt is siteConfig.name (src/components/header/index.tsx).
    headerAlt: siteConfig.name,
    heroAlt: 'Hero image',
    navBarAriaLabel: `${siteConfig.name} home`,
  },

  /**
   * Cookie Consent Configuration
   * Used in: tests/cookie-consent.spec.ts
   */
  cookieConsent: {
    bannerHeading: 'We Value Your Privacy',
    modalHeading: 'Cookie Preferences',
    buttons: {
      acceptAll: 'Accept All',
      declineAll: 'Decline All',
      customize: 'Customize',
      savePreferences: 'Save Preferences',
      cancel: 'Cancel',
    },
  },
}
