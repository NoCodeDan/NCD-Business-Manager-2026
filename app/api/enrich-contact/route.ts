import { NextRequest, NextResponse } from 'next/server';
import FirecrawlApp from '@mendable/firecrawl-js';
import OpenAI from 'openai';

// Enhanced dossier data shape from AI extraction
interface ExtractedDossierData {
    // Identity
    name: string;
    bio: string;
    location: string;
    timezone?: string;

    // Company
    companyName: string;
    role: string;
    companyDescription: string;
    industry: string;

    // Social
    website?: string;
    linkedinUrl?: string;
    twitterUrl?: string;
    newsletterUrl?: string;
    githubUrl?: string;
    primaryPlatform?: string;

    // Credibility
    previousRoles?: string[];
    productsBuilt?: string[];
    audienceSize?: string;
    notableLogos?: string[];

    // Current Focus
    currentProjects?: string[];
    activeLaunch?: { active: boolean; url?: string; name?: string };
    publicProblems?: string[];
    statedGoals?: string[];
    recentActivity?: string[];

    // Tools
    knownTools?: string[];
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

        for (const url of urlsToTry.slice(0, 3)) {
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

        // Enhanced OpenAI extraction for comprehensive dossier
        const extraction = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            response_format: { type: 'json_object' },
            messages: [
                {
                    role: 'system',
                    content: `You are an expert at extracting comprehensive contact dossier information from website content.
                    
Extract as much of this information as possible:

IDENTITY:
- name: Full name of the person
- bio: Professional bio or summary (2-3 sentences)
- location: City, state, or country
- timezone: If location found, infer timezone (e.g., "EST", "PST", "GMT")

COMPANY:
- companyName: Company or organization name
- role: Job title or role
- companyDescription: One sentence describing what the company does
- industry: Industry or niche (e.g., "SaaS", "No-Code", "Marketing", "AI")

SOCIAL PRESENCE:
- website: Personal or company website URL
- linkedinUrl: LinkedIn profile URL if found
- twitterUrl: Twitter/X profile URL if found
- newsletterUrl: Newsletter or Substack URL if found
- githubUrl: GitHub profile URL if found
- primaryPlatform: Which platform seems to be their main one ("LinkedIn", "Twitter/X", "YouTube", etc.)

CREDIBILITY:
- previousRoles: Array of notable previous roles or companies (up to 3)
- productsBuilt: Array of products they've built or shipped (up to 5)
- audienceSize: Rough audience size if mentioned (e.g., "10K Twitter followers", "50K newsletter")
- notableLogos: Array of notable companies/logos they've worked with (up to 5)

CURRENT FOCUS:
- currentProjects: Array of projects they're currently working on (up to 3)
- activeLaunch: { active: boolean, url: string, name: string } if they have an active launch
- publicProblems: Array of problems or challenges they discuss publicly (up to 3)
- statedGoals: Array of goals they've mentioned (growth, hiring, shipping, etc., up to 3)
- recentActivity: Array of recent public activities or achievements (up to 3)

TOOLS:
- knownTools: Array of tools or technologies they use or mention (up to 5)

Return a JSON object. For arrays, return empty array [] if no data found. For strings, return empty string "".
Prefer actual data found in content over guesses. Use the email name hint only if no name is found.`
                },
                {
                    role: 'user',
                    content: `Email: ${email}
Email name hint: ${guessedFullName}

Website Content (truncated):
${allContent.slice(0, 15000)}`
                }
            ],
            temperature: 0.2,
        });

        const aiResponse = extraction.choices[0]?.message?.content;
        if (!aiResponse) {
            throw new Error('No response from OpenAI');
        }

        const parsed = JSON.parse(aiResponse) as ExtractedDossierData;

        // Build social profiles array with isPrimary flag
        const socialProfiles: Array<{ platform: string; url: string; username: string; isPrimary?: boolean }> = [];

        if (parsed.linkedinUrl) {
            const usernameMatch = parsed.linkedinUrl.match(/linkedin\.com\/(?:in|company)\/([^\/\?]+)/);
            socialProfiles.push({
                platform: 'LinkedIn',
                url: parsed.linkedinUrl,
                username: usernameMatch?.[1] || '',
                isPrimary: parsed.primaryPlatform === 'LinkedIn',
            });
        }
        if (parsed.twitterUrl) {
            const usernameMatch = parsed.twitterUrl.match(/(?:twitter|x)\.com\/([^\/\?]+)/);
            socialProfiles.push({
                platform: 'Twitter/X',
                url: parsed.twitterUrl,
                username: usernameMatch?.[1] || '',
                isPrimary: parsed.primaryPlatform === 'Twitter/X' || parsed.primaryPlatform === 'Twitter' || parsed.primaryPlatform === 'X',
            });
        }

        // Also extract any social profiles from raw content
        const additionalProfiles = extractSocialProfiles(allContent);
        for (const profile of additionalProfiles) {
            if (!socialProfiles.some(p => p.platform === profile.platform)) {
                socialProfiles.push({
                    ...profile,
                    isPrimary: parsed.primaryPlatform === profile.platform,
                });
            }
        }

        // Structure the enriched dossier data
        const enrichedData = {
            contactId,
            // Identity
            name: parsed.name || guessedFullName || '',
            bio: parsed.bio || companyMetadata.description || '',
            location: parsed.location || '',
            timezone: parsed.timezone || '',
            // Company
            company: {
                name: parsed.companyName || companyMetadata.title || emailDomain,
                role: parsed.role || '',
                website: parsed.website || `https://${emailDomain}`,
                industry: parsed.industry || '',
                description: parsed.companyDescription || '',
            },
            // Social
            website: parsed.website || `https://${emailDomain}`,
            primaryPlatform: parsed.primaryPlatform || '',
            socialProfiles,
            newsletter: parsed.newsletterUrl || '',
            github: parsed.githubUrl || '',
            // Credibility
            avatar: companyMetadata.ogImage || '',
            previousRoles: parsed.previousRoles || [],
            productsBuilt: parsed.productsBuilt || [],
            audienceSize: parsed.audienceSize || '',
            notableLogos: parsed.notableLogos || [],
            // Focus
            currentProjects: parsed.currentProjects || [],
            activeLaunch: parsed.activeLaunch || undefined,
            publicProblems: parsed.publicProblems || [],
            statedGoals: parsed.statedGoals || [],
            recentActivity: parsed.recentActivity || [],
            // Tools
            knownTools: parsed.knownTools || [],
            // System
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

    const linkedinMatch = markdown.match(/https?:\/\/(www\.)?linkedin\.com\/(?:in|company)\/([a-zA-Z0-9-]+)/);
    if (linkedinMatch) {
        profiles.push({
            platform: 'LinkedIn',
            url: linkedinMatch[0],
            username: linkedinMatch[2],
        });
    }

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

export async function GET() {
    return NextResponse.json(
        { error: 'Method not allowed. Use POST.' },
        { status: 405 }
    );
}
