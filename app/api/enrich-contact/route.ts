import { NextRequest, NextResponse } from 'next/server';
import FirecrawlApp from '@mendable/firecrawl-js';
import OpenAI from 'openai';

// Contact data shape from AI extraction
interface ExtractedContactData {
    name: string;
    bio: string;
    location: string;
    avatar: string;
    company: {
        name: string;
        role: string;
        website: string;
        industry: string;
    };
    socialProfiles: Array<{
        platform: string;
        url: string;
        username: string;
    }>;
    recentActivity: string[];
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

        if (!process.env.OPENAI_API_KEY) {
            return NextResponse.json(
                { error: 'OpenAI API key not configured' },
                { status: 500 }
            );
        }

        // Initialize clients
        const firecrawl = new FirecrawlApp({
            apiKey: process.env.FIRECRAWL_API_KEY,
        });

        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        // Extract domain and name guess from email
        const emailDomain = email.split('@')[1];
        const emailPrefix = email.split('@')[0];
        const nameParts = emailPrefix.replace(/[._-]/g, ' ').split(' ');
        const guessedFirstName = nameParts[0]?.charAt(0).toUpperCase() + nameParts[0]?.slice(1) || '';
        const guessedLastName = nameParts[1]?.charAt(0).toUpperCase() + nameParts[1]?.slice(1) || '';
        const guessedFullName = `${guessedFirstName} ${guessedLastName}`.trim();

        // URLs to scrape for information about the person
        const urlsToTry = [
            `https://${emailDomain}`,
            `https://${emailDomain}/about`,
            `https://${emailDomain}/team`,
            `https://${emailDomain}/about-us`,
            `https://${emailDomain}/our-team`,
        ];

        // Scrape multiple pages for more context
        let allContent = '';
        let companyMetadata: { title?: string; description?: string; ogImage?: string } = {};

        for (const url of urlsToTry.slice(0, 3)) { // Limit to 3 to save API calls
            try {
                const scrapeResult = await firecrawl.scrape(url, {
                    formats: ['markdown'],
                });

                if (scrapeResult?.markdown) {
                    allContent += `\n\n--- Content from ${url} ---\n${scrapeResult.markdown}`;
                    if (!companyMetadata.title && scrapeResult.metadata) {
                        companyMetadata = scrapeResult.metadata;
                    }
                }
            } catch {
                // Skip failed URLs
                continue;
            }
        }

        if (!allContent) {
            return NextResponse.json(
                {
                    error: 'Could not scrape any content from the domain',
                    contactId,
                    status: 'failed'
                },
                { status: 404 }
            );
        }

        // Use OpenAI to extract person information from the content
        const extraction = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            response_format: { type: 'json_object' },
            messages: [
                {
                    role: 'system',
                    content: `You are an expert at extracting contact information from website content. 
                    You will receive scraped content from a company website and an email address.
                    Your job is to find information about the person with that email or guess based on available info.
                    
                    Return a JSON object with these fields:
                    - name: Full name of the person (use the email hint if you can't find them)
                    - bio: Brief professional bio or description
                    - location: Their location if mentioned
                    - role: Their job title/role at the company
                    - companyName: The company name
                    - industry: The company's industry
                    - linkedinUrl: LinkedIn profile URL if found
                    - twitterUrl: Twitter/X profile URL if found
                    - recentActivity: Array of recent posts, achievements, or activities (up to 3)
                    
                    If you can't find specific info, make reasonable inferences from the company context.
                    For name, prefer any name you find in the content that could match the email prefix.`
                },
                {
                    role: 'user',
                    content: `Email: ${email}
Email name hint: ${guessedFullName}

Website Content (truncated to key sections):
${allContent.slice(0, 12000)}`
                }
            ],
            temperature: 0.3,
        });

        const aiResponse = extraction.choices[0]?.message?.content;
        if (!aiResponse) {
            throw new Error('No response from OpenAI');
        }

        const parsed = JSON.parse(aiResponse) as {
            name?: string;
            bio?: string;
            location?: string;
            role?: string;
            companyName?: string;
            industry?: string;
            linkedinUrl?: string;
            twitterUrl?: string;
            recentActivity?: string[];
        };

        // Build social profiles array
        const socialProfiles: ExtractedContactData['socialProfiles'] = [];
        if (parsed.linkedinUrl) {
            const usernameMatch = parsed.linkedinUrl.match(/linkedin\.com\/(?:in|company)\/([^\/\?]+)/);
            socialProfiles.push({
                platform: 'LinkedIn',
                url: parsed.linkedinUrl,
                username: usernameMatch?.[1] || '',
            });
        }
        if (parsed.twitterUrl) {
            const usernameMatch = parsed.twitterUrl.match(/(?:twitter|x)\.com\/([^\/\?]+)/);
            socialProfiles.push({
                platform: 'Twitter/X',
                url: parsed.twitterUrl,
                username: usernameMatch?.[1] || '',
            });
        }

        // Also extract any social profiles from the raw content
        const additionalProfiles = extractSocialProfiles(allContent);
        for (const profile of additionalProfiles) {
            if (!socialProfiles.some(p => p.platform === profile.platform)) {
                socialProfiles.push(profile);
            }
        }

        // Structure the enriched data
        const enrichedData = {
            contactId,
            name: parsed.name || guessedFullName || '',
            bio: parsed.bio || companyMetadata.description || '',
            location: parsed.location || '',
            avatar: companyMetadata.ogImage || '',
            company: {
                name: parsed.companyName || companyMetadata.title || emailDomain,
                role: parsed.role || '',
                website: `https://${emailDomain}`,
                industry: parsed.industry || '',
            },
            socialProfiles,
            recentActivity: parsed.recentActivity || [],
            status: 'enriched' as const,
        };

        return NextResponse.json(enrichedData);
    } catch (error) {
        console.error('Enrichment error:', error);
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
