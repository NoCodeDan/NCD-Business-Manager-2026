import { mutation } from "./_generated/server";

// All new SOPs organized by category/role
const NEW_SOPS = [
    // =========================================
    // 1) FOUNDER / OPERATOR (Leadership)
    // =========================================
    {
        title: 'Weekly Operating Review',
        category: 'Leadership',
        tags: ['weekly', 'review', 'metrics', 'priorities'],
        content: `# Weekly Operating Review

## Purpose
Review business metrics and set focused priorities for the week.

## Inputs
- Revenue metrics
- Pipeline status
- Content output metrics
- In-flight projects
- Current bottlenecks

## Steps
1. **Review Metrics** — Pull and analyze key performance indicators
2. **Pick 1 Focus** — Identify the single most important focus for the week
3. **Set 3 Outcomes** — Define 3 measurable outcomes to achieve
4. **Assign Owners** — Delegate specific responsibilities
5. **Block Calendar Time** — Schedule dedicated time blocks for priority work

## Outputs
- Weekly priorities document
- Calendar schedule blocks`,
    },
    {
        title: 'Offer & Pricing Update',
        category: 'Leadership',
        tags: ['pricing', 'offers', 'sales', 'strategy'],
        content: `# Offer & Pricing Update

## Triggers
- Close rate drops significantly
- Scope creep becomes common
- Lead quality or type changes
- New capability added (tooling/AI)

## Steps
1. **Review Last 10 Sales Convos** — Analyze recent sales calls and emails
2. **Identify Friction** — Find common objections and sticking points
3. **Rewrite Offer Page Bullets** — Update value propositions and benefits
4. **Update Pricing/Tiers** — Adjust pricing structure as needed
5. **Update Proposal Template** — Refresh proposal with new messaging

## Outputs
- Updated offer one-pager
- Updated proposal sections`,
    },
    {
        title: 'Quarterly Plan + Build List',
        category: 'Leadership',
        tags: ['quarterly', 'planning', 'strategy', 'backlog'],
        content: `# Quarterly Plan + Build List

## Purpose
Define strategic themes and prioritized initiatives for the quarter.

## Steps
1. **Define 1–3 Themes** — Identify overarching focuses for the quarter
2. **Pick 3 Core Bets** — Choose 3 initiatives (content series, product, or service)
3. **Define KPI Per Bet** — Set measurable success metrics for each bet
4. **Create Backlog** — Organize tasks into "Now / Next / Later" buckets

## Outputs
- Q-plan document
- Prioritized backlog`,
    },
    {
        title: 'Partnership / Collab Evaluation',
        category: 'Leadership',
        tags: ['partnerships', 'collaborations', 'evaluation'],
        content: `# Partnership / Collab Evaluation

## Purpose
Evaluate and structure partnership opportunities for mutual benefit.

## Steps
1. **Define Audience Overlap** — Analyze shared audience and alignment
2. **Define Mutual Deliverables** — Clarify what each party will provide
3. **Define Timeline + Ownership** — Set deadlines and responsibilities
4. **Define Success Metrics** — Establish how success will be measured
5. **Confirm Promotion Plan** — Agree on marketing and promotion strategy

## Outputs
- Collaboration brief
- Calendar plan`,
    },

    // =========================================
    // 2) PRODUCT STUDIO LEAD
    // =========================================
    {
        title: 'Client Discovery + Requirements Intake (MVP)',
        category: 'Product Studio',
        tags: ['discovery', 'requirements', 'mvp', 'clients'],
        content: `# Client Discovery + Requirements Intake (MVP)

## Purpose
Gather comprehensive requirements to scope an MVP build.

## Steps
1. **Problem Framing** — Clearly define the problem being solved
2. **User + Jobs-to-be-Done** — Identify target users and their core tasks
3. **Must-Have Flows** — Define critical user journeys
4. **Data Objects** — Identify key data entities and relationships
5. **Success Metrics** — Define how success will be measured
6. **Constraints** — Document timeline, budget, and tool limitations

## Outputs
- PRD-lite (Product Requirements Document)
- Scope document`,
    },
    {
        title: 'MVP Build Plan (No-code + AI)',
        category: 'Product Studio',
        tags: ['build', 'mvp', 'no-code', 'ai', 'planning'],
        content: `# MVP Build Plan (No-code + AI)

## Purpose
Create a structured plan for building an MVP using no-code and AI tools.

## Steps
1. **Map Screens/Flows** — Diagram all screens and user flows
2. **Define Integrations** — List required third-party connections
3. **Define Database/Schema** — Design data structure
4. **Identify "Risky" Parts** — Flag technically uncertain areas
5. **Spike Risky Parts First** — Prototype risky elements to validate
6. **Build Milestones** — Break build into deliverable chunks

## Outputs
- Build plan with milestones
- Risk register`,
    },
    {
        title: 'QA + Launch Checklist',
        category: 'Product Studio',
        tags: ['qa', 'testing', 'launch', 'checklist'],
        content: `# QA + Launch Checklist

## Purpose
Ensure product quality and readiness before launch.

## Steps
1. **Functional Testing** — Verify all features work as expected
2. **Edge Cases** — Test boundary conditions and unusual inputs
3. **Mobile + Web Checks** — Test across devices and browsers
4. **Performance Pass** — Check load times and responsiveness
5. **Analytics Events** — Verify tracking is properly configured
6. **Error Handling** — Ensure graceful failure states
7. **Deploy** — Push to production environment
8. **Smoke Test** — Quick verification on live environment

## Outputs
- Launch-ready checklist
- Release notes`,
    },
    {
        title: 'Post-Launch Stabilization (First 7 Days)',
        category: 'Product Studio',
        tags: ['post-launch', 'stabilization', 'bugs', 'iteration'],
        content: `# Post-Launch Stabilization (First 7 Days)

## Purpose
Monitor and stabilize a new launch during the critical first week.

## Steps
1. **Monitor Errors** — Track error rates and logs daily
2. **Gather Feedback** — Collect user feedback via support channels
3. **Fix Top 5 Issues** — Prioritize and resolve critical bugs
4. **Ship Patch** — Deploy fixes quickly
5. **Document Learnings** — Record what worked and what didn't
6. **Propose Next Iteration** — Plan improvements for v2

## Outputs
- Patch plan
- Iteration roadmap`,
    },

    // =========================================
    // 3) AUTOMATION / SYSTEMS BUILDER
    // =========================================
    {
        title: 'Automation Opportunity Audit',
        category: 'Automation',
        tags: ['automation', 'audit', 'efficiency', 'roi'],
        content: `# Automation Opportunity Audit

## Purpose
Identify and prioritize automation opportunities across the business.

## Steps
1. **List Recurring Tasks** — Inventory all repetitive work
2. **Time Estimate Each** — Calculate time spent on each task
3. **Identify Data Sources** — Map where data lives
4. **Define Trigger/Action** — Specify what starts and ends each automation
5. **Define Failure Points** — Identify where things could break
6. **Choose Tool** — Select Make, Zapier, Coda, or custom solution

## Outputs
- Automation backlog ranked by ROI`,
    },
    {
        title: 'Build + Test Automation',
        category: 'Automation',
        tags: ['automation', 'testing', 'workflow', 'documentation'],
        content: `# Build + Test Automation

## Purpose
Build, test, and document a production-ready automation.

## Steps
1. **Build v1** — Create initial automation flow
2. **Test with Sample Data** — Run with realistic test data
3. **Add Logging** — Implement visibility into execution
4. **Add Retries/Fallbacks** — Handle failure scenarios gracefully
5. **Document Steps** — Write clear documentation
6. **Handoff Instructions** — Prepare for team handoff

## Outputs
- Automation documentation
- Test cases`,
    },
    {
        title: 'AI Content Ops Automation',
        category: 'Automation',
        tags: ['ai', 'content', 'automation', 'pipeline'],
        content: `# AI Content Ops Automation

## Purpose
Set up an automated AI-powered content generation pipeline.

## Steps
1. **Define Inputs** — Specify ICP, content pillar, and format
2. **Prompt Template** — Create reusable prompt structure
3. **Generate Variants** — Produce multiple content versions
4. **Add Quality Checks** — Implement review gates
5. **Route to Notion "Review"** — Send to review queue
6. **Publish Queue** — Schedule for publication

## Outputs
- Prompt pack
- Content pipeline`,
    },

    // =========================================
    // 4) CONTENT STRATEGIST
    // =========================================
    {
        title: 'Monthly Content Strategy',
        category: 'Content Strategy',
        tags: ['content', 'strategy', 'planning', 'monthly'],
        content: `# Monthly Content Strategy

## Purpose
Plan content themes, formats, and hooks for the month.

## Steps
1. **Pick 3 Pillars** — Define core content themes
2. **Pick 1 Flagship Series** — Choose a signature content series
3. **Define Weekly Cadence** — Set posting schedule by platform
4. **Define 10 Hooks Per Pillar** — Create attention-grabbing openers
5. **Pre-plan CTAs** — Prepare calls-to-action for each piece

## Outputs
- Monthly content plan
- Hook bank`,
    },
    {
        title: 'Content Research (Trends + Competitors)',
        category: 'Content Strategy',
        tags: ['research', 'trends', 'competitors', 'content'],
        content: `# Content Research (Trends + Competitors)

## Purpose
Stay current on trends and learn from successful creators.

## Steps
1. **Scan 10 Creators** — Review top performers in your niche
2. **Log Formats/Hooks** — Document what's working
3. **Identify Repeatable Patterns** — Find reusable frameworks
4. **Extract Angles** — Pull unique perspectives
5. **Map to Your Offers** — Connect insights to your products/services

## Outputs
- Research notes
- "Steal-this-format" list`,
    },
    {
        title: 'Content Brief (Single Asset)',
        category: 'Content Strategy',
        tags: ['brief', 'content', 'planning', 'single-asset'],
        content: `# Content Brief (Single Asset)

## Purpose
Create a comprehensive brief for a single piece of content.

## Steps
1. **Goal** — Define the purpose of the content
2. **Target Viewer** — Identify the ideal audience
3. **Promise** — State what the viewer will get
4. **Outline** — Structure the content flow
5. **Hook Options** — Write 3-5 opening hooks
6. **Examples** — Reference inspiration pieces
7. **CTA** — Define the call-to-action
8. **Repurpose Notes** — Plan for derivative content

## Outputs
- 1-page content brief`,
    },

    // =========================================
    // 5) ON-CAMERA EDUCATOR / COURSE CREATOR
    // =========================================
    {
        title: 'Lesson Design (Workshop or Course Module)',
        category: 'Education',
        tags: ['lesson', 'course', 'education', 'design'],
        content: `# Lesson Design (Workshop or Course Module)

## Purpose
Design an effective educational lesson or workshop.

## Steps
1. **Learning Objective** — Define what learners will be able to do
2. **Prerequisite Check** — Identify required prior knowledge
3. **Demo Plan** — Plan hands-on demonstrations
4. **Checkpoints** — Insert knowledge verification moments
5. **Common Mistakes** — Anticipate and address pitfalls
6. **Recap + Assignment** — Summarize and assign practice

## Outputs
- Lesson outline
- Exercise`,
    },
    {
        title: 'Tutorial Recording Workflow',
        category: 'Education',
        tags: ['tutorial', 'recording', 'video', 'workflow'],
        content: `# Tutorial Recording Workflow

## Purpose
Efficiently record high-quality tutorial videos.

## Steps
1. **Prep Project Files** — Prepare all demo materials
2. **Script Bullets** — Write key talking points
3. **Record A-roll** — Capture face-to-camera footage
4. **Record Screen** — Capture screen demonstrations
5. **Live Demo** — Walk through the process
6. **Mark Retakes** — Flag sections needing re-recording
7. **Export** — Render final files

## Outputs
- Raw footage
- Markers file`,
    },
    {
        title: 'Course Asset Packaging',
        category: 'Education',
        tags: ['course', 'assets', 'packaging', 'delivery'],
        content: `# Course Asset Packaging

## Purpose
Organize and package course materials for delivery.

## Steps
1. **Organize Files** — Structure folder hierarchy
2. **Name Conventions** — Apply consistent naming
3. **Upload** — Push to hosting platform
4. **Teacher Notes** — Add instructor guidance
5. **Links/Resources** — Compile supplementary materials
6. **Final QA** — Verify all deliverables work

## Outputs
- Course bundle ready to ship`,
    },

    // =========================================
    // 6) VIDEO PRODUCER / EDITOR
    // =========================================
    {
        title: 'Edit Long-Form (YouTube)',
        category: 'Video Production',
        tags: ['editing', 'youtube', 'long-form', 'video'],
        content: `# Edit Long-Form (YouTube)

## Purpose
Edit a polished long-form video for YouTube.

## Steps
1. **Ingest + Organize** — Import and label all footage
2. **Rough Cut** — Assemble the story structure
3. **Tighten Pacing** — Remove dead air and tighten timing
4. **Add Callouts** — Insert graphics and emphasis
5. **Music/SFX Pass** — Add background audio and effects
6. **Captions** — Generate and sync subtitles
7. **Final Polish** — Color, audio levels, final review
8. **Export Presets** — Render with optimized settings

## Outputs
- Final video
- Captions file
- Thumbnail notes`,
    },
    {
        title: 'Repurpose Long-Form → Shorts',
        category: 'Video Production',
        tags: ['shorts', 'repurpose', 'video', 'clips'],
        content: `# Repurpose Long-Form → Shorts

## Purpose
Extract vertical short-form clips from long-form content.

## Steps
1. **Identify 8 Moments** — Find the best clips for shorts
2. **Cut to 9:16** — Reframe for vertical format
3. **Add Subtitles** — Add dynamic captions
4. **Add Hook Text** — Create attention-grabbing text overlays
5. **Add CTA End Card** — Include call-to-action
6. **Export Batch** — Render all shorts

## Outputs
- 8 shorts
- Upload-ready titles`,
    },
    {
        title: 'Thumbnail + Title Iteration',
        category: 'Video Production',
        tags: ['thumbnail', 'title', 'youtube', 'optimization'],
        content: `# Thumbnail + Title Iteration

## Purpose
Create compelling thumbnails and titles for maximum CTR.

## Steps
1. **3 Title Angles** — Write curiosity, benefit, and controversy versions
2. **2 Thumbnail Concepts Each** — Design 2 options per title angle
3. **Pick Winners** — Select the strongest combinations
4. **Test in Community/Polls** — Gather feedback when needed

## Outputs
- Final title
- Final thumbnail`,
    },

    // =========================================
    // 7) UX DESIGNER
    // =========================================
    {
        title: 'UX Audit (Website/App)',
        category: 'UX Design',
        tags: ['ux', 'audit', 'usability', 'accessibility'],
        content: `# UX Audit (Website/App)

## Purpose
Comprehensive UX review to identify improvement opportunities.

## Steps
1. **Define Goal** — Clarify audit objectives
2. **Review IA** — Analyze information architecture
3. **Heuristic Pass** — Apply usability heuristics
4. **Accessibility Pass** — Check WCAG compliance
5. **Mobile Pass** — Test responsive behavior
6. **Prioritize Issues** — Rank by impact and effort
7. **Recommendations** — Propose solutions

## Outputs
- Graded audit report
- Prioritized fixes list`,
    },
    {
        title: 'Figma Prototype for MVP',
        category: 'UX Design',
        tags: ['figma', 'prototype', 'mvp', 'design'],
        content: `# Figma Prototype for MVP

## Purpose
Create an interactive prototype for MVP validation.

## Steps
1. **Define Flows** — Map user journeys
2. **Components** — Build reusable UI elements
3. **Layout Pass** — Create screen layouts
4. **Micro-interactions** — Add transitions and feedback
5. **Annotate Handoff** — Add developer notes
6. **Export Assets** — Prepare images and icons

## Outputs
- Clickable prototype
- Spec notes`,
    },
    {
        title: 'Design System Starter Kit',
        category: 'UX Design',
        tags: ['design-system', 'components', 'tokens'],
        content: `# Design System Starter Kit

## Purpose
Create foundational design system components.

## Steps
1. **Type Scale** — Define typography hierarchy
2. **Spacing** — Set spacing units
3. **Buttons/Inputs** — Design form elements
4. **Color Tokens** — Define color palette
5. **Icons** — Curate icon set
6. **Patterns** — Design empty states, loading, errors

## Outputs
- Mini design system`,
    },

    // =========================================
    // 8) MARKETING / GROWTH
    // =========================================
    {
        title: 'Lead Magnet → Funnel',
        category: 'Marketing',
        tags: ['lead-magnet', 'funnel', 'conversion', 'growth'],
        content: `# Lead Magnet → Funnel

## Purpose
Build an end-to-end lead generation funnel.

## Steps
1. **Define Promise** — Clarify the value proposition
2. **Create Asset** — Build the lead magnet (PDF, video, etc.)
3. **Landing Page Copy** — Write conversion-focused copy
4. **Email Sequence** — Create nurture emails
5. **Distribution Plan** — Plan promotion channels
6. **Track Conversions** — Set up analytics

## Outputs
- Live funnel
- Metrics dashboard`,
    },
    {
        title: 'Sales Pipeline (Service Leads)',
        category: 'Marketing',
        tags: ['sales', 'pipeline', 'leads', 'crm'],
        content: `# Sales Pipeline (Service Leads)

## Purpose
Structure a consistent sales process from lead to client.

## Steps
1. **Capture Lead** — Record new inquiries
2. **Qualify** — Assess fit and budget
3. **Discovery** — Conduct needs assessment
4. **Proposal** — Send customized proposal
5. **Follow-up Cadence** — Systematic check-ins
6. **Close** — Finalize agreement
7. **Onboarding Kickoff** — Begin client onboarding

## Outputs
- Pipeline stages
- Follow-up scripts`,
    },
    {
        title: 'Case Study Creation',
        category: 'Marketing',
        tags: ['case-study', 'portfolio', 'social-proof'],
        content: `# Case Study Creation

## Purpose
Document client success stories for marketing.

## Steps
1. **Collect Assets** — Gather screenshots, metrics, quotes
2. **Define Before/After** — Show transformation
3. **Process Steps** — Document what was done
4. **Results/Metrics** — Quantify outcomes
5. **Lessons** — Share insights learned
6. **CTA** — Include call-to-action

## Outputs
- Publishable case study page/post`,
    },

    // =========================================
    // 9) COMMUNITY BUILDER
    // =========================================
    {
        title: 'Community Weekly Rhythm',
        category: 'Community',
        tags: ['community', 'engagement', 'weekly', 'rhythm'],
        content: `# Community Weekly Rhythm

## Purpose
Maintain consistent community engagement cadence.

## Steps
1. **Weekly Prompt** — Post discussion starter
2. **Office Hours/Live Build** — Host live session
3. **Member Spotlight** — Feature a community member
4. **Resource Drop** — Share valuable content
5. **Wins Thread** — Celebrate member successes

## Outputs
- Weekly schedule
- Post templates`,
    },
    {
        title: 'Event Workflow (Workshop/Webinar)',
        category: 'Community',
        tags: ['events', 'workshop', 'webinar', 'workflow'],
        content: `# Event Workflow (Workshop/Webinar)

## Purpose
Plan and execute community events end-to-end.

## Steps
1. **Topic Selection** — Choose relevant topic
2. **Landing Copy** — Write event description
3. **Promo Plan** — Schedule promotional posts
4. **Run of Show** — Create detailed agenda
5. **Recording** — Capture the session
6. **Recap Post** — Share highlights
7. **Follow-up Offer** — Present next steps

## Outputs
- Event kit
- Replay package`,
    },

    // =========================================
    // 10) CLIENT SUCCESS / DELIVERY OPS
    // =========================================
    {
        title: 'Client Onboarding',
        category: 'Client Success',
        tags: ['onboarding', 'clients', 'kickoff'],
        content: `# Client Onboarding

## Purpose
Successfully onboard new clients for project success.

## Steps
1. **Kickoff Call** — Introduce team and align on goals
2. **Access Checklist** — Collect all necessary credentials/access
3. **Goals + KPI** — Define success metrics
4. **Comms Cadence** — Agree on communication rhythm
5. **Project Board Setup** — Create shared workspace
6. **First Milestone Confirmation** — Align on initial deliverable

## Outputs
- Onboarding document
- Project timeline`,
    },
    {
        title: 'Weekly Client Update',
        category: 'Client Success',
        tags: ['updates', 'clients', 'communication', 'weekly'],
        content: `# Weekly Client Update

## Purpose
Keep clients informed with consistent status updates.

## Steps
1. **Progress Summary** — Recap what was accomplished
2. **What Shipped** — List completed deliverables
3. **Blockers** — Flag any issues or delays
4. **Next Steps** — Preview upcoming work
5. **Questions** — Surface any open questions
6. **Link to Artifacts** — Reference relevant documents

## Outputs
- Update message template`,
    },
    {
        title: 'Offboarding + Referral Ask',
        category: 'Client Success',
        tags: ['offboarding', 'referrals', 'handoff'],
        content: `# Offboarding + Referral Ask

## Purpose
Gracefully conclude client engagements and generate referrals.

## Steps
1. **Final Handoff** — Transfer all deliverables
2. **Documentation** — Provide complete documentation
3. **Training Video** — Record walkthrough if needed
4. **Testimonial Prompts** — Request feedback
5. **Referral Ask** — Ask for referrals
6. **Next Offer** — Present ongoing support options

## Outputs
- Offboarding pack
- Testimonial`,
    },
];

// Mutation to add all new SOPs
export const addAllSOPs = mutation({
    args: {},
    handler: async (ctx) => {
        const now = new Date().toISOString();
        let added = 0;

        for (const sop of NEW_SOPS) {
            await ctx.db.insert("sops", {
                title: sop.title,
                content: sop.content,
                category: sop.category,
                tags: sop.tags,
                createdAt: now,
                updatedAt: now,
            });
            added++;
        }

        return {
            success: true,
            added,
            message: `Successfully added ${added} SOPs across all categories.`,
        };
    },
});
