# 🚀 Quick Start Guide - NBFC Loan Assistance System

## 🔑 Admin Login Credentials

```
Admin Account:
Username: admin
Password: admin123

Officer Account:
Username: officer
Password: officer123
```

## 📱 How to Access

### Customer View (Loan Application)
1. Open the application - you'll see the loan chatbot interface
2. Click "Officer Login" button in the top-right to access admin panel

### Admin/Officer View (Dashboard)
1. Click "Officer Login" button (top-right corner)
2. Enter credentials (admin/admin123 or officer/officer123)
3. View complete dashboard with all applications

## 🎯 Quick Test Flow

### Test a Customer Application:
1. Start in Customer View
2. Enter name: "John Doe"
3. Age: 30
4. Employment: "Salaried"
5. Income: 50000
6. Existing EMI: 0
7. Loan Amount: 200000
8. City: "Mumbai"
9. Phone: 9876543210
10. Purpose: "Medical"
11. Tenure: 24 months
12. Accept interest terms: "Yes"
13. Get instant approval with sanction letter!

### View in Admin Dashboard:
1. Click "Officer Login"
2. Login with admin/admin123
3. See your application in the dashboard
4. Click "View Details" to see complete information
5. Download sanction letter if approved

## 🎨 Features Overview

### Customer Portal
- ✅ Conversational AI loan application
- ✅ Real-time eligibility check
- ✅ Instant approval/rejection with reasoning
- ✅ Downloadable sanction letters
- ✅ Application ID tracking

### Admin Dashboard
- ✅ Real-time statistics (Total, Approved, Rejected, Pending)
- ✅ Filter applications by status
- ✅ Detailed application view
- ✅ Complete customer information
- ✅ Credit assessment details
- ✅ Sanction letter download for approved loans
- ✅ Rejection reasons for denied applications
- ✅ Demo data generator (when dashboard is empty)

## 📊 Application Statuses

- **Approved** ✅: Loan sanctioned with sanction letter
- **Rejected** ❌: Application denied with detailed reason
- **Pending** ⏳: Application in progress

## 💾 Data Storage

- All data stored in browser's localStorage
- Persists across sessions
- Real-time sync between customer and admin views
- To reset: Clear browser localStorage or use browser dev tools

## 🧪 Testing Tips

1. **Quick Approval**: High income (>50k), no EMI, good loan amount
2. **Quick Rejection**: Age < 21 OR Income < 15k OR EMI > 50% of income
3. **Generate Demo Data**: Login to admin panel → Click "Generate Demo Applications" button (when empty)

## 📋 Application ID Format

`APP-{timestamp}-{random}`

Example: `APP-1701234567890-XYZ123ABC`

## 🔄 Workflow

```
Customer Applies → Master Agent (Data Collection)
                 ↓
              Sales Agent (Terms & Purpose)
                 ↓
          Verification Agent (KYC Check)
                 ↓
         Underwriting Agent (Credit Check)
                 ↓
    Approved? → Yes → Sanction Agent → Letter Generated
              ↓ No
           Rejected with Reason
```

## 🌟 Pro Tips

1. Keep Application IDs for reference
2. Use filter tabs in admin for quick sorting
3. Dashboard auto-refreshes every 5 seconds
4. Download sanction letters before session expires
5. Check rejection reasons for improvement guidance

## 📞 Need Help?

All applications include contact information:
- Phone: 1800-XXX-XXXX
- Email: support@nbfc.com

---

**Ready to Test?** 

1. Start with Customer View → Apply for a loan
2. Switch to Officer Login → View your application
3. Explore the dashboard features!
