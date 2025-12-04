# cPanel Deployment Guide for IMPULSE HUB

## ✅ Will Your Email Work on cPanel?

**YES** - Your email setup will work on most cPanel hosting environments with minimal configuration.

## Pre-Deployment Checklist

### 1. Update Email Configuration

**File:** `sendMail.php` (Line 34)

```php
$adminEmail = "contact@impulsehub.tech";
```

**Action Required:**
- Replace with your actual domain email (e.g., `admin@yourdomain.com`)
- Must be an email that exists on your cPanel account
- Ideally use the same domain as your website

### 2. Production Settings Already Applied

✅ Error display is now OFF for production security  
✅ Errors will log to `php_errors.log` file  
✅ CORS headers are configured  
✅ JSON responses are standardized  

## Deployment Steps

### Step 1: Upload Files to cPanel

1. **Access File Manager** in cPanel
2. Navigate to `public_html` (or your root directory)
3. Upload ALL project files:
   - `App.tsx` and all React files
   - `sendMail.php` (CRITICAL - must be in root)
   - `components/` folder
   - `styles/` folder
   - All other files

### Step 2: Set File Permissions

1. Right-click `sendMail.php` → Change Permissions
2. Set to: **644** (rw-r--r--)
3. For directories: **755** (rwxr-xr-x)

### Step 3: Create Email Account

1. Go to **Email Accounts** in cPanel
2. Create the email you set in `sendMail.php`
3. Example: `contact@yourdomain.com`
4. Set a strong password

### Step 4: Configure Email Authentication (Recommended)

**In cPanel Email Deliverability:**

1. Navigate to **Email Deliverability**
2. Check your domain
3. Click **Manage** if there are issues
4. Install **SPF** and **DKIM** records (click repair if needed)
5. This prevents emails from going to spam

### Step 5: Test PHP Mail Functionality

Create a test file `test-mail.php` in your root:

```php
<?php
$to = "your-email@gmail.com"; // Your test email
$subject = "Test Email from cPanel";
$message = "If you receive this, PHP mail() is working!";
$headers = "From: contact@yourdomain.com\r\n";

if (mail($to, $subject, $message, $headers)) {
    echo "Test email sent successfully!";
} else {
    echo "Failed to send test email.";
}
?>
```

Visit: `https://yourdomain.com/test-mail.php`

### Step 6: Update React Fetch URL (If Needed)

**File:** `components/StrategiesPage.tsx`

If your frontend and backend are on different domains:

```typescript
// Change from:
fetch('/sendMail.php', {

// To:
fetch('https://yourdomain.com/sendMail.php', {
```

**Note:** If both are on the same domain, keep it as `/sendMail.php`

## Common Issues & Solutions

### Issue 1: "Failed to send email"

**Causes:**
- PHP mail() function is disabled
- Email address doesn't exist
- Server doesn't have mail server configured

**Solution:**
1. Contact your hosting provider
2. Ask: "Is PHP mail() function enabled?"
3. Alternative: Ask about SMTP configuration

### Issue 2: Emails go to Spam

**Solution:**
1. Set up SPF records (see Step 4)
2. Set up DKIM records (see Step 4)
3. Use email matching your domain
4. Add "From" email to recipient's contacts

### Issue 3: CORS Errors

**Symptoms:** Console shows "Access-Control-Allow-Origin" error

**Solution:**
Your `sendMail.php` already has CORS headers, but if issues persist:

```php
header('Access-Control-Allow-Origin: https://yourdomain.com');
```

Replace `*` with your specific domain on line 8.

### Issue 4: 500 Internal Server Error

**Check:**
1. File permissions (should be 644)
2. PHP version (needs 5.4+)
3. Error log: `public_html/php_errors.log`

## Verify Deployment

### Test Each Form:

1. **Copy Trading Registration**
   - Fill out form on Strategies page
   - Click "Register to Copy Trades"
   - Check for success toast
   - Verify email received at `contact@yourdomain.com`

2. **Bot Customization**
   - Click "Customize" button
   - Fill out form
   - Submit and check email

3. **Plan Selection**
   - Select a tier
   - Click "Select Plan"
   - Verify email received

4. **Payment Request**
   - Click "Get Payment Link"
   - Fill form and submit
   - Check for email

## Alternative: Use SMTP Instead of mail()

If PHP mail() doesn't work on your host, you can use PHPMailer with SMTP:

### Install PHPMailer:
```bash
composer require phpmailer/phpmailer
```

### Update sendMail.php:
```php
use PHPMailer\PHPMailer\PHPMailer;
require 'vendor/autoload.php';

$mail = new PHPMailer(true);
$mail->isSMTP();
$mail->Host = 'smtp.gmail.com'; // Or your SMTP server
$mail->SMTPAuth = true;
$mail->Username = 'your-email@gmail.com';
$mail->Password = 'your-app-password';
$mail->SMTPSecure = 'tls';
$mail->Port = 587;

$mail->setFrom('noreply@yourdomain.com', 'IMPULSE HUB');
$mail->addAddress($adminEmail);
$mail->Subject = $subject;
$mail->Body = $body;

$mail->send();
```

## Professional Email Services (Optional Upgrade)

For better deliverability and tracking:

### SendGrid
- Free tier: 100 emails/day
- Better deliverability
- Email analytics

### Mailgun
- Free tier: 100 emails/day
- Easy API integration
- Detailed logs

### Amazon SES
- Very cheap ($0.10 per 1,000 emails)
- Requires AWS account
- Excellent deliverability

## Final Checklist Before Going Live

- [ ] Updated `$adminEmail` to your domain email
- [ ] Created email account in cPanel
- [ ] Set up SPF/DKIM records
- [ ] Tested PHP mail() with test script
- [ ] Uploaded all files to cPanel
- [ ] Set correct file permissions (644 for PHP)
- [ ] Tested all 4 forms
- [ ] Checked spam folder for test emails
- [ ] Verified toast notifications work
- [ ] Deleted `test-mail.php` after testing

## Need Help?

### Check Error Logs:
```
/public_html/php_errors.log
```

### Browser Console:
Press F12 → Console tab → Look for errors

### Contact Your Host:
Ask specifically: "Is PHP mail() enabled and configured?"

---

**IMPORTANT:** After successful deployment, delete:
- `test-mail.php` (if you created it)
- This deployment guide (optional, for security)

---

## Success Criteria

✅ Form submissions show success toast  
✅ Emails arrive at your admin inbox  
✅ No console errors in browser  
✅ Email format looks professional  
✅ All data fields are populated correctly  

Your email system is now production-ready for cPanel hosting!

---
**IMPULSE HUB** | Elite Trading Platform  
© 2025 All Rights Reserved
