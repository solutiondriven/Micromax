# IMPULSE HUB - Complete Deployment Checklist

## 📦 Files to Upload to htdocs

After running `npm run build`, you need to upload **ALL** files from the `build` folder **PLUS** the following PHP file:

### 1. Build Folder Contents (upload everything)
```
build/
├── index.html
├── assets/
│   ├── *.js
│   ├── *.css
│   └── images/
└── [all other build files]
```

### 2. Additional Required Files

#### ✅ PHP Email Handler
**File:** `sendMail.php`  
**Location:** Upload to the **SAME DIRECTORY** as `index.html`

```
htdocs/
├── index.html          (from build folder)
├── sendMail.php        (from project root)
├── assets/             (from build folder)
└── [other build files]
```

**Why needed:** This file handles all email functionality for:
- Copy Trading registrations
- Bot Customization requests
- Plan Selection notifications
- Payment Link requests

---

## 🚀 Step-by-Step Deployment

### Step 1: Build Your Application
```bash
npm run build
```

This creates a `build` folder with all your compiled React files.

### Step 2: Prepare Files for Upload

Create a deployment folder with:

1. **All contents from `build/` folder**
2. **Copy `sendMail.php` from project root**

Your folder structure should look like:
```
deployment-files/
├── index.html          ← from build/
├── sendMail.php        ← from project root
├── assets/             ← from build/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── [other assets]
└── [other build files]
```

### Step 3: Configure sendMail.php

**IMPORTANT:** Before uploading, update these lines in `sendMail.php`:

```php
// Lines 26-30 - SMTP Configuration
$SMTP_HOST = 'smtp.gmail.com';
$SMTP_PORT = 587;
$SMTP_USERNAME = 'impulse.hub.tech@gmail.com';
$SMTP_PASSWORD = 'ibnm kiws albu ehnu'; // ⚠️ CHANGE THIS if using different email
$SMTP_SECURE = 'tls';

// Lines 54-56 - Email Settings
$FROM_EMAIL = 'noreply@impulsehub.com';
$FROM_NAME = 'IMPULSE HUB';
$ADMIN_EMAIL = 'contact@impulsehub.tech'; // ⚠️ Where you receive emails
```

### Step 4: Upload to cPanel

#### Option A: File Manager (Recommended for beginners)
1. Log into cPanel
2. Go to **File Manager**
3. Navigate to `public_html` or `htdocs`
4. Upload ALL files from your deployment folder
5. Ensure `sendMail.php` is in the root (same level as `index.html`)

#### Option B: FTP (FileZilla, etc.)
1. Connect to your server via FTP
2. Navigate to `public_html` or `htdocs`
3. Upload ALL files from deployment folder
4. Verify upload completed successfully

### Step 5: Set Correct Permissions

In cPanel File Manager or via FTP:

```
sendMail.php → 644 (or 600 for extra security)
index.html → 644
assets/ → 755
```

### Step 6: Test Email Functionality

1. Visit your website
2. Navigate to the Strategies page
3. Test each form:
   - Copy Trading registration
   - Customize bot request
   - Select Plan button
   - Request Payment Link

4. Check your `$ADMIN_EMAIL` inbox for test emails
5. Check spam folder if not received

---

## 🔧 Optional: .htaccess File

Create a `.htaccess` file in your htdocs root for better routing:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  
  # Don't rewrite files or directories
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  
  # Rewrite everything else to index.html for client-side routing
  RewriteRule ^ index.html [L]
</IfModule>

# Security headers
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-Frame-Options "SAMEORIGIN"
  Header set X-XSS-Protection "1; mode=block"
</IfModule>

# Enable GZIP compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript
</IfModule>

# Cache static assets
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

**Upload this to the same directory as `index.html`**

---

## ✅ Post-Deployment Checklist

- [ ] All build files uploaded
- [ ] `sendMail.php` uploaded to root directory
- [ ] SMTP credentials configured in `sendMail.php`
- [ ] File permissions set correctly (644 for PHP, 644 for HTML, 755 for folders)
- [ ] `.htaccess` file uploaded (optional but recommended)
- [ ] Website loads correctly at your domain
- [ ] All forms tested and working
- [ ] Email delivery confirmed (check inbox and spam)
- [ ] Mobile responsiveness verified
- [ ] All navigation links working
- [ ] Innovation cards navigate correctly
- [ ] Portfolio detail windows open properly
- [ ] Dark/light theme toggle working
- [ ] Calendar data displays correctly

---

## 🐛 Troubleshooting

### Website shows blank page
- Check browser console for errors
- Verify all files uploaded correctly
- Check if `.htaccess` is configured
- Ensure `index.html` exists in root

### Forms not sending emails
- Verify `sendMail.php` is in the correct location
- Check SMTP credentials are correct
- Look for `php_errors.log` in cPanel File Manager
- Test with a simple PHP file to ensure PHP is working

### 404 errors on page refresh
- Add or verify `.htaccess` file
- Ensure mod_rewrite is enabled on server
- Contact hosting support to enable URL rewriting

### Images not loading
- Check if Unsplash images are being blocked
- Verify image URLs in browser dev tools
- Check if ImageWithFallback component is working

### CSS not applying
- Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
- Check if CSS files are in assets folder
- Verify CSS file paths in index.html

---

## 📊 Expected File Structure on Server

```
htdocs/ (or public_html/)
├── index.html                      ← Main entry point
├── sendMail.php                    ← Email handler (REQUIRED)
├── .htaccess                       ← URL rewriting (optional)
├── php_errors.log                  ← Auto-generated by PHP
├── assets/
│   ├── index-[hash].js             ← Main JS bundle
│   ├── index-[hash].css            ← Styles
│   └── [other hashed files]
└── [other build output files]
```

---

## 🔐 Security Recommendations

### 1. Protect sendMail.php credentials
```bash
# Set restrictive permissions
chmod 600 sendMail.php
```

### 2. Hide error messages in production
In `sendMail.php` line 4:
```php
ini_set('display_errors', 0); // Already set correctly
```

### 3. Add to .htaccess to prevent direct access to logs
```apache
<Files "php_errors.log">
  Order allow,deny
  Deny from all
</Files>
```

### 4. Regular backups
- Backup your `htdocs` folder regularly
- Keep a copy of `sendMail.php` with credentials in a secure location

---

## 📧 Email Configuration Quick Reference

### Current Configuration (from your sendMail.php):
```php
SMTP Provider: Gmail
SMTP Host: smtp.gmail.com
SMTP Port: 587
Username: impulse.hub.tech@gmail.com
Security: TLS

From Email: noreply@impulsehub.com
From Name: IMPULSE HUB
Recipient: contact@impulsehub.tech
```

### To change recipient email:
Edit line 56 in `sendMail.php`:
```php
$ADMIN_EMAIL = 'your-new-email@domain.com';
```

### To use different SMTP provider:
See `EMAIL_SETUP.md` for SendGrid, Mailgun, or custom SMTP setup

---

## 🎯 Quick Deployment Summary

1. ✅ Run `npm run build`
2. ✅ Copy entire `build/` folder contents
3. ✅ Copy `sendMail.php` from project root
4. ✅ Upload all files to htdocs
5. ✅ Verify `sendMail.php` is in root (same level as index.html)
6. ✅ Test website functionality
7. ✅ Test email forms
8. ✅ Done! 🚀

---

## 📞 Support

If you encounter issues:

1. Check browser console (F12) for JavaScript errors
2. Check `php_errors.log` in cPanel for PHP errors
3. Verify all files uploaded correctly
4. Test SMTP connection separately
5. Review `EMAIL_SETUP.md` for detailed email troubleshooting

---

**IMPULSE HUB** | Elite Trading Platform  
© 2025 All Rights Reserved

**Last Updated:** October 28, 2025
