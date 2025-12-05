# NBFC Loan Assistance System - Admin Guide

## 🔐 Admin Login Credentials

### Admin Account
- **Username:** `admin`
- **Password:** `admin123`

### Officer Account
- **Username:** `officer`
- **Password:** `officer123`

## 📋 System Overview

This NBFC Loan Assistance System provides:
- **Customer Portal:** Interactive loan application chatbot
- **Admin Dashboard:** Complete lead management and tracking system

## 🎯 Features

### Customer Portal
- Conversational loan application process
- Real-time eligibility assessment
- Credit scoring simulation
- Instant approval/rejection with detailed justification
- Downloadable sanction letters for approved loans
- Application ID tracking

### Admin Dashboard

#### 1. **Dashboard Statistics**
- Total applications count
- Approved loans count with percentage
- Rejected applications count with percentage
- Pending applications count with percentage

#### 2. **Application Management**
- View all loan applications in real-time
- Filter by status:
  - All Applications
  - Approved
  - Rejected
  - Pending
- Sort and search functionality

#### 3. **Detailed Application View**
Each application shows:
- **Personal Information:** Name, age, phone, city
- **Employment Details:** Employment type, monthly income, existing EMI
- **Loan Details:** Requested amount, tenure, loan purpose
- **Credit Assessment:** Credit score, EMI-to-income ratio, eligibility result
- **Sanction Details** (if approved):
  - Approved amount
  - Monthly EMI
  - Interest rate
  - Processing fee
  - Total interest and repayment
  - Downloadable sanction letter
- **Rejection Reason** (if rejected): Detailed justification

#### 4. **Lead Tracking**
All applications are automatically saved with:
- Unique Application ID
- Timestamp (date and time)
- Complete applicant data
- Application status
- Approval/rejection details

## 🚀 How to Use

### For Customers
1. Open the application (customer view)
2. Follow the chatbot prompts to provide:
   - Personal details (name, age, city, phone)
   - Employment information
   - Financial details (income, existing EMIs)
   - Loan requirements (amount, purpose, tenure)
3. Receive instant decision with justification
4. Download sanction letter (if approved)
5. Note your Application ID for future reference

### For Officers/Admins
1. Click "Officer Login" button (top-right corner)
2. Enter credentials:
   - Username: `admin` or `officer`
   - Password: `admin123` or `officer123`
3. View dashboard with statistics
4. Browse applications using filter tabs
5. Click "View Details" on any application for complete information
6. Download sanction letters for approved loans
7. Review rejection reasons for denied applications
8. Logout when done

## 📊 Application Status Types

- **Pending:** Application in progress or incomplete
- **Approved:** Loan sanctioned with sanction letter generated
- **Rejected:** Application denied with detailed reason

## 🔄 Data Storage

- All data is stored locally in browser's localStorage
- Data persists across sessions on the same browser
- To clear all data: Clear browser localStorage
- Real-time updates every 5 seconds in admin dashboard

## 🎨 Admin Dashboard Sections

### 1. Header
- System branding
- Current user display
- Logout button

### 2. Stats Cards
- Visual representation of key metrics
- Color-coded by status
- Percentage calculations

### 3. Filter Tabs
- Quick filtering by status
- Count badges on each tab
- Active tab highlighting

### 4. Application Table
- Sortable columns
- Application ID (unique identifier)
- Applicant name and contact
- Loan amounts (requested vs approved)
- Status badges with icons
- Application date and time
- View Details action button

### 5. Application Details Page
- Complete applicant profile
- Financial assessment
- Credit evaluation
- Sanction/rejection information
- Download functionality
- Back navigation

## 🛡️ Security Notes

- Session-based authentication
- Credentials validated on login
- Session cleared on logout
- Admin view not accessible without authentication
- No PII collected beyond necessary loan processing data

## 📞 Support

For any queries or issues:
- **Phone:** 1800-XXX-XXXX
- **Email:** support@nbfc.com
- **Hours:** Monday to Saturday, 9:00 AM - 6:00 PM

## 🔧 Technical Details

### Loan Approval Formula
```
Max Eligible Loan = (Monthly Income × 60%) × Tenure (months)
Final Approval Limit = [(0.6 × Income) – Existing EMI] × Tenure
```

### EMI Calculation
```
EMI = [P × R × (1+R)^N] / [(1+R)^N – 1]
Where:
  P = Loan Principal
  R = Monthly Interest Rate
  N = Tenure in Months
```

### Credit Score Ranges
- **750-900:** Excellent (12-13.5% interest)
- **700-749:** Good (15% interest)
- **650-699:** Fair (16.5% interest)
- **Below 650:** Poor (18% interest or rejection)

### Approval Rules
- ✅ Approved: If requested ≤ final approval limit
- ⚠️ Reduced Approval: If requested > limit but ≤ 120% of limit
- ❌ Rejected: If EMI-to-income > 50% OR score < 650 OR requested > 120% of limit

## 📝 Notes

- Processing fee: 2% of approved amount
- Sanction letter validity: 15 days
- First EMI due: 5th of next month
- All calculations follow RBI guidelines
- This is a demo system with mock data
