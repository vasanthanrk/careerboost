# SmartCV Maker AI - Workflow Documentation

## Table of Contents
1. [Authentication Pages](#authentication-pages)
   - [Login Page](#login-page)
   - [Signup Page](#signup-page)
   - [Forgot Password Page](#forgot-password-page)
2. [Dashboard Pages](#dashboard-pages)
   - [Dashboard Home](#dashboard-home)
   - [Resume Builder](#resume-builder)
   - [Cover Letter Generator](#cover-letter-generator)
   - [Job Fit Analyzer](#job-fit-analyzer)
   - [LinkedIn Optimizer](#linkedin-optimizer)
   - [Portfolio Generator](#portfolio-generator)
   - [Pricing Plans](#pricing-plans)
   - [Settings](#settings)
3. [Navigation & Layout](#navigation--layout)

---

## Authentication Pages

### Login Page
**Route:** `/login`

**Purpose:**
Allow existing users to authenticate and access their SmartCV Maker account.

**User Workflow:**
1. User lands on login page
2. User enters email address
3. User enters password
4. User clicks "Sign In" button
5. System validates credentials
6. On success: Redirect to Dashboard Home (`/dashboard`)
7. On failure: Display error message

**Key Features:**
- Email input field with validation
- Password input field with show/hide toggle
- "Remember me" checkbox
- "Forgot password?" link → navigates to Forgot Password Page
- "Sign in with Google" social login option
- "Sign in with GitHub" social login option
- "Don't have an account?" link → navigates to Signup Page

**Form Validations:**
- Email: Required, valid email format
- Password: Required, minimum length

**Success Actions:**
- Toast notification: "Login successful!"
- Redirect to `/dashboard`

---

### Signup Page
**Route:** `/signup`

**Purpose:**
Enable new users to create a SmartCV Maker account.

**User Workflow:**
1. User lands on signup page
2. User enters full name
3. User enters email address
4. User creates password
5. User confirms password
6. User clicks "Create Account" button
7. System validates input and creates account
8. On success: Redirect to Dashboard Home
9. On failure: Display validation errors

**Key Features:**
- Full name input field
- Email input field with validation
- Password input field with strength indicator
- Confirm password field
- Terms of service checkbox
- "Sign up with Google" social signup option
- "Sign up with GitHub" social signup option
- "Already have an account?" link → navigates to Login Page

**Form Validations:**
- Name: Required
- Email: Required, valid email format, unique email
- Password: Required, minimum 8 characters, contains uppercase, lowercase, number
- Confirm Password: Required, must match password
- Terms: Must be accepted

**Success Actions:**
- Toast notification: "Account created successfully!"
- Redirect to `/dashboard`

---

### Forgot Password Page
**Route:** `/forgot-password`

**Purpose:**
Allow users to reset their password if they've forgotten it.

**User Workflow:**
1. User clicks "Forgot password?" from Login Page
2. User enters email address associated with account
3. User clicks "Send Reset Link" button
4. System sends password reset email
5. Success message displayed
6. User can return to Login Page

**Key Features:**
- Email input field
- "Send Reset Link" button
- "Back to Login" link → navigates to Login Page
- Success state showing confirmation message
- Instructions for checking email

**Form Validations:**
- Email: Required, valid email format

**Success Actions:**
- Toast notification: "Password reset link sent to your email!"
- Display success message with instructions
- Option to resend email after 60 seconds

---

## Dashboard Pages

### Dashboard Home
**Route:** `/dashboard`

**Purpose:**
Provide users with an overview of their career development progress and quick access to all tools.

**User Workflow:**
1. User logs in and lands on dashboard
2. User views personalized welcome message
3. User sees career progress stats (Resume Score, Job Match, LinkedIn Strength, Career Growth)
4. User can click on any stat card to view details
5. User can launch tools via Quick Actions cards
6. User reviews AI-powered insights and recommendations
7. User can upgrade to Pro plan via CTA banner

**Key Features:**

**Hero Section:**
- Personalized welcome message: "Welcome back, John! 👋"
- User status badges (Active, Free Plan)
- Quick action buttons:
  - "Continue Building" → `/resume-builder`
  - "Upgrade to Pro" → `/pricing`

**Stats Grid (4 Cards):**
1. **Resume Score (85%)**
   - Gradient: Violet to Purple
   - Shows progress bar
   - Description: "Strong foundation, room to grow"
   - Click → Navigate to Resume Builder

2. **Job Match (72%)**
   - Gradient: Blue to Cyan
   - Shows progress bar
   - Description: "24 matching opportunities"
   - Click → Navigate to Job Fit Analyzer

3. **LinkedIn Strength (68%)**
   - Gradient: Orange to Red
   - Shows progress bar
   - Description: "Profile needs optimization"
   - Click → Navigate to LinkedIn Optimizer

4. **Career Growth (90%)**
   - Gradient: Green to Emerald
   - Shows progress bar
   - Description: "Excellent progress!"

**Quick Actions (5 Cards):**
- Resume Builder - "Create & optimize"
- Cover Letter - "Generate instantly"
- Job Fit - "Analyze match"
- LinkedIn - "Boost profile"
- Portfolio - "Showcase work"

**Recent Activity Feed:**
- Shows last 3 activities with timestamps
- Examples: "Resume Updated", "Job Match Found", "AI Optimization Complete"

**AI-Powered Insights (3 Cards):**
1. Add quantifiable achievements (High priority)
2. Optimize for ATS systems (Medium priority)
3. Update LinkedIn headline (High priority)

**Upgrade CTA Banner:**
- Highlights premium features
- Lists benefits: Unlimited AI Tools, Priority Support, Career Coaching
- "View Plans" button → `/pricing`

**User Actions:**
- Click any stat card → Navigate to respective tool
- Click Quick Action card → Navigate to respective tool
- Click "Upgrade" buttons → Navigate to Pricing page
- View notifications via bell icon

---

### Resume Builder
**Route:** `/resume-builder`

**Purpose:**
Enable users to create, edit, and optimize professional resumes with AI assistance.

**User Workflow:**
1. User navigates to Resume Builder
2. User can choose to:
   - **Option A:** Build resume manually using tabs
   - **Option B:** Generate with AI modal
3. User fills in information across different tabs
4. User sees real-time preview on right side
5. User can generate AI suggestions for improvement
6. User downloads or saves resume

**Key Features:**

**Header:**
- Gradient hero section (Blue to Teal)
- "Generate with AI" button → Opens AI generation modal
- Title: "Resume Builder"
- Description: AI-powered resume creation

**AI Generation Modal:**
- Job title input
- Years of experience input
- Key skills (comma-separated)
- Work experience summary
- "Generate Resume" button
- Loading state with animation (2 seconds)
- Populates all tabs with AI-generated content

**Tabbed Input Form (5 Tabs):**

1. **Personal Info Tab:**
   - Full Name (required)
   - Email (required)
   - Phone (required)
   - Location
   - Portfolio/Website URL
   - LinkedIn profile URL

2. **Summary Tab:**
   - Professional summary textarea (500 chars)
   - AI suggestion: "Generate Summary" button
   - Character counter

3. **Experience Tab:**
   - Add multiple work experiences
   - Each entry includes:
     - Job Title (required)
     - Company (required)
     - Start Date (required)
     - End Date / "Current position" checkbox
     - Description textarea
   - "Add Experience" button
   - Delete button for each entry

4. **Education Tab:**
   - Add multiple education entries
   - Each entry includes:
     - Degree (required)
     - School (required)
     - Graduation Year
     - Description
   - "Add Education" button
   - Delete button for each entry

5. **Skills Tab:**
   - Add skills as tags
   - Skill input field
   - "Add Skill" button
   - Remove button for each skill
   - Visual skill tags with colors

**Real-time Preview:**
- Live preview of resume
- Shows all entered information
- Professional formatting
- Updates as user types

**Action Buttons:**
- "Save Resume" → Save to account
- "Download PDF" → Export as PDF
- "AI Optimize" → Get AI suggestions

**Form Validations:**
- Required fields marked with *
- Email format validation
- URL format validation
- Date validations

**Success Actions:**
- Toast: "Resume saved successfully!"
- Toast: "Downloading resume..."
- Toast: "AI content generated!"

---

### Cover Letter Generator
**Route:** `/cover-letter`

**Purpose:**
Generate personalized, professional cover letters tailored to specific job opportunities using AI.

**User Workflow:**
1. User navigates to Cover Letter Generator
2. User fills in job details form:
   - Job Role/Position
   - Company Name
   - Job Description (optional)
3. User clicks "Generate Cover Letter"
4. AI generates personalized cover letter (2 second loading)
5. User reviews generated letter in preview pane
6. User can:
   - Copy to clipboard
   - Download as PDF
   - Regenerate with different approach
7. User can edit content before using

**Key Features:**

**Header:**
- Gradient hero section (Green to Teal)
- Title: "Cover Letter Generator"
- Description: AI-powered cover letter creation

**Two-Column Layout:**

**Left Column - Input Form:**
- **Job Role/Position*** input
- **Company Name*** input
- **Job Description** textarea (optional, 8 rows)
- "Generate Cover Letter" button (gradient green)
- Loading state: spinner + "Generating Your Letter..."

**Pro Tips Card:**
- 3 numbered tips for better results:
  1. Include specific job requirements
  2. Personalize generated content
  3. Highlight achievements with metrics

**Right Column - Generated Letter:**
- Preview card with header
- Action buttons:
  - "Copy" → Copy to clipboard
  - "Refresh" → Regenerate letter
- Letter display area:
  - Professional formatting
  - Multi-paragraph structure
  - Includes: greeting, introduction, body paragraphs, closing, signature
- "Download as PDF" button
- "Copy to Clipboard" button

**Empty State:**
- Gray mail icon
- "No Cover Letter Yet"
- Instructions to fill form and generate

**Upgrade Banner:**
- Yellow/Orange gradient
- Features: Multiple templates, tone customization, unlimited generations
- "Upgrade Now" button

**Form Validations:**
- Job Role: Required
- Company Name: Required
- Shows error toast if required fields empty

**Success Actions:**
- Toast: "Cover letter generated successfully!"
- Toast: "Cover letter copied to clipboard!"
- Toast: "Downloading cover letter..."

---

### Job Fit Analyzer
**Route:** `/job-fit`

**Purpose:**
Analyze how well a user's resume matches a specific job description using AI, providing detailed scoring and recommendations.

**User Workflow:**
1. User navigates to Job Fit Analyzer
2. User pastes job description into textarea
3. User pastes their resume into textarea
4. User clicks "Analyze Job Fit"
5. AI analyzes match (3 second loading with progress)
6. System displays comprehensive results:
   - Overall match score
   - Breakdown by category
   - Matched skills
   - Missing skills
   - Detailed recommendations
7. User can export report or apply recommendations

**Key Features:**

**Header:**
- Gradient hero section (Orange to Red)
- Title: "Job Fit Analyzer"
- Description: AI-powered job matching analysis

**Input Form:**
- **Job Description** textarea
  - Placeholder: "Paste the complete job description..."
  - 12 rows, resizable
  - Required field

- **Your Resume** textarea
  - Placeholder: "Paste your resume content..."
  - 12 rows, resizable
  - Required field

- "Analyze Job Fit" button (gradient orange/red)
- Loading state with progress indicators:
  - Analyzing requirements...
  - Matching skills...
  - Calculating fit...
  - Generating recommendations...

**Results Display (JobMatchResult component):**

1. **Overall Match Score**
   - Large percentage display (e.g., 78%)
   - Color-coded:
     - 80-100%: Green (Excellent match)
     - 60-79%: Blue (Good match)
     - 40-59%: Orange (Fair match)
     - 0-39%: Red (Poor match)
   - Circular progress indicator
   - Match status text

2. **Category Breakdown (4 cards):**
   - **Skills Match** (85%)
   - **Experience Match** (75%)
   - **Education Match** (70%)
   - **Keywords Match** (80%)
   - Each with progress bar and icon

3. **Matched Skills Section:**
   - Grid of green badge tags
   - Shows skills user has that match job
   - Examples: React, TypeScript, Node.js, etc.

4. **Missing Skills Section:**
   - Grid of red badge tags
   - Shows skills from job description user lacks
   - Examples: Kubernetes, GraphQL, etc.
   - Prioritized by importance

5. **Detailed Recommendations (expandable cards):**
   - **Skills to Highlight**
     - List of existing skills to emphasize
     - Why they matter for this role
   
   - **Skills to Acquire**
     - List of missing critical skills
     - Learning resources suggestions
     - Priority level for each
   
   - **Resume Improvements**
     - Specific wording suggestions
     - Keyword optimization tips
     - Format recommendations
   
   - **Cover Letter Tips**
     - Points to emphasize
     - Company-specific talking points
     - Value proposition suggestions

6. **Action Buttons:**
   - "Optimize Resume" → Navigate to Resume Builder
   - "Generate Cover Letter" → Navigate to Cover Letter with pre-filled data
   - "Download Report" → Export analysis as PDF
   - "Save Analysis" → Save to account history

**Pro Tips Card:**
- 3 tips for better analysis:
  1. Include complete job description
  2. Paste full resume content
  3. Review missing skills section

**Form Validations:**
- Both textareas required
- Minimum character count (100 chars each)
- Error toast if fields empty

**Success Actions:**
- Toast: "Analysis complete!"
- Toast: "Report downloaded!"
- Smooth scroll to results

---

### LinkedIn Optimizer
**Route:** `/linkedin-optimizer`

**Purpose:**
Analyze and optimize LinkedIn profiles with AI-powered suggestions to increase visibility and recruiter engagement.

**User Workflow:**
1. User navigates to LinkedIn Optimizer
2. User fills in current LinkedIn profile information:
   - Headline
   - About/Summary
   - Current position
   - Skills (comma-separated)
3. User clicks "Analyze & Optimize"
4. AI analyzes profile (2-3 seconds)
5. System displays:
   - Profile strength score
   - Optimized headline suggestions
   - Enhanced about section
   - Keyword recommendations
   - Industry-specific tips
6. User can copy optimized content
7. User applies suggestions to LinkedIn profile

**Key Features:**

**Header:**
- Gradient hero section (Blue to Indigo)
- LinkedIn logo/icon
- Title: "LinkedIn Profile Optimizer"
- Description: Boost visibility and recruiter engagement

**Two-Column Layout:**

**Left Column - Input Form:**
1. **Current Headline** input
   - Placeholder: "Software Engineer | Full Stack Developer"
   - Max 220 characters (LinkedIn limit)
   - Character counter

2. **About Section** textarea
   - Placeholder: "Tell us about your professional background..."
   - 8-10 rows
   - Max 2600 characters
   - Character counter

3. **Current Position** input
   - Job title and company
   - Placeholder: "Senior Developer at TechCorp"

4. **Skills** input
   - Comma-separated list
   - Placeholder: "JavaScript, React, Node.js..."
   - Shows added skills as tags

5. "Analyze & Optimize" button (gradient blue/indigo)
   - Loading state with LinkedIn icon animation

**Right Column - Optimization Results:**

1. **Profile Strength Score**
   - Percentage: 0-100%
   - Color-coded progress bar
   - Categories breakdown:
     - Headline Strength
     - Summary Quality
     - Keyword Optimization
     - Skills Relevance

2. **Optimized Headline**
   - 3 AI-generated headline suggestions
   - Each with:
     - Headline text
     - "Copy" button
     - Explanation of why it works
   - SEO keyword highlighting

3. **Enhanced About Section**
   - Improved version of user's summary
   - Better structure and flow
   - Keywords strategically placed
   - "Copy" button
   - Before/After comparison option

4. **Keyword Recommendations**
   - Industry-specific keywords to add
   - Frequency suggestions
   - Placement recommendations
   - Trending keywords in your field

5. **Recommended Skills to Add**
   - List of 10-15 relevant skills
   - Sorted by importance
   - Based on industry trends
   - "Add to Profile" checklist

6. **Profile Tips (expandable sections):**
   - **Photo & Banner Optimization**
   - **Experience Section Tips**
   - **Engagement Strategies**
   - **Network Building Advice**

**Pro Features Banner:**
- LinkedIn Premium comparison
- Benefits of upgrading
- Profile analytics preview

**Action Buttons:**
- "Copy All Optimizations" → Copy formatted content
- "Download Report" → PDF with all suggestions
- "Apply to Resume" → Transfer to Resume Builder

**Form Validations:**
- Headline: Required, max 220 chars
- About: Required, min 200 chars
- Skills: At least 5 skills recommended

**Success Actions:**
- Toast: "Profile analyzed successfully!"
- Toast: "Content copied to clipboard!"
- Toast: "Report downloaded!"

---

### Portfolio Generator
**Route:** `/portfolio`

**Purpose:**
Create stunning, modern portfolio websites to showcase projects and skills with AI-generated content and design.

**User Workflow:**
1. User navigates to Portfolio Generator
2. User fills in portfolio information across 4 tabs:
   - About section
   - Skills list
   - Projects details
   - Experience entries
3. User can generate AI content for any section
4. User sees live preview of portfolio
5. User downloads portfolio as HTML/CSS or publishes online

**Key Features:**

**Header:**
- Gradient hero section (Pink to Rose)
- Title: "Portfolio Generator"
- Description: Create stunning portfolios in minutes

**Two-Column Layout:**

**Left Column - Input Tabs:**

1. **About Tab:**
   - **Name** input (required)
   - **Title/Role** input (e.g., "Full Stack Developer")
   - **Bio** textarea (about yourself)
   - **Email** input
   - **Location** input
   - **GitHub URL** input
   - **LinkedIn URL** input
   - **Website URL** input
   - "Generate AI Bio" button

2. **Skills Tab:**
   - Skill input field
   - "Add Skill" button
   - Skill list with remove buttons
   - Category organization:
     - Frontend Skills
     - Backend Skills
     - Tools & Technologies
   - Visual skill badges
   - "Generate AI Skills" button (suggests based on role)

3. **Projects Tab:**
   - Add multiple projects
   - Each project includes:
     - **Project Name** (required)
     - **Description** textarea
     - **Technologies Used** (tags)
     - **Project URL** (live link)
     - **GitHub URL** (repo link)
     - **Image URL** (screenshot)
   - "Add Project" button
   - Delete button for each project
   - Reorder projects (drag & drop)
   - "Generate Sample Project" button

4. **Experience Tab:**
   - Add work experiences
   - Each entry includes:
     - **Job Title** (required)
     - **Company** (required)
     - **Duration** (e.g., "2020 - Present")
     - **Description** textarea
     - **Achievements** bullet points
   - "Add Experience" button
   - Delete button for each entry

**Right Column - Live Preview:**
- Real-time portfolio preview
- Modern, responsive design
- Sections:
  - Hero section with name and title
  - About section with bio
  - Skills grid with icons
  - Projects gallery with images
  - Experience timeline
  - Contact information
- Smooth scrolling between sections
- Glassmorphism effects
- Gradient accents
- Animations on scroll

**Action Buttons:**
- "Preview Portfolio" → Full-screen preview
- "Download HTML" → Export as HTML/CSS package
- "Publish Online" → Get shareable link (Pro feature)
- "Save Draft" → Save to account

**Portfolio Preview Features:**
- Responsive design preview (Desktop/Tablet/Mobile)
- Theme customization:
  - Color scheme selector (6 presets)
  - Font pairing options
  - Layout variations
- Interactive elements
- Contact form integration

**Empty States:**
- Helpful prompts for each empty section
- Sample data buttons
- Video tutorials

**Form Validations:**
- Name: Required
- Email: Valid email format
- URLs: Valid URL format
- At least 1 project recommended
- At least 3 skills recommended

**Success Actions:**
- Toast: "Portfolio saved!"
- Toast: "HTML downloaded!"
- Toast: "Portfolio published!"
- Toast: "AI content generated!"

---

### Pricing Plans
**Route:** `/pricing`

**Purpose:**
Display subscription plans, feature comparisons, and enable users to upgrade their accounts.

**User Workflow:**
1. User navigates to Pricing page
2. User views plan comparison:
   - Free plan (current)
   - Pro plan
   - Enterprise plan
3. User toggles between Monthly/Yearly billing (20% discount for yearly)
4. User reviews feature comparison table
5. User clicks "Upgrade" on preferred plan
6. User proceeds to checkout/payment

**Key Features:**

**Header:**
- Gradient hero section (Purple to Violet)
- Title: "Choose Your Plan"
- Subtitle: "Unlock your full career potential"
- Billing toggle: Monthly / Yearly (with "Save 20%" badge)

**Plan Cards (3 columns):**

1. **Free Plan**
   - Price: $0/month
   - Status badge: "Current Plan"
   - Features included:
     - 5 resume generations
     - 3 cover letters per month
     - Basic job fit analysis
     - Limited LinkedIn optimization
     - 1 portfolio
     - Community support
   - Button: "Current Plan" (disabled)
   - Border: Gray

2. **Pro Plan** (Most Popular badge)
   - Price: $29/month or $290/year
   - Gradient border (violet/purple)
   - Features included:
     - Unlimited resume generations
     - Unlimited cover letters
     - Advanced job fit analysis
     - Full LinkedIn optimization
     - Unlimited portfolios
     - AI optimization for all tools
     - Priority email support
     - Advanced analytics
     - Resume ATS scoring
     - Interview preparation
   - Button: "Upgrade to Pro" (gradient violet)
   - Highlight: Recommended ribbon

3. **Enterprise Plan**
   - Price: Custom pricing
   - Features included:
     - Everything in Pro
     - Team collaboration
     - Custom branding
     - API access
     - Dedicated account manager
     - Custom AI training
     - SLA guarantee
     - SSO integration
   - Button: "Contact Sales"
   - Border: Gold

**Feature Comparison Table:**
- Expandable/collapsible sections
- Categories:
  - Resume Tools
  - Cover Letters
  - Job Matching
  - LinkedIn Optimization
  - Portfolio Builder
  - Support & Analytics
  - Advanced Features
- Checkmarks, X marks, and text descriptions
- Tooltips for feature explanations

**FAQ Section:**
- Common questions accordion:
  1. Can I cancel anytime?
  2. What payment methods do you accept?
  3. Is there a refund policy?
  4. Can I upgrade/downgrade later?
  5. Do you offer student discounts?
  6. Is my data secure?

**Trust Indicators:**
- Payment security badges
- Money-back guarantee (30 days)
- Customer testimonials
- "Used by 50,000+ job seekers"

**CTA Banner:**
- "Still have questions?"
- "Chat with Sales" button
- "Schedule Demo" button

**User Actions:**
- Click "Upgrade to Pro" → Payment modal/page
- Click "Contact Sales" → Contact form
- Toggle Monthly/Yearly → Update prices
- Expand feature details → Show more info

**Success Actions:**
- Toast: "Plan upgraded successfully!"
- Toast: "Payment processed!"
- Redirect to Dashboard with pro features unlocked

---

### Settings
**Route:** `/settings`

**Purpose:**
Allow users to manage their account, profile, preferences, and subscription settings.

**User Workflow:**
1. User navigates to Settings
2. User sees tabbed interface with multiple sections
3. User can update:
   - Profile information
   - Account credentials
   - Notification preferences
   - Subscription/billing
   - Privacy settings
4. User saves changes
5. System confirms updates

**Key Features:**

**Header:**
- Gradient hero section (Gray to Dark Gray)
- Title: "Settings"
- Description: "Manage your account and preferences"

**Tabbed Interface (5 tabs):**

1. **Profile Tab:**
   - Avatar upload
     - Current avatar preview
     - "Change Avatar" button
     - Supports: JPG, PNG (max 5MB)
   - **Full Name** input
   - **Professional Title** input
   - **Bio** textarea (250 chars)
   - **Location** input
   - **Website** input
   - **Phone** input
   - "Save Profile" button
   - "Discard Changes" button

2. **Account Tab:**
   - **Email Address** input
     - "Verify Email" button if unverified
     - Verified badge if confirmed
   - **Change Password** section:
     - Current Password input
     - New Password input
     - Confirm Password input
     - Password strength indicator
     - "Update Password" button
   - **Two-Factor Authentication**
     - Enable/Disable toggle
     - QR code for setup
     - Backup codes download
   - **Connected Accounts**
     - Google (Connected/Disconnected)
     - GitHub (Connected/Disconnected)
     - LinkedIn (Connected/Disconnected)
   - **Danger Zone**
     - Delete Account button (red)
     - Confirmation modal

3. **Notifications Tab:**
   - **Email Notifications**
     - Product updates (toggle)
     - New features (toggle)
     - Tips and tutorials (toggle)
     - Marketing emails (toggle)
   - **Push Notifications**
     - Browser notifications (toggle)
     - Resume updates (toggle)
     - Job matches (toggle)
     - AI suggestions (toggle)
   - **Notification Frequency**
     - Real-time
     - Daily digest
     - Weekly summary
   - "Save Preferences" button

4. **Subscription Tab:**
   - **Current Plan**
     - Plan name badge
     - Price and billing cycle
     - Next billing date
     - "Manage Subscription" button
   - **Usage Statistics**
     - Resume generations: X/Y
     - Cover letters: X/Y
     - Job analyses: X/Y
     - Progress bars for each
   - **Billing History**
     - Table of past invoices
     - Date, Amount, Status
     - "Download Invoice" for each
   - **Payment Method**
     - Card details (masked)
     - "Update Card" button
     - "Add Payment Method" button
   - Plan actions:
     - "Upgrade Plan" → Navigate to Pricing
     - "Cancel Subscription" → Confirmation modal
     - "Reactivate" (if cancelled)

5. **Privacy Tab:**
   - **Data Privacy**
     - "Download My Data" button
     - "Delete My Data" button
   - **Profile Visibility**
     - Public profile toggle
     - Show email toggle
     - Show phone toggle
   - **AI Data Usage**
     - Use my data to improve AI (toggle)
     - Allow analytics tracking (toggle)
   - **Cookie Preferences**
     - Essential cookies (always on)
     - Analytics cookies (toggle)
     - Marketing cookies (toggle)
   - GDPR compliance note
   - "Save Privacy Settings" button

**Form Validations:**
- Email: Valid format
- Password: Min 8 chars, uppercase, lowercase, number
- Password confirmation: Must match
- File upload: Size and type validation
- Required fields marked

**Success Actions:**
- Toast: "Profile updated successfully!"
- Toast: "Password changed successfully!"
- Toast: "Preferences saved!"
- Toast: "Email verification sent!"
- Toast: "Subscription updated!"

**Confirmation Modals:**
- Account deletion
- Subscription cancellation
- Password change
- Email change
- Two-factor disable

---

## Navigation & Layout

### DashboardLayout Component
**Used by:** All authenticated pages

**Navigation Structure:**

**Top Bar (Header):**
- **Left Side:**
  - SmartCV Maker logo with sparkles icon
  - Company name with gradient text
  - Tagline: "AI-Powered"

- **Right Side:**
  - "Upgrade to Pro" button (desktop only)
  - Notifications bell icon (with red dot badge)
  - Profile dropdown menu:
    - User name: "John Doe"
    - User email: "john.doe@example.com"
    - "Profile Settings" → `/settings`
    - "Upgrade Plan" → `/pricing`
    - "Log Out" (red, with confirmation)

**Navigation Tabs (Desktop):**
Horizontal tabs below header:
1. Dashboard (Violet gradient)
2. Resume (Blue gradient)
3. Cover Letter (Green gradient)
4. Job Fit (Orange gradient)
5. LinkedIn (Blue/Indigo gradient)
6. Portfolio (Pink gradient)
7. Pricing (Yellow/Orange gradient)
8. Settings (Gray gradient)

Each tab shows:
- Icon with gradient background
- Label text
- Active state: Gradient background + white text
- Hover state: Gray background
- Active indicator: Bottom border

**Mobile Navigation:**
- Hamburger menu button (top right)
- Dropdown menu with all navigation items
- Same gradient styling as desktop
- "Log Out" button at bottom (red)
- Closes on navigation or overlay click

**Layout Features:**
- Sticky header (stays on scroll)
- Backdrop blur effect
- Gradient background: Gray to Violet
- Max width: 1600px centered
- Responsive padding
- Smooth transitions
- Active route highlighting

**Responsive Breakpoints:**
- Mobile: < 768px (hamburger menu)
- Tablet: 768px - 1024px (compact tabs)
- Desktop: > 1024px (full tabs)

---

## User Journey Examples

### Complete Resume Creation Journey
1. Login → Dashboard
2. View Resume Score (85%)
3. Click "Resume Builder" quick action
4. Click "Generate with AI"
5. Fill: Job Title, Experience, Skills
6. AI generates resume (2s loading)
7. Review all tabs (Personal, Summary, Experience, Education, Skills)
8. Edit and customize content
9. Preview in real-time
10. Click "Download PDF"
11. Success! Resume ready for applications

### Job Application Journey
1. Find job posting online
2. Copy job description
3. Navigate to Job Fit Analyzer
4. Paste job description
5. Paste resume content
6. Click "Analyze Job Fit"
7. Review match score (78%)
8. Note missing skills
9. Click "Optimize Resume"
10. Update resume with recommendations
11. Click "Generate Cover Letter"
12. Review and customize letter
13. Download both documents
14. Apply for job!

### Profile Optimization Journey
1. Dashboard shows LinkedIn score (68%)
2. Click LinkedIn card
3. Fill current profile information
4. Click "Analyze & Optimize"
5. Review optimized headline suggestions
6. Copy enhanced about section
7. Note recommended skills
8. Open LinkedIn in new tab
9. Update profile with optimizations
10. Return to SmartCV Maker
11. Build portfolio to match
12. Share portfolio on LinkedIn

### Account Upgrade Journey
1. Hit free plan limit (5 resumes)
2. See "Upgrade" banner
3. Click "View Plans"
4. Review plan comparison
5. Toggle to yearly billing (-20%)
6. Click "Upgrade to Pro"
7. Enter payment details
8. Confirm subscription
9. Return to Dashboard
10. See "Pro Plan" badge
11. Access unlimited features!

---

## Error Handling & Edge Cases

### Form Validation Errors
- Display inline error messages
- Highlight invalid fields in red
- Show toast notification for form-level errors
- Prevent submission until valid

### Network Errors
- Show retry button
- Display friendly error message
- Maintain form data (don't lose work)
- Offer offline mode where possible

### AI Generation Failures
- Show error message
- Offer "Try Again" button
- Suggest manual input alternative
- Log error for support

### Session Expiry
- Detect expired session
- Save current work to local storage
- Redirect to login
- Restore work after login

### Browser Compatibility
- Support modern browsers (Chrome, Firefox, Safari, Edge)
- Graceful degradation for older browsers
- Show browser update notice if needed

---

## Accessibility Features

- **Keyboard Navigation:** Full keyboard support for all features
- **Screen Readers:** ARIA labels and semantic HTML
- **Color Contrast:** WCAG AA compliant
- **Focus Indicators:** Clear focus states
- **Alt Text:** Images have descriptive alt text
- **Form Labels:** All inputs properly labeled
- **Error Announcements:** Screen reader friendly errors

---

## Performance Optimizations

- **Code Splitting:** Lazy load routes
- **Image Optimization:** Compressed, responsive images
- **Caching:** Smart caching strategies
- **Debouncing:** Input debouncing for real-time features
- **Loading States:** Skeleton screens and spinners
- **Progressive Enhancement:** Core features work without JS

---

## Security Considerations

- **Authentication:** Secure token-based auth
- **Password Storage:** Bcrypt hashing
- **HTTPS:** All traffic encrypted
- **XSS Prevention:** Input sanitization
- **CSRF Protection:** Token validation
- **Rate Limiting:** API throttling
- **Data Privacy:** GDPR compliant

---

## Future Enhancements

- Interview preparation module
- Salary negotiation tools
- Career path recommendations
- Networking suggestions
- Job application tracker
- Interview scheduler
- Reference management
- Skills gap analysis
- Market insights dashboard
- Video resume builder

---

## Support & Resources

**In-App Help:**
- Tooltips on hover
- Contextual help text
- Tutorial videos
- FAQ sections

**External Support:**
- Knowledge base
- Video tutorials
- Community forum
- Email support
- Live chat (Pro users)

**Documentation:**
- Getting started guide
- Feature walkthroughs
- Best practices
- API documentation (Enterprise)

---

*Last Updated: October 24, 2025*
*Version: 1.0*
*SmartCV Maker AI - Empowering careers with artificial intelligence*
