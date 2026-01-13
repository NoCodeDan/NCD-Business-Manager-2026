import { NextRequest, NextResponse } from 'next/server';
import FirecrawlApp from '@mendable/firecrawl-js';

// Contact data shape from Firecrawl extraction
interface ExtractedContactData {
    name?: string;
    bio?: string;
    location?: string;
    avatar?: string;
    company?: {
        name?: string;
        role?: string;
        website?: string;
        industry?: string;
    };
    socialProfiles?: Array<{
        platform: string;
        url: string;
        username: string;
    }>;
    recentActivity?: string[];
}

export async function POST(request: NextRequest) {
    try {
        const { email, contactId } = await request.json();

        if (!email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            );
        }

        if (!process.env.FIRECRAWL_API_KEY) {
            return NextResponse.json(
                { error: 'Firecrawl API key not configured' },
                { status: 500 }
            );
        }

        // Initialize Firecrawl client
        const firecrawl = new FirecrawlApp({
            apiKey: process.env.FIRECRAWL_API_KEY,
        });

        // Extract domain from email for company lookup
        const emailDomain = email.split('@')[1];
        const companyUrl = `https://${emailDomain}`;

        // Use Firecrawl to scrape the company website
        const scrapeResult = await firecrawl.scrape(companyUrl, {
            formats: ['markdown'],
        });

        // Check if we got valid content
        if (!scrapeResult || !scrapeResult.markdown) {
            return NextResponse.json(
                {
                    error: 'Failed to scrape website',
                    details: 'No content returned from website',
                    contactId,
                    status: 'failed'
                },
                { status: 404 }
            );
        }

        // Parse the markdown content to extract contact information
        // This is a simple extraction - in production you might use an LLM
        const markdown = scrapeResult.markdown;
        const metadata = scrapeResult.metadata || {};

        // Extract basic info from scraped content
        const extractedData: ExtractedContactData = {
            name: '', // Will need manual input or LLM extraction
            bio: metadata.description || '',
            location: '',
            avatar: metadata.ogImage || '',
            company: {
                name: metadata.title || emailDomain,
                role: '',
                website: companyUrl,
                industry: '',
            },
            socialProfiles: extractSocialProfiles(markdown),
            recentActivity: [],
        };

        // Structure the enriched data
        const enrichedData = {
            contactId,
            name: extractedData.name || '',
            bio: extractedData.bio || '',
            location: extractedData.location || '',
            avatar: extractedData.avatar || '',
            company: {
                name: extractedData.company?.name || '',
                role: extractedData.company?.role || '',
                website: extractedData.company?.website || companyUrl,
                industry: extractedData.company?.industry || '',
            },
            socialProfiles: extractedData.socialProfiles || [],
            recentActivity: extractedData.recentActivity || [],
            status: 'enriched' as const,
            rawContent: markdown.slice(0, 2000), // Include some content for context
        };

        return NextResponse.json(enrichedData);
    } catch (error) {
        console.error('Firecrawl enrichment error:', error);
        return NextResponse.json(
            {
                error: 'Internal server error',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}

// Extract social profile URLs from markdown content
function extractSocialProfiles(markdown: string): Array<{ platform: string; url: string; username: string }> {
    const profiles: Array<{ platform: string; url: string; username: string }> = [];

    // LinkedIn
    const linkedinMatch = markdown.match(/https?:\/\/(www\.)?linkedin\.com\/(?:in|company)\/([a-zA-Z0-9-]+)/);
    if (linkedinMatch) {
        profiles.push({
            platform: 'LinkedIn',
            url: linkedinMatch[0],
            username: linkedinMatch[2],
        });
    }

    // Twitter/X
    const twitterMatch = markdown.match(/https?:\/\/(www\.)?(twitter|x)\.com\/([a-zA-Z0-9_]+)/);
    if (twitterMatch) {
        profiles.push({
            platform: 'Twitter/X',
            url: twitterMatch[0],
            username: twitterMatch[3],
        });
    }

    return profiles;
}

// Handle unsupported methods
export async function GET() {
    return NextResponse.json(
        { error: 'Method not allowed. Use POST.' },
        { status: 405 }
    );
}
