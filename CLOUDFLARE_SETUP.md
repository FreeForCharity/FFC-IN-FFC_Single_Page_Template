# Cloudflare Configuration for GitHub Pages

This guide provides step-by-step instructions for configuring Cloudflare for your GitHub Pages site to optimize caching and performance. **All features listed are available on Cloudflare's Free plan.**

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Basic Setup](#basic-setup)
3. [Cache Configuration](#cache-configuration)
4. [Performance Optimizations](#performance-optimizations)
5. [Security Settings](#security-settings)
6. [SSL/TLS Configuration](#ssltls-configuration)
7. [Testing Your Configuration](#testing-your-configuration)

---

## Prerequisites

- A Cloudflare account (free plan is sufficient)
- Your custom domain configured to use Cloudflare DNS
- GitHub Pages site deployed and accessible

---

## Basic Setup

### 1. Add Your Domain to Cloudflare

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Click **"Add a Site"**
3. Enter your domain name (e.g., `your-domain.org`)
4. Select the **Free** plan
5. Cloudflare will scan your existing DNS records

### 2. Update DNS Records

1. Keep your existing DNS records that point to GitHub Pages:

   ```
   Type: A
   Name: @
   Content: 185.199.108.153

   Type: A
   Name: @
   Content: 185.199.109.153

   Type: A
   Name: @
   Content: 185.199.110.153

   Type: A
   Name: @
   Content: 185.199.111.153

   Type: CNAME
   Name: www
   Content: yourusername.github.io
   ```

2. Set **Proxy status** to **Proxied** (orange cloud icon) for all GitHub Pages records
   - This enables Cloudflare's CDN and caching

### 3. Update Nameservers

1. Copy the Cloudflare nameservers shown (e.g., `ns1.cloudflare.com`, `ns2.cloudflare.com`)
2. Go to your domain registrar
3. Update nameservers to point to Cloudflare
4. Wait 24-48 hours for DNS propagation

---

## Cache Configuration

### Page Rules for Asset Caching (Free Plan: 3 Rules)

Cloudflare Free plan includes **3 Page Rules**. Use them wisely for maximum performance impact.

#### Page Rule 1: Cache Static Assets (Highest Priority)

**URL Pattern:** `*your-domain.org/_next/static/*`

**Settings:**

- **Cache Level:** Cache Everything
- **Edge Cache TTL:** 1 month (2678400 seconds)
- **Browser Cache TTL:** 1 year (31536000 seconds)

**Why:** Next.js static assets have content hashes and are immutable

#### Page Rule 2: Cache Images and Media

**URL Pattern:** `*your-domain.org/Images/*` OR `*your-domain.org/Svgs/*`

**Settings:**

- **Cache Level:** Cache Everything
- **Edge Cache TTL:** 1 month (2678400 seconds)
- **Browser Cache TTL:** 1 year (31536000 seconds)

**Why:** Images are immutable and should be cached aggressively

#### Page Rule 3: HTML Pages with Revalidation

**URL Pattern:** `*your-domain.org/*.html`

**Settings:**

- **Cache Level:** Cache Everything
- **Edge Cache TTL:** 1 hour (3600 seconds)
- **Browser Cache TTL:** 1 hour (3600 seconds)

**Why:** HTML pages may update with new deployments, so use shorter cache times

### How to Add Page Rules

1. Go to **Dashboard → [Your Domain] → Rules → Page Rules**
2. Click **"Create Page Rule"**
3. Enter the URL pattern
4. Click **"+ Add a Setting"** for each setting above
5. Set priority (drag rules to reorder):
   - Rule 1 (Static Assets) - Priority 1
   - Rule 2 (Images) - Priority 2
   - Rule 3 (HTML) - Priority 3
6. Click **"Save and Deploy"**

---

## Performance Optimizations

### Auto Minify (Free)

Automatically minifies CSS, JS, and HTML to reduce file sizes.

**To Enable:**

1. Go to **Speed → Optimization**
2. Under **Auto Minify**, enable:
   - ☑️ JavaScript
   - ☑️ CSS
   - ☑️ HTML

### Brotli Compression (Free)

Enables Brotli compression for faster content delivery (better than Gzip).

**To Enable:**

1. Go to **Speed → Optimization**
2. Toggle **Brotli** to **On**

### Early Hints (Free)

Sends early hints to browsers to preload resources before the full page response.

**To Enable:**

1. Go to **Speed → Optimization**
2. Toggle **Early Hints** to **On**

### Rocket Loader (Optional - Use with Caution)

Defers JavaScript loading to improve page load time. **Note:** May cause issues with complex JavaScript applications.

**To Enable (if needed):**

1. Go to **Speed → Optimization**
2. Toggle **Rocket Loader** to **On**
3. Test thoroughly - disable if it breaks site functionality

### HTTP/3 (Free)

Enables HTTP/3 for faster connections using QUIC protocol.

**To Enable:**

1. Go to **Network**
2. Toggle **HTTP/3 (with QUIC)** to **On**

### 0-RTT Connection Resumption (Free)

Improves connection speed for returning visitors.

**To Enable:**

1. Go to **Network**
2. Toggle **0-RTT Connection Resumption** to **On**

---

## Security Settings

### Always Use HTTPS (Free)

Redirects all HTTP traffic to HTTPS.

**To Enable:**

1. Go to **SSL/TLS → Edge Certificates**
2. Toggle **Always Use HTTPS** to **On**

### Automatic HTTPS Rewrites (Free)

Automatically rewrites insecure HTTP links to HTTPS.

**To Enable:**

1. Go to **SSL/TLS → Edge Certificates**
2. Toggle **Automatic HTTPS Rewrites** to **On**

### Security Headers (via Transform Rules - Free)

Add security headers to improve site security (Free plan includes 10 Transform Rules).

**To Add Security Headers:**

1. Go to **Rules → Transform Rules → Modify Response Header**
2. Click **"Create rule"**
3. Configure:
   - **Rule name:** "Security Headers"
   - **When incoming requests match:** All incoming requests
   - **Then...** Add multiple "Set static" header actions:
     - `X-Content-Type-Options`: `nosniff`
     - `X-Frame-Options`: `SAMEORIGIN`
     - `X-XSS-Protection`: `1; mode=block`
     - `Referrer-Policy`: `strict-origin-when-cross-origin`
     - `Permissions-Policy`: `geolocation=(), microphone=(), camera=()`

---

## SSL/TLS Configuration

### SSL/TLS Encryption Mode (Free)

**Recommended Setting:** Full (strict)

**To Configure:**

1. Go to **SSL/TLS → Overview**
2. Select **Full (strict)** encryption mode
   - This ensures end-to-end encryption between Cloudflare and GitHub Pages
   - GitHub Pages provides a valid SSL certificate

### Minimum TLS Version (Free)

**Recommended Setting:** TLS 1.2 or higher

**To Configure:**

1. Go to **SSL/TLS → Edge Certificates**
2. Set **Minimum TLS Version** to **TLS 1.2** or **TLS 1.3**

---

## Testing Your Configuration

### 1. Test Cache Headers

Use browser DevTools or online tools:

```bash
# Test static asset caching
curl -I https://your-domain.org/_next/static/chunks/[hash].js

# Look for:
# cache-control: public, max-age=31536000, immutable
# cf-cache-status: HIT (on subsequent requests)
```

### 2. Test Performance

1. **Google PageSpeed Insights:** https://pagespeed.web.dev/
   - Run test for your domain
   - Verify cache recommendations are resolved

2. **WebPageTest:** https://www.webpagetest.org/
   - Test from multiple locations
   - Check waterfall chart for cached resources

### 3. Verify Security Headers

Use [Security Headers](https://securityheaders.com/) to test:

```
https://securityheaders.com/?q=https://your-domain.org
```

### 4. Test SSL Configuration

Use [SSL Labs](https://www.ssllabs.com/ssltest/) to test:

```
https://www.ssllabs.com/ssltest/analyze.html?d=your-domain.org
```

---

## Troubleshooting

### Issue: Changes Not Visible After Deployment

**Solution:** Purge Cloudflare cache

1. Go to **Caching → Configuration**
2. Click **"Purge Everything"** or **"Custom Purge"** for specific files
3. Wait a few minutes for cache to clear globally

### Issue: Site Not Loading or SSL Errors

**Solution:** Check SSL/TLS settings

1. Ensure SSL/TLS mode is set to **Full (strict)**
2. Verify GitHub Pages has a valid SSL certificate
3. Check that DNS records are proxied (orange cloud)

### Issue: Page Rules Not Working

**Solution:** Check rule priority and URL patterns

1. Ensure URL pattern matches your actual URLs
2. Verify wildcard (`*`) placement is correct
3. Check rule priority order (most specific rules first)

---

## Summary of Cloudflare Free Plan Features Used

| Feature               | Setting                           | Impact                                               |
| --------------------- | --------------------------------- | ---------------------------------------------------- |
| Page Rules (3)        | Cache static assets, images, HTML | **High** - Reduces bandwidth and improves load times |
| Auto Minify           | JS, CSS, HTML                     | **Medium** - Reduces file sizes by 10-30%            |
| Brotli                | Enabled                           | **Medium** - Better compression than Gzip            |
| HTTP/3                | Enabled                           | **Medium** - Faster connections                      |
| Security Headers      | Transform Rules                   | **High** - Improves security posture                 |
| Always Use HTTPS      | Enabled                           | **High** - SEO and security                          |
| SSL/TLS Full (strict) | Enabled                           | **High** - End-to-end encryption                     |

---

## Expected Performance Improvements

After configuring Cloudflare:

- **LCP (Largest Contentful Paint):** 15-30% improvement due to CDN caching and compression
- **FCP (First Contentful Paint):** 10-20% improvement from edge caching
- **TTFB (Time to First Byte):** 30-50% improvement from CDN proximity
- **Cache Hit Ratio:** 70-90% for static assets after initial deployment
- **Bandwidth Savings:** 40-60% due to caching and compression

---

## Additional Resources

- [Cloudflare Documentation](https://developers.cloudflare.com/)
- [Cloudflare Community](https://community.cloudflare.com/)
- [GitHub Pages Custom Domain Setup](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)
- [Next.js Deployment with Cloudflare](https://nextjs.org/docs/pages/building-your-application/deploying)

---

**Last Updated:** 2025-12-05

For questions or issues, contact Free For Charity at hello@freeforcharity.org
