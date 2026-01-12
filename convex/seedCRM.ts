import { mutation } from "./_generated/server";

// Seed CRM data - run once to populate initial data
export const seedCRM = mutation({
    args: {},
    handler: async (ctx) => {
        const now = new Date().toISOString();

        // Check if already seeded
        const existingPartners = await ctx.db.query("brandPartners").collect();
        if (existingPartners.length > 0) {
            return { message: "CRM data already seeded", seeded: false };
        }

        // Create Brand Partners
        const adaloId = await ctx.db.insert("brandPartners", {
            name: "Adalo",
            website: "https://adalo.com",
            partnerType: "strategic",
            status: "active",
            notes: "Strategic partnership for no-code education and content",
            createdAt: now,
            updatedAt: now,
        });

        const treehouseId = await ctx.db.insert("brandPartners", {
            name: "Treehouse",
            website: "https://teamtreehouse.com",
            partnerType: "strategic",
            status: "active",
            notes: "Education and learning platform partnership",
            createdAt: now,
            updatedAt: now,
        });

        // Create Contacts (Partner Contacts)
        await ctx.db.insert("contacts", {
            name: "James",
            email: "james@adalo.com",
            bio: "Partnership Lead at Adalo. Passionate about empowering creators with no-code tools and building strategic partnerships in the no-code ecosystem.",
            location: "Remote",
            company: {
                name: "Adalo",
                role: "Partnership Lead",
                website: "https://adalo.com",
                industry: "No-Code Platform",
            },
            socialProfiles: [
                { platform: "LinkedIn", url: "https://linkedin.com/in/james-adalo", username: "james-adalo" },
            ],
            recentActivity: [
                "Launched partner program 2.0",
                "Spoke at No-Code Summit 2025",
            ],
            status: "enriched",
            brandPartnerId: adaloId,
            createdAt: now,
            updatedAt: now,
        });

        await ctx.db.insert("contacts", {
            name: "Jason Gilmore",
            email: "jason@adalo.com",
            bio: "Partnerships team member at Adalo. Focused on growing the Adalo ecosystem through strategic collaborations with educators and content creators.",
            location: "Remote",
            company: {
                name: "Adalo",
                role: "Partnerships",
                website: "https://adalo.com",
                industry: "No-Code Platform",
            },
            socialProfiles: [
                { platform: "LinkedIn", url: "https://linkedin.com/in/jasongilmore", username: "jasongilmore" },
            ],
            recentActivity: [
                "Onboarded 50+ new partner creators",
                "Coordinated Adalo community event",
            ],
            status: "enriched",
            brandPartnerId: adaloId,
            createdAt: now,
            updatedAt: now,
        });

        await ctx.db.insert("contacts", {
            name: "Kari Brooks",
            email: "kari@teamtreehouse.com",
            bio: "Partnerships lead at Treehouse. Dedicated to making tech education accessible through innovative partnerships and collaboration with industry experts.",
            location: "Portland, OR",
            company: {
                name: "Treehouse",
                role: "Partnerships",
                website: "https://teamtreehouse.com",
                industry: "EdTech / Online Learning",
            },
            socialProfiles: [
                { platform: "LinkedIn", url: "https://linkedin.com/in/karibrooks", username: "karibrooks" },
                { platform: "Twitter/X", url: "https://x.com/karibrooks", username: "@karibrooks" },
            ],
            recentActivity: [
                "Expanded Treehouse partner network",
                "Launched new curriculum partnership program",
            ],
            status: "enriched",
            brandPartnerId: treehouseId,
            createdAt: now,
            updatedAt: now,
        });

        // Create other contacts (non-partner)
        await ctx.db.insert("contacts", {
            name: "Sarah Chen",
            email: "sarah.chen@techstartup.io",
            bio: "Product leader passionate about AI and developer tools. Previously at Stripe and Notion.",
            location: "San Francisco, CA",
            company: {
                name: "TechStartup.io",
                role: "VP of Product",
                website: "https://techstartup.io",
                industry: "SaaS / Developer Tools",
            },
            socialProfiles: [
                { platform: "LinkedIn", url: "https://linkedin.com/in/sarahchen", username: "sarahchen" },
                { platform: "Twitter/X", url: "https://x.com/sarahchentech", username: "@sarahchentech" },
            ],
            recentActivity: [
                'Published article: "Building Products in the AI Era"',
                "Spoke at ProductCon 2025",
                "Promoted to VP of Product",
            ],
            status: "enriched",
            followUpDate: "2026-01-15",
            followUpNote: "Follow up on partnership discussion",
            createdAt: now,
            updatedAt: now,
        });

        await ctx.db.insert("contacts", {
            name: "Marcus Johnson",
            email: "marcus.johnson@ventures.capital",
            bio: "Partner at Ventures Capital. Investing in seed-stage B2B SaaS. Former founder (2x exit).",
            location: "New York, NY",
            company: {
                name: "Ventures Capital",
                role: "Partner",
                website: "https://ventures.capital",
                industry: "Venture Capital",
            },
            socialProfiles: [
                { platform: "LinkedIn", url: "https://linkedin.com/in/marcusjohnsonvc", username: "marcusjohnsonvc" },
                { platform: "Twitter/X", url: "https://x.com/marcusvc", username: "@marcusvc" },
            ],
            recentActivity: [
                "Led Series A for DataFlow ($12M)",
                'Published "2026 SaaS Predictions"',
                "Joined board of AI startup CloudMind",
            ],
            status: "enriched",
            createdAt: now,
            updatedAt: now,
        });

        // Create Clients
        await ctx.db.insert("clients", {
            name: "Sarah Johnson",
            company: "Startup Labs",
            email: "sarah@startuplabs.io",
            projectType: "Web Development",
            status: "active",
            value: 15000,
            notes: "MVP development in progress",
            createdAt: now,
            updatedAt: now,
        });

        await ctx.db.insert("clients", {
            name: "David Kim",
            company: "E-Commerce Plus",
            email: "david@ecomplus.com",
            projectType: "Automation",
            status: "active",
            value: 8500,
            notes: "Zapier integrations",
            createdAt: now,
            updatedAt: now,
        });

        await ctx.db.insert("clients", {
            name: "Emily Brown",
            company: "Creative Agency",
            email: "emily@creativeco.design",
            projectType: "Consulting",
            status: "completed",
            value: 5000,
            createdAt: now,
            updatedAt: now,
        });

        await ctx.db.insert("clients", {
            name: "Alex Turner",
            company: "NextGen Apps",
            email: "alex@nextgenapps.io",
            projectType: "Mobile App",
            status: "prospect",
            value: 25000,
            notes: "Proposal sent, awaiting response",
            createdAt: now,
            updatedAt: now,
        });

        return {
            message: "CRM data seeded successfully",
            seeded: true,
            counts: {
                brandPartners: 2,
                contacts: 5,
                clients: 4,
            },
        };
    },
});
