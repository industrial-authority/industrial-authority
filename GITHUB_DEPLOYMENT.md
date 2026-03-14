# Industrial Authority - 100% GitHub Hosted Solution

This is a completely free, self-hosted solution that runs entirely on GitHub. No third-party platforms needed.

## 🚀 How It Works

### Frontend (GitHub Pages)
- Automatically deployed to `https://industrial-authority.github.io/industrial-authority`
- Served globally via GitHub's CDN
- Rebuilds automatically on every push to `main`
- Fast, reliable, and completely free

### Backend (GitHub Actions)
- Runs on a schedule (hourly) to process audits
- Scores leads automatically
- Sends notifications
- Handles Stripe webhooks
- All logic is in `/scripts` directory

### Database (GitHub)
- Data stored as JSON files in `/data` directory
- Committed to the repository
- Version controlled automatically
- No external database needed

## 📋 Setup Instructions

### 1. Enable GitHub Pages
1. Go to your repository Settings
2. Scroll to "Pages"
3. Set Source to "Deploy from a branch"
4. Select `main` branch, `/dist/public` folder
5. Save

### 2. Add Secrets (Optional but Recommended)
1. Go to Settings → Secrets and variables → Actions
2. Add these secrets:
   - `SENDGRID_API_KEY` - For email notifications (free tier: 100 emails/day)
   - `STRIPE_SECRET_KEY` - For payment processing
   - `STRIPE_WEBHOOK_SECRET` - For Stripe webhooks

### 3. Deploy
Just push to `main` branch:
```bash
git push origin main
```

The GitHub Actions workflows will automatically:
- Build your frontend
- Deploy to GitHub Pages
- Process audits hourly
- Score leads
- Send notifications

## 📊 What's Included

### Frontend
- ✅ Professional dark theme
- ✅ Responsive design (mobile + desktop)
- ✅ Audit request form
- ✅ Admin dashboard
- ✅ Lead scoring visualization
- ✅ Payment integration

### Backend (GitHub Actions)
- ✅ Automatic audit processing
- ✅ Lead scoring (hot/warm/cold)
- ✅ Email notifications
- ✅ Stripe webhook handling
- ✅ Payment tracking

### Data Storage
- ✅ `/data/audits.json` - All audit requests
- ✅ `/data/leads.json` - Scored and categorized leads
- ✅ `/data/payments.json` - Payment records
- ✅ `/data/notifications.json` - Notification history

## 🔄 Workflows

### 1. Deploy Workflow (`.github/workflows/deploy.yml`)
- Triggers: On push to `main`
- Action: Builds and deploys frontend to GitHub Pages
- Time: ~2-3 minutes

### 2. Backend Workflow (`.github/workflows/backend.yml`)
- Triggers: Hourly schedule + manual trigger
- Actions:
  - Process pending audits
  - Score leads
  - Send notifications
- Time: ~1 minute

### 3. Stripe Webhook Workflow (`.github/workflows/stripe-webhooks.yml`)
- Triggers: Via GitHub API dispatch
- Action: Handles payment events
- Time: ~30 seconds

## 💰 Cost Breakdown

| Component | Cost | Notes |
|-----------|------|-------|
| GitHub Pages | FREE | Unlimited bandwidth, global CDN |
| GitHub Actions | FREE | 2,000 minutes/month free |
| Domain | FREE | Use `github.io` subdomain |
| Email (SendGrid) | FREE | 100 emails/day free tier |
| Database | FREE | JSON files in repo |
| **Total** | **$0/month** | Completely free forever |

## 📈 Scaling

This solution can handle:
- ✅ 100+ audit requests per month
- ✅ Real-time lead scoring
- ✅ Unlimited storage (GitHub limits)
- ✅ Global audience (CDN)

If you need more:
- Upgrade GitHub Actions (pay-as-you-go)
- Use SendGrid paid tier for more emails
- Add custom domain ($10-15/year)

## 🔐 Security

- ✅ All secrets stored in GitHub Secrets
- ✅ No credentials in code
- ✅ HTTPS by default
- ✅ GitHub's security infrastructure

## 📞 Support

For issues:
1. Check GitHub Actions logs
2. Review workflow runs
3. Check `/data` files for data integrity
4. Verify secrets are set correctly

## 🎯 Next Steps

1. **Enable GitHub Pages** (see Setup section)
2. **Add Secrets** (optional but recommended)
3. **Push to main** to trigger deployment
4. **Visit your site** at `https://industrial-authority.github.io/industrial-authority`
5. **Monitor workflows** in Actions tab

## 📝 File Structure

```
industrial-authority/
├── .github/
│   └── workflows/
│       ├── deploy.yml              # Frontend deployment
│       ├── backend.yml             # Backend processing
│       └── stripe-webhooks.yml     # Payment handling
├── scripts/
│   ├── process-audits.js          # Process audit requests
│   ├── score-leads.js             # Score and categorize leads
│   ├── send-notifications.js      # Send email notifications
│   └── handle-stripe-webhook.js   # Handle payments
├── data/
│   ├── audits.json                # Audit requests
│   ├── leads.json                 # Scored leads
│   ├── payments.json              # Payment records
│   └── notifications.json         # Notification history
├── client/                         # Frontend React app
├── dist/                           # Built frontend (deployed to Pages)
└── package.json
```

## 🚀 Your Site is Live!

Once deployed, your site will be available at:
- **GitHub Pages:** `https://industrial-authority.github.io/industrial-authority`
- **Custom Domain:** Add your own domain in GitHub Pages settings

Start attracting industrial clients and scale your $10k-$20k/month goal! 🎯
