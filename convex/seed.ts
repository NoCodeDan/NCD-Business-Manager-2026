import { mutation } from "./_generated/server";

// Seed data for expenses
const DEFAULT_EXPENSES = [
    {
        name: 'Google Ultra',
        amount: 250,
        billingCycle: 'monthly' as const,
        category: 'Tools',
        renewalDate: '2026-02-06T00:00:00.000Z',
    },
    {
        name: 'ChatGPT',
        amount: 20,
        billingCycle: 'monthly' as const,
        category: 'Tools',
        renewalDate: '2026-02-06T00:00:00.000Z',
    },
    {
        name: 'WisprFlow',
        amount: 15,
        billingCycle: 'monthly' as const,
        category: 'Tools',
        renewalDate: '2026-02-06T00:00:00.000Z',
    },
    {
        name: 'RayTranscribes',
        amount: 7,
        billingCycle: 'monthly' as const,
        category: 'Tools',
        renewalDate: '2026-02-06T00:00:00.000Z',
    },
    {
        name: 'Native Audio',
        amount: 20,
        billingCycle: 'monthly' as const,
        category: 'Tools',
        renewalDate: '2026-02-06T00:00:00.000Z',
    },
    {
        name: '1 of 10',
        amount: 20,
        billingCycle: 'monthly' as const,
        category: 'Tools',
        renewalDate: '2026-02-06T00:00:00.000Z',
    },
    {
        name: 'Twitter',
        amount: 8,
        billingCycle: 'monthly' as const,
        category: 'Tools',
        renewalDate: '2026-02-06T00:00:00.000Z',
    },
    {
        name: 'Cursor',
        amount: 20,
        billingCycle: 'monthly' as const,
        category: 'Tools',
        renewalDate: '2026-02-06T00:00:00.000Z',
    },
    {
        name: 'Ecamm Live',
        amount: 240,
        billingCycle: 'annual' as const,
        category: 'Tools',
        renewalDate: '2027-01-06T00:00:00.000Z',
    },
    {
        name: 'Envato Elements',
        amount: 200,
        billingCycle: 'annual' as const,
        category: 'Tools',
        renewalDate: '2027-01-06T00:00:00.000Z',
    },
];

// Seed data for initiatives
const DEFAULT_INITIATIVES = [
    {
        name: 'Increase Revenue',
        description: 'Grow recurring revenue through new client acquisition and upsells',
        category: 'Growth',
        status: 'on-track' as const,
        color: '#22c55e',
        kpis: [
            {
                id: crypto.randomUUID(),
                name: 'Monthly Recurring Revenue',
                unit: '$',
                quarters: {
                    q1: { target: 15000, actual: null },
                    q2: { target: 20000, actual: null },
                    q3: { target: 25000, actual: null },
                    q4: { target: 30000, actual: null },
                },
            },
            {
                id: crypto.randomUUID(),
                name: 'New Clients',
                unit: 'clients',
                quarters: {
                    q1: { target: 5, actual: null },
                    q2: { target: 7, actual: null },
                    q3: { target: 8, actual: null },
                    q4: { target: 10, actual: null },
                },
            },
        ],
    },
    {
        name: 'Launch Product Suite',
        description: 'Build and launch three new digital products for passive income',
        category: 'Product',
        status: 'on-track' as const,
        color: '#8b5cf6',
        kpis: [
            {
                id: crypto.randomUUID(),
                name: 'Products Launched',
                unit: 'products',
                quarters: {
                    q1: { target: 1, actual: null },
                    q2: { target: 1, actual: null },
                    q3: { target: 1, actual: null },
                    q4: { target: 0, actual: null },
                },
            },
            {
                id: crypto.randomUUID(),
                name: 'Product Revenue',
                unit: '$',
                quarters: {
                    q1: { target: 2000, actual: null },
                    q2: { target: 5000, actual: null },
                    q3: { target: 8000, actual: null },
                    q4: { target: 12000, actual: null },
                },
            },
        ],
    },
    {
        name: 'Streamline Operations',
        description: 'Automate repetitive tasks and improve workflow efficiency',
        category: 'Operations',
        status: 'at-risk' as const,
        color: '#f97316',
        kpis: [
            {
                id: crypto.randomUUID(),
                name: 'Processes Automated',
                unit: 'count',
                quarters: {
                    q1: { target: 3, actual: null },
                    q2: { target: 5, actual: null },
                    q3: { target: 4, actual: null },
                    q4: { target: 3, actual: null },
                },
            },
            {
                id: crypto.randomUUID(),
                name: 'Time Saved Weekly',
                unit: 'hours',
                quarters: {
                    q1: { target: 5, actual: null },
                    q2: { target: 10, actual: null },
                    q3: { target: 15, actual: null },
                    q4: { target: 20, actual: null },
                },
            },
        ],
    },
    {
        name: 'Build Brand Presence',
        description: 'Grow social media following and establish thought leadership',
        category: 'Marketing',
        status: 'on-track' as const,
        color: '#ec4899',
        kpis: [
            {
                id: crypto.randomUUID(),
                name: 'LinkedIn Followers',
                unit: 'followers',
                quarters: {
                    q1: { target: 5000, actual: null },
                    q2: { target: 7500, actual: null },
                    q3: { target: 10000, actual: null },
                    q4: { target: 15000, actual: null },
                },
            },
            {
                id: crypto.randomUUID(),
                name: 'Newsletter Subscribers',
                unit: 'subscribers',
                quarters: {
                    q1: { target: 1000, actual: null },
                    q2: { target: 2500, actual: null },
                    q3: { target: 5000, actual: null },
                    q4: { target: 7500, actual: null },
                },
            },
        ],
    },
];

// Seed data for SOPs
const DEFAULT_SOPS = [
    {
        title: 'Client Onboarding Process',
        content: '# Client Onboarding\n\n1. Send welcome email\n2. Schedule kickoff call\n3. Collect project requirements\n4. Set up project workspace\n5. Create project timeline',
        category: 'Client Management',
        tags: ['clients', 'onboarding', 'process'],
    },
    {
        title: 'Content Publishing Workflow',
        content: '# Content Publishing\n\n1. Draft content\n2. Edit and proofread\n3. Create visuals\n4. Schedule publication\n5. Promote on social media',
        category: 'Content',
        tags: ['content', 'publishing', 'workflow'],
    },
];

// Seed data for projects
const DEFAULT_PROJECTS = [
    {
        name: 'Website Redesign',
        description: 'Complete overhaul of company website with modern design',
        status: 'active' as const,
        color: '#6366f1',
        tasks: [
            { id: crypto.randomUUID(), title: 'Design mockups', completed: true },
            { id: crypto.randomUUID(), title: 'Frontend development', completed: false },
            { id: crypto.randomUUID(), title: 'Backend integration', completed: false },
            { id: crypto.randomUUID(), title: 'Testing and QA', completed: false },
        ],
    },
];

export const seedDatabase = mutation({
    args: {},
    handler: async (ctx) => {
        const now = new Date().toISOString();

        // Check if data already exists
        const existingExpenses = await ctx.db.query("expenses").collect();
        const existingInitiatives = await ctx.db.query("initiatives").collect();
        const existingSops = await ctx.db.query("sops").collect();
        const existingProjects = await ctx.db.query("projects").collect();

        // Seed expenses
        if (existingExpenses.length === 0) {
            for (const expense of DEFAULT_EXPENSES) {
                await ctx.db.insert("expenses", {
                    ...expense,
                    createdAt: now,
                    updatedAt: now,
                });
            }
        }

        // Seed initiatives
        if (existingInitiatives.length === 0) {
            for (const initiative of DEFAULT_INITIATIVES) {
                await ctx.db.insert("initiatives", {
                    ...initiative,
                    createdAt: now,
                    updatedAt: now,
                });
            }
        }

        // Seed SOPs
        if (existingSops.length === 0) {
            for (const sop of DEFAULT_SOPS) {
                await ctx.db.insert("sops", {
                    ...sop,
                    createdAt: now,
                    updatedAt: now,
                });
            }
        }

        // Seed projects
        if (existingProjects.length === 0) {
            for (const project of DEFAULT_PROJECTS) {
                await ctx.db.insert("projects", {
                    ...project,
                    createdAt: now,
                    updatedAt: now,
                });
            }
        }

        return {
            seeded: {
                expenses: existingExpenses.length === 0 ? DEFAULT_EXPENSES.length : 0,
                initiatives: existingInitiatives.length === 0 ? DEFAULT_INITIATIVES.length : 0,
                sops: existingSops.length === 0 ? DEFAULT_SOPS.length : 0,
                projects: existingProjects.length === 0 ? DEFAULT_PROJECTS.length : 0,
            }
        };
    },
});
