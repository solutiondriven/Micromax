# IMPULSE HUB - SMTP Email Setup Guide

## Overview
Your IMPULSE HUB platform now uses SMTP for reliable email delivery. This setup works with Gmail, SendGrid, Mailgun, or any SMTP server - much more reliable than basic PHP mail()!

## 🚀 Quick Setup (Choose One Option)

### Option 1: Gmail SMTP (Easiest for Testing)

1. **Enable 2-Step Verification** on your Gmail account:
   - Go to https://myaccount.google.com/security
   - Enable 2-Step Verification

2. **Create App Password**:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and your device
   - Copy the 16-character password

3. **Update `sendMail.php`** (lines 21-25):
   ```php
   $SMTP_HOST = 'smtp.gmail.com';
   $SMTP_PORT = 587;
   $SMTP_USERNAME = 'your-email@gmail.com'; // Your Gmail
   $SMTP_PASSWORD = 'xxxx xxxx xxxx xxxx'; // App password from step 2
   $SMTP_SECURE = 'tls';
   ```

4. **Update Email Addresses** (lines 43-45):
   ```php
   $FROM_EMAIL = 'your-email@gmail.com'; // Same as SMTP_USERNAME
   $FROM_NAME = 'IMPULSE HUB';
   $ADMIN_EMAIL = 'contact@impulsehub.tech'; // Where you receive emails
   ```

**That's it!** Test by submitting any form on your site.

---

### Option 2: SendGrid (Best for Production)

SendGrid offers 100 free emails/day - perfect for production!

1. **Sign up** at https://signup.sendgrid.com/

2. **Create API Key**:
   - Go to Settings → API Keys
   - Create API Key with "Mail Send" permissions
   - Copy the key

3. **Update `sendMail.php`** (uncomment lines 27-31):
   ```php
   $SMTP_HOST = 'smtp.sendgrid.net';
   $SMTP_PORT = 587;
   $SMTP_USERNAME = 'apikey'; // Literally "apikey"
   $SMTP_PASSWORD = 'SG.xxxxxxxxxxxxxxxxxxxxxxx'; // Your API key
   $SMTP_SECURE = 'tls';
   ```

4. **Verify Sender Email**:
   - Go to Settings → Sender Authentication
   - Verify your sender email
   - Update `$FROM_EMAIL` in sendMail.php

---

### Option 3: Mailgun (Alternative)

1. **Sign up** at https://signup.mailgun.com/

2. **Get SMTP Credentials**:
   - Go to Sending → Domain Settings → SMTP Credentials
   - Create credentials or use existing

3. **Update `sendMail.php`** (uncomment lines 33-37):
   ```php
   $SMTP_HOST = 'smtp.mailgun.org';
   $SMTP_PORT = 587;
   $SMTP_USERNAME = 'postmaster@yourdomain.mailgun.org';
   $SMTP_PASSWORD = 'your-mailgun-password';
   $SMTP_SECURE = 'tls';
   ```

---

### Option 4: Custom SMTP Server (Your Hosting)

If your hosting provides SMTP:

1. **Get SMTP details** from your hosting provider

2. **Update `sendMail.php`** (uncomment lines 39-43):
   ```php
   $SMTP_HOST = 'mail.yourdomain.com';
   $SMTP_PORT = 587; // Or 465 for SSL
   $SMTP_USERNAME = 'noreply@yourdomain.com';
   $SMTP_PASSWORD = 'your-password';
   $SMTP_SECURE = 'tls'; // Or 'ssl'
   ```

---

## 📧 Email Features

All forms automatically send emails for:

1. **Copy Trading Registration** - Non-traders copying verified traders
2. **Bot Customization Requests** - Verified traders requesting bot setup
3. **Plan Selection** - Verified traders selecting capacity tiers  
4. **Payment Link Requests** - Verified traders ready to purchase plans

## 🔧 Configuration Reference

### SMTP Settings Explained:

| Setting | Description | Common Values |
|---------|-------------|---------------|
| `SMTP_HOST` | Mail server address | smtp.gmail.com, smtp.sendgrid.net |
| `SMTP_PORT` | Server port | 587 (TLS), 465 (SSL), 25 (unsecured) |
| `SMTP_USERNAME` | Your SMTP username | Usually your email or "apikey" |
| `SMTP_PASSWORD` | Your SMTP password | App password or API key |
| `SMTP_SECURE` | Encryption type | 'tls' or 'ssl' |

### Email Settings:

```php
$FROM_EMAIL = 'noreply@impulsehub.com';  // Sender email address
$FROM_NAME = 'IMPULSE HUB';              // Sender name
$ADMIN_EMAIL = 'contact@impulsehub.tech'; // Recipient email
```

## 🧪 Testing

### Local Development:
- Gmail SMTP works great for local testing
- No additional server setup needed
- Test forms immediately

### Production:
- Use SendGrid or Mailgun for better deliverability
- Monitor sending limits
- Check spam folders initially

## 🐛 Troubleshooting

### "Failed to send email"

**1. Check SMTP Credentials:**
   - Verify username and password are correct
   - For Gmail, ensure you're using App Password, not regular password

**2. Check Port and Security:**
   ```php
   // Try switching between:
   $SMTP_PORT = 587; $SMTP_SECURE = 'tls';
   // OR
   $SMTP_PORT = 465; $SMTP_SECURE = 'ssl';
   ```

**3. Check Server Logs:**
   - Look in `php_errors.log` for detailed error messages

**4. Test SMTP Connection:**
   Create `test-smtp.php`:
   ```php
   <?php
   $smtp = fsockopen('smtp.gmail.com', 587, $errno, $errstr, 30);
   if ($smtp) {
       echo "Connection successful!";
       fclose($smtp);
   } else {
       echo "Connection failed: $errstr ($errno)";
   }
   ?>
   ```

### Gmail-Specific Issues:

**"Authentication failed"**
- Make sure 2-Step Verification is enabled
- Use App Password, not your regular Gmail password
- App password should have NO spaces

**"Less secure app access"**
- This is outdated - use App Passwords instead

### SendGrid-Specific Issues:

**"Authentication failed"**
- Username must be exactly `apikey` (not your email)
- Password is the full API key starting with `SG.`
- Verify sender email in SendGrid dashboard

### Port Blocked:

Some hosting providers block certain ports:
- Try port 587 first (most common)
- Try port 465 if 587 doesn't work
- Port 25 is often blocked (don't use)

## 📊 Email Volume Limits

### Free Tiers:
- **Gmail**: 100-500 emails/day
- **SendGrid**: 100 emails/day forever free
- **Mailgun**: 5,000 emails/month for 3 months

### Recommendations:
- **Small sites** (<100 emails/day): Gmail works fine
- **Growing sites**: Use SendGrid free tier
- **Production sites**: Consider paid SendGrid ($15/mo for 40k emails)

## 🔒 Security Best Practices

1. **Never commit credentials to Git:**
   ```bash
   # Add to .gitignore
   sendMail.php
   ```

2. **Use environment variables** (optional advanced setup):
   ```php
   $SMTP_PASSWORD = getenv('SMTP_PASSWORD');
   ```

3. **Restrict file permissions:**
   ```bash
   chmod 600 sendMail.php
   ```

4. **Keep error display off in production:**
   ```php
   ini_set('display_errors', 0); // Line 4 of sendMail.php
   ```

## 📧 Email Format

All emails include:
- ✅ Professional ASCII art borders
- ✅ Structured data sections  
- ✅ Timestamps in server timezone
- ✅ Sanitized user input
- ✅ IMPULSE HUB branding

## 🚀 Upgrading Email Service

As your platform grows, consider these features:

### SendGrid Pro Features:
- Email validation
- Click/open tracking
- Dedicated IP address
- Email templates
- Analytics dashboard

### Mailgun Features:
- Email validation API
- Routing and webhooks
- Message scheduling
- Tag-based analytics

## 📁 File Structure

```
├── sendMail.php              # SMTP email handler
└── components/
    └── StrategiesPage.tsx    # Registration forms
```

## 💡 Pro Tips

1. **Test with Real Email**: Use your actual email as `$ADMIN_EMAIL` during setup

2. **Check Spam Folder**: First emails often go to spam - mark as "Not Spam"

3. **Whitelist Sender**: Add sender email to contacts to improve deliverability

4. **Monitor Logs**: Keep an eye on `php_errors.log` for issues

5. **Use Different Emails**: Don't use same email for `FROM_EMAIL` and `ADMIN_EMAIL` with some providers

## 🎯 Next Steps

1. Choose your SMTP provider (Gmail recommended for quick start)
2. Update credentials in `sendMail.php`
3. Upload to your server
4. Test each form type
5. Check spam folder if needed
6. Monitor `php_errors.log` for any issues

## 📞 Common Provider Support Links

- **Gmail App Passwords**: https://myaccount.google.com/apppasswords
- **SendGrid Docs**: https://docs.sendgrid.com/for-developers/sending-email/getting-started-smtp
- **Mailgun Docs**: https://documentation.mailgun.com/en/latest/quickstart-sending.html

---

**IMPULSE HUB** | Elite Trading Platform  
© 2025 All Rights Reserved
