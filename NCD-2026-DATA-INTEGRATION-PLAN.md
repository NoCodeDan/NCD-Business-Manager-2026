# NCD 2026 Data Integration Plan

## Executive Summary
This plan outlines how to integrate the comprehensive 2026 goal framework from the NCD 2026 PDF into the existing Business Manager app while preserving all current data (expenses, initiatives, SOPs, projects, and agent conversations).

---

## Current State Analysis

### Existing Data Models
1. **Initiatives** - High-level business initiatives with KPIs tracked quarterly
2. **Projects** - Tactical projects with tasks and deadlines
3. **Expenses** - Recurring business expenses
4. **SOPs** - Standard operating procedures
5. **Conversations/Messages** - Agent chat history
6. **Agent Logs** - Action tracking

### Current Data That Will Be Preserved
- 10 expenses (tools and subscriptions)
- 4 initiatives (Revenue, Product Launch, Operations, Brand Presence)
- 2 SOPs (Client Onboarding, Content Publishing)
- 1 project (Website Redesign)
- All existing conversations and agent logs

---

## New Data Models Required

### 1. **Goals** Table
Stores the overarching goal framework for 2026.

**Schema:**
```typescript
goals: defineTable({
  type: v.union(
    v.literal("north-star"),      // The ultimate 2026 vision
    v.literal("business"),         // Business & Revenue goals
    v.literal("tangible-ideas"),   // Studio + Labs goals
    v.literal("no-code-effect"),   // Education + Community goals
    v.literal("personal-brand"),   // Personal branding goals
    v.literal("product-ip"),       // Product & IP assets
    v.literal("systems-ops")       // Operations & Systems
  ),
  title: v.string(),
  description: v.string(),
  category: v.string(),           // For grouping related goals
  targets: v.array(v.object({
    id: v.string(),
    metric: v.string(),           // e.g., "Annual Revenue"
    target: v.string(),           // e.g., "$300K-$500K"
    unit: v.string(),             // e.g., "$", "subscribers", "%"
    measureType: v.union(
      v.literal("range"),         // e.g., $300K-$500K
      v.literal("minimum"),       // e.g., ≥60%
      v.literal("exact"),         // e.g., 12 MVPs
      v.literal("milestone")      // e.g., "Launch flagship course"
    ),
    priority: v.union(
      v.literal("critical"),
      v.literal("high"),
      v.literal("medium"),
      v.literal("low")
    ),
    currentValue: v.optional(v.string()),  // Track actual progress
    notes: v.optional(v.string()),
  })),
  status: v.union(
    v.literal("on-track"),
    v.literal("at-risk"),
    v.literal("behind"),
    v.literal("completed"),
    v.literal("not-started")
  ),
  color: v.string(),
  order: v.number(),              // For display ordering
  createdAt: v.string(),
  updatedAt: v.string(),
})
```

**Data to Seed:**
- North Star goal
- Business & Revenue goals (revenue mix, structural goals)
- Tangible Ideas goals (output, labs, positioning)
- No-Code Effect goals (audience, education, community)
- Personal Brand goals (content output, positioning)
- Product & IP goals (assets to create, leverage)
- Systems & Operations goals (operational targets, sustainability)

---

### 2. **Quarterly Plans** Table
Stores Q1-Q4 execution plans with specific actions and targets.

**Schema:**
```typescript
quarterlyPlans: defineTable({
  year: v.number(),               // 2026
  quarter: v.union(
    v.literal("Q1"),
    v.literal("Q2"),
    v.literal("Q3"),
    v.literal("Q4")
  ),
  theme: v.string(),              // e.g., "Foundation & Positioning"
  primaryObjective: v.string(),   // Main goal for the quarter
  focusAreas: v.array(v.string()),
  keyActions: v.array(v.object({
    id: v.string(),
    action: v.string(),
    category: v.string(),         // e.g., "Launch", "Publish", "Formalize"
    completed: v.boolean(),
    completedDate: v.optional(v.string()),
    notes: v.optional(v.string()),
  })),
  shippingTargets: v.object({
    mvps: v.object({
      target: v.number(),
      actual: v.optional(v.number()),
    }),
    internalProducts: v.object({
      target: v.number(),
      actual: v.optional(v.number()),
    }),
    buildBreakdowns: v.object({
      target: v.number(),
      actual: v.optional(v.number()),
    }),
  }),
  revenueTargets: v.object({
    min: v.number(),
    max: v.number(),
    actual: v.optional(v.number()),
  }),
  audienceTargets: v.array(v.object({
    id: v.string(),
    metric: v.string(),           // e.g., "Email Subscribers"
    target: v.number(),
    actual: v.optional(v.number()),
  })),
  contentTargets: v.array(v.object({
    id: v.string(),
    type: v.string(),             // e.g., "YouTube Videos", "Blog Posts"
    target: v.number(),
    actual: v.optional(v.number()),
  })),
  status: v.union(
    v.literal("upcoming"),
    v.literal("in-progress"),
    v.literal("completed"),
    v.literal("reviewed")
  ),
  startDate: v.string(),
  endDate: v.string(),
  createdAt: v.string(),
  updatedAt: v.string(),
})
.index("by_year_quarter", ["year", "quarter"])
```

**Data to Seed:**
- Q1: Foundation & Positioning
- Q2: Momentum & Growth
- Q3: Scale & Optimize
- Q4: Compound & Launch

---

### 3. **Content Plans** Table
Stores content strategy, pillars, and campaigns.

**Schema:**
```typescript
contentPlans: defineTable({
  name: v.string(),
  type: v.union(
    v.literal("long-form"),       // YouTube tutorials
    v.literal("short-form"),      // Shorts/clips
    v.literal("series"),          // Ongoing series
    v.literal("campaign"),        // Specific campaigns
    v.literal("archetype")        // Content archetype/pillar
  ),
  business: v.union(
    v.literal("tangible-ideas"),
    v.literal("no-code-effect"),
    v.literal("adalo"),
    v.literal("personal-brand")
  ),
  description: v.string(),
  status: v.union(
    v.literal("planned"),
    v.literal("in-progress"),
    v.literal("active"),
    v.literal("completed"),
    v.literal("paused")
  ),
  schedule: v.optional(v.object({
    frequency: v.string(),        // e.g., "bi-weekly", "daily"
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
  })),
  targets: v.optional(v.object({
    count: v.number(),            // e.g., 12 tutorials
    cadence: v.string(),          // e.g., "every two weeks"
  })),
  assets: v.array(v.object({
    id: v.string(),
    title: v.string(),
    status: v.union(
      v.literal("planned"),
      v.literal("in-production"),
      v.literal("completed"),
      v.literal("published")
    ),
    publishDate: v.optional(v.string()),
    url: v.optional(v.string()),
    notes: v.optional(v.string()),
  })),
  tags: v.array(v.string()),
  color: v.string(),
  order: v.number(),
  createdAt: v.string(),
  updatedAt: v.string(),
})
.index("by_business", ["business"])
.index("by_type", ["type"])
.index("by_status", ["status"])
```

**Data to Seed:**
- Adalo Long Form Tutorials (12 app clones)
- Adalo Short Form Blitz (30-day campaign)
- Content Archetypes (Expert, Artist, Wild Card, World Builder)
- Content Pillars
- Weekly changes/updates content

---

### 4. **Operating Rules** Table
Stores the execution framework and decision filters.

**Schema:**
```typescript
operatingRules: defineTable({
  type: v.union(
    v.literal("weekly-execution"),    // Weekly must-dos
    v.literal("priority-stack"),      // Ordered priorities
    v.literal("decision-filter"),     // Product decision criteria
    v.literal("kill-criteria"),       // When to stop/pause
    v.literal("review-process")       // Monthly review questions
  ),
  title: v.string(),
  description: v.string(),
  rules: v.array(v.object({
    id: v.string(),
    rule: v.string(),
    order: v.number(),
    isRequired: v.boolean(),          // For filters: must pass X of Y
    examples: v.optional(v.array(v.string())),
  })),
  isActive: v.boolean(),
  order: v.number(),
  createdAt: v.string(),
  updatedAt: v.string(),
})
.index("by_type", ["type"])
```

**Data to Seed:**
- Weekly Execution Rules (ship/document/distribute)
- Priority Stack (shipping > teaching > content > client work > new ideas)
- Product Decision Filter (4 questions)
- Kill Criteria (when to stop)
- Monthly Review Process

---

### 5. **Target ICP** Table (Optional - could be part of goals or separate)
Stores ideal customer profile information.

**Schema:**
```typescript
targetICP: defineTable({
  business: v.union(
    v.literal("tangible-ideas"),
    v.literal("no-code-effect"),
    v.literal("adalo")
  ),
  name: v.string(),
  description: v.string(),
  characteristics: v.array(v.string()),
  painPoints: v.array(v.string()),
  messaging: v.array(v.object({
    id: v.string(),
    message: v.string(),
    channel: v.string(),
  })),
  order: v.number(),
  isActive: v.boolean(),
  createdAt: v.string(),
  updatedAt: v.string(),
})
```

**Data to Seed:**
- Intentional Users / Data Intentional Users
- Frustrated vibe coding users

---

## Data Migration Strategy

### Phase 1: Schema Extension (Non-Breaking)
1. **Add new tables** to schema.ts
2. **No changes** to existing tables
3. Deploy schema changes to Convex

### Phase 2: Create Seed Files
1. **seed2026Goals.ts** - Seed the 7 goal categories with targets
2. **seed2026Quarters.ts** - Seed Q1-Q4 execution plans
3. **seed2026Content.ts** - Seed content plans and assets
4. **seed2026Rules.ts** - Seed operating rules and frameworks
5. **seed2026ICP.ts** - Seed target customer profiles

### Phase 3: Update Existing Data (Enhancement Only)
1. **Tag existing initiatives** with goal relationships
   - "Increase Revenue" → links to Business Goals
   - "Launch Product Suite" → links to Tangible Ideas Goals
   - "Build Brand Presence" → links to Personal Brand Goals
   - "Streamline Operations" → links to Systems & Operations Goals

2. **Enhance initiatives** with 2026 context
   - Add year field (2026)
   - Add goalId reference field (optional)
   - Add quarterlyPlanId reference (optional)
   - Keep all existing KPI data

3. **Add metadata** to existing projects
   - Link projects to quarterly plans where relevant
   - Tag with business area (Tangible Ideas, No-Code Effect, etc.)

### Phase 4: New UI Components
Create views to display the new data structures:
1. **2026 Goals Dashboard** - North Star and all goal categories
2. **Quarterly Execution View** - Q1-Q4 plans with progress tracking
3. **Content Calendar** - All content plans, series, and campaigns
4. **Operating Playbook** - Display weekly rules, decision filters, etc.
5. **ICP Reference** - Quick reference for target customers

---

## TypeScript Type Updates

### New Types to Add to lib/types.ts

```typescript
// Goals
export type GoalType = 
  | 'north-star'
  | 'business'
  | 'tangible-ideas'
  | 'no-code-effect'
  | 'personal-brand'
  | 'product-ip'
  | 'systems-ops';

export type MeasureType = 'range' | 'minimum' | 'exact' | 'milestone';

export interface GoalTarget {
  id: string;
  metric: string;
  target: string;
  unit: string;
  measureType: MeasureType;
  priority: 'critical' | 'high' | 'medium' | 'low';
  currentValue?: string;
  notes?: string;
}

export interface Goal {
  id: string;
  type: GoalType;
  title: string;
  description: string;
  category: string;
  targets: GoalTarget[];
  status: 'on-track' | 'at-risk' | 'behind' | 'completed' | 'not-started';
  color: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

// Quarterly Plans
export type Quarter = 'Q1' | 'Q2' | 'Q3' | 'Q4';

export interface QuarterlyAction {
  id: string;
  action: string;
  category: string;
  completed: boolean;
  completedDate?: string;
  notes?: string;
}

export interface QuarterlyPlan {
  id: string;
  year: number;
  quarter: Quarter;
  theme: string;
  primaryObjective: string;
  focusAreas: string[];
  keyActions: QuarterlyAction[];
  shippingTargets: {
    mvps: { target: number; actual?: number };
    internalProducts: { target: number; actual?: number };
    buildBreakdowns: { target: number; actual?: number };
  };
  revenueTargets: {
    min: number;
    max: number;
    actual?: number;
  };
  audienceTargets: {
    id: string;
    metric: string;
    target: number;
    actual?: number;
  }[];
  contentTargets: {
    id: string;
    type: string;
    target: number;
    actual?: number;
  }[];
  status: 'upcoming' | 'in-progress' | 'completed' | 'reviewed';
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

// Content Plans
export type ContentType = 'long-form' | 'short-form' | 'series' | 'campaign' | 'archetype';
export type BusinessArea = 'tangible-ideas' | 'no-code-effect' | 'adalo' | 'personal-brand';

export interface ContentAsset {
  id: string;
  title: string;
  status: 'planned' | 'in-production' | 'completed' | 'published';
  publishDate?: string;
  url?: string;
  notes?: string;
}

export interface ContentPlan {
  id: string;
  name: string;
  type: ContentType;
  business: BusinessArea;
  description: string;
  status: 'planned' | 'in-progress' | 'active' | 'completed' | 'paused';
  schedule?: {
    frequency: string;
    startDate?: string;
    endDate?: string;
  };
  targets?: {
    count: number;
    cadence: string;
  };
  assets: ContentAsset[];
  tags: string[];
  color: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

// Operating Rules
export type RuleType = 
  | 'weekly-execution'
  | 'priority-stack'
  | 'decision-filter'
  | 'kill-criteria'
  | 'review-process';

export interface OperatingRule {
  id: string;
  rule: string;
  order: number;
  isRequired: boolean;
  examples?: string[];
}

export interface OperatingRules {
  id: string;
  type: RuleType;
  title: string;
  description: string;
  rules: OperatingRule[];
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

// Target ICP
export interface ICPMessaging {
  id: string;
  message: string;
  channel: string;
}

export interface TargetICP {
  id: string;
  business: BusinessArea;
  name: string;
  description: string;
  characteristics: string[];
  painPoints: string[];
  messaging: ICPMessaging[];
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

---

## Enhanced Initiative Schema (Optional)

Add optional reference fields to link initiatives to the new 2026 framework:

```typescript
initiatives: defineTable({
  // ... existing fields ...
  year: v.optional(v.number()),                    // e.g., 2026
  goalId: v.optional(v.id("goals")),              // Link to parent goal
  quarterlyPlanId: v.optional(v.id("quarterlyPlans")), // Link to quarter
  businessArea: v.optional(v.union(
    v.literal("tangible-ideas"),
    v.literal("no-code-effect"),
    v.literal("adalo"),
    v.literal("personal-brand")
  )),
})
```

---

## Data Mapping: Existing → New Structure

### Current Initiatives → 2026 Goals

| Current Initiative | Maps To | 2026 Goal Category | Notes |
|-------------------|---------|-------------------|-------|
| Increase Revenue | → | Business & Revenue | Update KPIs to match $300K-$500K target |
| Launch Product Suite | → | Tangible Ideas | Align with 3-5 internal products goal |
| Streamline Operations | → | Systems & Operations | Match operational targets |
| Build Brand Presence | → | Personal Brand + No-Code Effect | Split into two related goals |

### New Goals Not Currently Tracked
- North Star (overarching vision)
- Product & IP Goals (reusable assets, templates, frameworks)
- Detailed content strategy and pillars
- Operating rules and decision frameworks
- Target ICP definitions

---

## Implementation Checklist

### ☐ Phase 1: Schema Updates (1-2 hours)
- [ ] Update `convex/schema.ts` with new tables
- [ ] Update `lib/types.ts` with new TypeScript types
- [ ] Deploy schema changes to Convex
- [ ] Verify no breaking changes to existing queries

### ☐ Phase 2: Create Seed Files (3-4 hours)
- [ ] Create `convex/seed2026Goals.ts`
- [ ] Create `convex/seed2026Quarters.ts`
- [ ] Create `convex/seed2026Content.ts`
- [ ] Create `convex/seed2026Rules.ts`
- [ ] Create `convex/seed2026ICP.ts`
- [ ] Create master seed orchestrator `convex/seed2026Master.ts`

### ☐ Phase 3: Create Convex Functions (2-3 hours)
- [ ] Create CRUD operations for goals
- [ ] Create CRUD operations for quarterly plans
- [ ] Create CRUD operations for content plans
- [ ] Create CRUD operations for operating rules
- [ ] Create CRUD operations for target ICP
- [ ] Create query functions for dashboard views

### ☐ Phase 4: Create React Hooks (1-2 hours)
- [ ] Create `hooks/use-goals.ts`
- [ ] Create `hooks/use-quarterly-plans.ts`
- [ ] Create `hooks/use-content-plans.ts`
- [ ] Create `hooks/use-operating-rules.ts`
- [ ] Create `hooks/use-target-icp.ts`

### ☐ Phase 5: Enhance Existing Data (1 hour)
- [ ] Add optional fields to initiatives schema
- [ ] Create migration script to link existing initiatives to goals
- [ ] Update existing initiative seed data with 2026 context
- [ ] Test that existing UI still works

### ☐ Phase 6: Create New UI Components (4-6 hours)
- [ ] Create Goals Dashboard page (`app/goals/page.tsx`)
- [ ] Create Quarterly Plans page (`app/quarters/page.tsx`)
- [ ] Create Content Calendar page (`app/content/calendar/page.tsx`)
- [ ] Create Operating Playbook page (`app/playbook/page.tsx`)
- [ ] Create ICP Reference page (`app/icp/page.tsx`)
- [ ] Update navigation sidebar with new pages

### ☐ Phase 7: Testing & Validation (1-2 hours)
- [ ] Verify all existing data is intact
- [ ] Verify new data seeds correctly
- [ ] Test all CRUD operations
- [ ] Test agent can interact with new data models
- [ ] End-to-end test of all features

### ☐ Phase 8: Documentation (1 hour)
- [ ] Update README with new features
- [ ] Document new data models
- [ ] Create user guide for 2026 planning features

---

## Risk Mitigation

### No Data Loss
- All new tables are additive only
- Existing tables unchanged (except optional field additions)
- Seed functions check for existing data before inserting
- All changes are non-destructive

### Backward Compatibility
- Existing initiatives, projects, expenses, SOPs continue to work
- Optional fields won't break existing queries
- Agent can continue operating on existing data
- All current UI components remain functional

### Rollback Plan
If issues arise:
1. New tables can be dropped without affecting existing data
2. Optional fields can be removed from initiatives
3. New pages can be hidden from navigation
4. Seed data can be deleted and re-run

---

## Success Criteria

✅ **Data Integrity**
- All existing data preserved and functional
- No broken queries or UI components
- Agent continues to work with existing entities

✅ **New Features Working**
- 2026 goals visible and editable
- Quarterly plans trackable with progress
- Content plans manageable with status updates
- Operating rules accessible as reference
- ICP information available for strategy

✅ **Integration Complete**
- Existing initiatives linked to 2026 goals
- Dashboard shows unified view of old + new data
- Agent can interact with new data models
- Navigation includes all new pages

---

## Timeline Estimate

**Total Time: 14-21 hours**
- Phase 1: 1-2 hours
- Phase 2: 3-4 hours
- Phase 3: 2-3 hours
- Phase 4: 1-2 hours
- Phase 5: 1 hour
- Phase 6: 4-6 hours
- Phase 7: 1-2 hours
- Phase 8: 1 hour

**Recommended Approach:**
- Day 1: Complete Phases 1-3 (schema, seeds, backend)
- Day 2: Complete Phases 4-5 (hooks, data enhancement)
- Day 3: Complete Phases 6-8 (UI, testing, docs)

---

## Next Steps

1. **Review this plan** - Confirm approach and priorities
2. **Approve schema changes** - Ensure new tables meet requirements
3. **Begin Phase 1** - Update schema and deploy
4. **Iterate through phases** - Complete one phase at a time with testing

Would you like me to:
1. Begin implementing Phase 1 (schema updates)?
2. Create a specific seed file first to see the data structure?
3. Modify any part of this plan?
4. Start with a different phase?
