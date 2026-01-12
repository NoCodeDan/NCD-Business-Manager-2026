import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

// CORS headers for all responses
const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Helper to create JSON response
function jsonResponse(data: unknown, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
}

// Helper to parse request body
async function parseBody(request: Request) {
    try {
        return await request.json();
    } catch {
        return {};
    }
}

// ==================================================
// Context Endpoints
// ==================================================

http.route({
    path: "/api/context",
    method: "GET",
    handler: httpAction(async (ctx) => {
        const context = await ctx.runQuery(api.context.getContext);
        return jsonResponse(context);
    }),
});

http.route({
    path: "/api/context/markdown",
    method: "GET",
    handler: httpAction(async (ctx) => {
        const markdown = await ctx.runQuery(api.context.getContextMarkdown);
        return new Response(markdown, {
            headers: { ...corsHeaders, "Content-Type": "text/markdown" },
        });
    }),
});

// ==================================================
// SOPs Endpoints
// ==================================================

http.route({
    path: "/api/sops",
    method: "GET",
    handler: httpAction(async (ctx) => {
        const sops = await ctx.runQuery(api.sops.get);
        return jsonResponse(sops);
    }),
});

http.route({
    path: "/api/sops",
    method: "POST",
    handler: httpAction(async (ctx, request) => {
        const body = await parseBody(request);
        const id = await ctx.runMutation(api.sops.create, body);
        return jsonResponse({ id, success: true }, 201);
    }),
});

http.route({
    path: "/api/sops/search",
    method: "POST",
    handler: httpAction(async (ctx, request) => {
        const body = await parseBody(request);
        const results = await ctx.runQuery(api.sops.search, { query: body.query || "" });
        return jsonResponse(results);
    }),
});

// ==================================================
// Projects Endpoints
// ==================================================

http.route({
    path: "/api/projects",
    method: "GET",
    handler: httpAction(async (ctx) => {
        const projects = await ctx.runQuery(api.projects.get);
        return jsonResponse(projects);
    }),
});

http.route({
    path: "/api/projects",
    method: "POST",
    handler: httpAction(async (ctx, request) => {
        const body = await parseBody(request);
        const id = await ctx.runMutation(api.projects.create, body);
        return jsonResponse({ id, success: true }, 201);
    }),
});

http.route({
    path: "/api/projects/search",
    method: "POST",
    handler: httpAction(async (ctx, request) => {
        const body = await parseBody(request);
        const results = await ctx.runQuery(api.projects.search, {
            query: body.query,
            status: body.status,
        });
        return jsonResponse(results);
    }),
});

// ==================================================
// Expenses Endpoints
// ==================================================

http.route({
    path: "/api/expenses",
    method: "GET",
    handler: httpAction(async (ctx) => {
        const expenses = await ctx.runQuery(api.expenses.get);
        return jsonResponse(expenses);
    }),
});

http.route({
    path: "/api/expenses",
    method: "POST",
    handler: httpAction(async (ctx, request) => {
        const body = await parseBody(request);
        const id = await ctx.runMutation(api.expenses.create, body);
        return jsonResponse({ id, success: true }, 201);
    }),
});

http.route({
    path: "/api/expenses/search",
    method: "POST",
    handler: httpAction(async (ctx, request) => {
        const body = await parseBody(request);
        const results = await ctx.runQuery(api.expenses.search, {
            query: body.query,
            category: body.category,
            billingCycle: body.billingCycle,
            minAmount: body.minAmount,
            maxAmount: body.maxAmount,
        });
        return jsonResponse(results);
    }),
});

// ==================================================
// Initiatives Endpoints
// ==================================================

http.route({
    path: "/api/initiatives",
    method: "GET",
    handler: httpAction(async (ctx) => {
        const initiatives = await ctx.runQuery(api.initiatives.get);
        return jsonResponse(initiatives);
    }),
});

http.route({
    path: "/api/initiatives",
    method: "POST",
    handler: httpAction(async (ctx, request) => {
        const body = await parseBody(request);
        const id = await ctx.runMutation(api.initiatives.create, body);
        return jsonResponse({ id, success: true }, 201);
    }),
});

http.route({
    path: "/api/initiatives/search",
    method: "POST",
    handler: httpAction(async (ctx, request) => {
        const body = await parseBody(request);
        const results = await ctx.runQuery(api.initiatives.search, {
            query: body.query,
            category: body.category,
            status: body.status,
        });
        return jsonResponse(results);
    }),
});

// ==================================================
// Universal Search Endpoint
// ==================================================

http.route({
    path: "/api/search",
    method: "POST",
    handler: httpAction(async (ctx, request) => {
        const body = await parseBody(request);
        const query = body.query || "";
        const entityTypes = body.types || ["sops", "projects", "expenses", "initiatives"];

        const results: Record<string, unknown[]> = {};

        if (entityTypes.includes("sops")) {
            results.sops = await ctx.runQuery(api.sops.search, { query });
        }
        if (entityTypes.includes("projects")) {
            results.projects = await ctx.runQuery(api.projects.search, { query });
        }
        if (entityTypes.includes("expenses")) {
            results.expenses = await ctx.runQuery(api.expenses.search, { query });
        }
        if (entityTypes.includes("initiatives")) {
            results.initiatives = await ctx.runQuery(api.initiatives.search, { query });
        }

        return jsonResponse(results);
    }),
});

// ==================================================
// CORS Preflight Handler
// ==================================================

http.route({
    path: "/api/context",
    method: "OPTIONS",
    handler: httpAction(async () => new Response(null, { headers: corsHeaders })),
});

http.route({
    path: "/api/context/markdown",
    method: "OPTIONS",
    handler: httpAction(async () => new Response(null, { headers: corsHeaders })),
});

http.route({
    path: "/api/sops",
    method: "OPTIONS",
    handler: httpAction(async () => new Response(null, { headers: corsHeaders })),
});

http.route({
    path: "/api/sops/search",
    method: "OPTIONS",
    handler: httpAction(async () => new Response(null, { headers: corsHeaders })),
});

http.route({
    path: "/api/projects",
    method: "OPTIONS",
    handler: httpAction(async () => new Response(null, { headers: corsHeaders })),
});

http.route({
    path: "/api/projects/search",
    method: "OPTIONS",
    handler: httpAction(async () => new Response(null, { headers: corsHeaders })),
});

http.route({
    path: "/api/expenses",
    method: "OPTIONS",
    handler: httpAction(async () => new Response(null, { headers: corsHeaders })),
});

http.route({
    path: "/api/expenses/search",
    method: "OPTIONS",
    handler: httpAction(async () => new Response(null, { headers: corsHeaders })),
});

http.route({
    path: "/api/initiatives",
    method: "OPTIONS",
    handler: httpAction(async () => new Response(null, { headers: corsHeaders })),
});

http.route({
    path: "/api/initiatives/search",
    method: "OPTIONS",
    handler: httpAction(async () => new Response(null, { headers: corsHeaders })),
});

http.route({
    path: "/api/search",
    method: "OPTIONS",
    handler: httpAction(async () => new Response(null, { headers: corsHeaders })),
});

export default http;
