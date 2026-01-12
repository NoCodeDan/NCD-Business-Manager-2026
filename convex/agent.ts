"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import { api } from "./_generated/api";
import OpenAI from "openai";

// Tool definitions for the agent
const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
    {
        type: "function",
        function: {
            name: "get_context",
            description: "Get an overview of the current app state including counts of SOPs, projects, expenses, initiatives, and recent activity",
            parameters: { type: "object", properties: {}, required: [] },
        },
    },
    {
        type: "function",
        function: {
            name: "list_sops",
            description: "List all Standard Operating Procedures",
            parameters: { type: "object", properties: {}, required: [] },
        },
    },
    {
        type: "function",
        function: {
            name: "search_sops",
            description: "Search SOPs by title, content, category, or tags",
            parameters: {
                type: "object",
                properties: {
                    query: { type: "string", description: "Search query" },
                },
                required: ["query"],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "create_sop",
            description: "Create a new Standard Operating Procedure",
            parameters: {
                type: "object",
                properties: {
                    title: { type: "string", description: "Title of the SOP" },
                    content: { type: "string", description: "Content/steps of the SOP" },
                    category: { type: "string", description: "Category (Operations, Marketing, Finance, Client Management, Content, Other)" },
                    tags: { type: "array", items: { type: "string" }, description: "Tags for the SOP" },
                },
                required: ["title", "content", "category"],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "list_projects",
            description: "List all projects with their status and progress",
            parameters: { type: "object", properties: {}, required: [] },
        },
    },
    {
        type: "function",
        function: {
            name: "search_projects",
            description: "Search projects by name, description, or filter by status",
            parameters: {
                type: "object",
                properties: {
                    query: { type: "string", description: "Search query" },
                    status: { type: "string", enum: ["active", "paused", "completed", "archived"], description: "Filter by status" },
                },
            },
        },
    },
    {
        type: "function",
        function: {
            name: "create_project",
            description: "Create a new project",
            parameters: {
                type: "object",
                properties: {
                    name: { type: "string", description: "Name of the project" },
                    description: { type: "string", description: "Project description" },
                    status: { type: "string", enum: ["active", "paused", "completed", "archived"], description: "Initial status" },
                    deadline: { type: "string", description: "Deadline in ISO format (optional)" },
                },
                required: ["name", "description"],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "add_task",
            description: "Add a task to a project",
            parameters: {
                type: "object",
                properties: {
                    projectId: { type: "string", description: "ID of the project" },
                    taskTitle: { type: "string", description: "Title of the task" },
                },
                required: ["projectId", "taskTitle"],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "list_expenses",
            description: "List all expenses/subscriptions",
            parameters: { type: "object", properties: {}, required: [] },
        },
    },
    {
        type: "function",
        function: {
            name: "search_expenses",
            description: "Search and filter expenses",
            parameters: {
                type: "object",
                properties: {
                    query: { type: "string", description: "Search query" },
                    category: { type: "string", description: "Filter by category" },
                    billingCycle: { type: "string", enum: ["monthly", "annual"], description: "Filter by billing cycle" },
                    minAmount: { type: "number", description: "Minimum amount" },
                    maxAmount: { type: "number", description: "Maximum amount" },
                },
            },
        },
    },
    {
        type: "function",
        function: {
            name: "list_initiatives",
            description: "List all business initiatives with their status",
            parameters: { type: "object", properties: {}, required: [] },
        },
    },
    {
        type: "function",
        function: {
            name: "search_initiatives",
            description: "Search initiatives by name, description, category, or status",
            parameters: {
                type: "object",
                properties: {
                    query: { type: "string", description: "Search query" },
                    category: { type: "string", description: "Filter by category" },
                    status: { type: "string", enum: ["on-track", "at-risk", "behind", "completed"], description: "Filter by status" },
                },
            },
        },
    },
];

// System prompt for the agent
const SYSTEM_PROMPT = `You are a helpful business management assistant for the NCD Business Manager app.

You have access to tools that let you:
- View and search SOPs (Standard Operating Procedures)
- View, search, and create projects with tasks
- View and search expenses/subscriptions
- View and search business initiatives with KPIs

When users ask questions, use the appropriate tools to get information. Always be helpful and concise.
When creating items, confirm what you created. When searching, summarize the results clearly.

Current date: ${new Date().toISOString().split('T')[0]}`;

// Execute a tool call
async function executeTool(
    ctx: any,
    toolName: string,
    args: Record<string, any>
): Promise<string> {
    try {
        switch (toolName) {
            case "get_context": {
                const context = await ctx.runQuery(api.context.getContext);
                return JSON.stringify(context, null, 2);
            }
            case "list_sops": {
                const sops = await ctx.runQuery(api.sops.get);
                return JSON.stringify(sops.map((s: any) => ({
                    id: s._id,
                    title: s.title,
                    category: s.category,
                    tags: s.tags,
                })), null, 2);
            }
            case "search_sops": {
                const sops = await ctx.runQuery(api.sops.search, { query: args.query });
                return JSON.stringify(sops.map((s: any) => ({
                    id: s._id,
                    title: s.title,
                    category: s.category,
                })), null, 2);
            }
            case "create_sop": {
                const id = await ctx.runMutation(api.sops.create, {
                    title: args.title,
                    content: args.content,
                    category: args.category,
                    tags: args.tags || [],
                });
                return JSON.stringify({ success: true, id, message: `Created SOP "${args.title}"` });
            }
            case "list_projects": {
                const projects = await ctx.runQuery(api.projects.get);
                return JSON.stringify(projects.map((p: any) => ({
                    id: p._id,
                    name: p.name,
                    status: p.status,
                    taskCount: p.tasks.length,
                    completedTasks: p.tasks.filter((t: any) => t.completed).length,
                })), null, 2);
            }
            case "search_projects": {
                const projects = await ctx.runQuery(api.projects.search, {
                    query: args.query,
                    status: args.status,
                });
                return JSON.stringify(projects.map((p: any) => ({
                    id: p._id,
                    name: p.name,
                    status: p.status,
                })), null, 2);
            }
            case "create_project": {
                const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f97316', '#22c55e', '#14b8a6', '#3b82f6'];
                const randomColor = colors[Math.floor(Math.random() * colors.length)];
                const id = await ctx.runMutation(api.projects.create, {
                    name: args.name,
                    description: args.description,
                    status: args.status || "active",
                    color: randomColor,
                    deadline: args.deadline,
                });
                return JSON.stringify({ success: true, id, message: `Created project "${args.name}"` });
            }
            case "add_task": {
                const task = await ctx.runMutation(api.projects.addTask, {
                    projectId: args.projectId,
                    taskTitle: args.taskTitle,
                });
                return JSON.stringify({ success: true, task, message: `Added task "${args.taskTitle}"` });
            }
            case "list_expenses": {
                const expenses = await ctx.runQuery(api.expenses.get);
                return JSON.stringify(expenses.map((e: any) => ({
                    id: e._id,
                    name: e.name,
                    amount: e.amount,
                    billingCycle: e.billingCycle,
                    category: e.category,
                    renewalDate: e.renewalDate,
                })), null, 2);
            }
            case "search_expenses": {
                const expenses = await ctx.runQuery(api.expenses.search, args);
                return JSON.stringify(expenses.map((e: any) => ({
                    id: e._id,
                    name: e.name,
                    amount: e.amount,
                    billingCycle: e.billingCycle,
                    category: e.category,
                })), null, 2);
            }
            case "list_initiatives": {
                const initiatives = await ctx.runQuery(api.initiatives.get);
                return JSON.stringify(initiatives.map((i: any) => ({
                    id: i._id,
                    name: i.name,
                    category: i.category,
                    status: i.status,
                    kpiCount: i.kpis.length,
                })), null, 2);
            }
            case "search_initiatives": {
                const initiatives = await ctx.runQuery(api.initiatives.search, args);
                return JSON.stringify(initiatives.map((i: any) => ({
                    id: i._id,
                    name: i.name,
                    status: i.status,
                })), null, 2);
            }
            default:
                return JSON.stringify({ error: `Unknown tool: ${toolName}` });
        }
    } catch (error) {
        return JSON.stringify({ error: String(error) });
    }
}

// Send a message and get AI response
export const sendMessage = action({
    args: {
        conversationId: v.optional(v.id("conversations")),
        message: v.string(),
    },
    handler: async (ctx, args): Promise<{
        conversationId: string;
        response: string;
        toolCalls: { id: string; name: string; arguments: string; result?: string }[];
    }> => {
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        // Create conversation if needed
        let conversationId = args.conversationId;
        if (!conversationId) {
            conversationId = await ctx.runMutation(api.conversations.createConversation, {
                title: args.message.slice(0, 50),
            });
        }

        // Get conversation history
        const messages = await ctx.runQuery(api.conversations.getMessages, { conversationId });

        // Build messages array for OpenAI
        const openaiMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
            { role: "system", content: SYSTEM_PROMPT },
            ...messages.map((m: { role: string; content: string }): OpenAI.Chat.Completions.ChatCompletionMessageParam => ({
                role: m.role as "user" | "assistant",
                content: m.content,
            })),
            { role: "user", content: args.message },
        ];

        // Save user message
        await ctx.runMutation(api.conversations.saveMessage, {
            conversationId,
            role: "user",
            content: args.message,
        });

        // Call OpenAI
        let response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: openaiMessages,
            tools,
            tool_choice: "auto",
        });

        let assistantMessage = response.choices[0].message;
        const toolCalls: { id: string; name: string; arguments: string; result?: string }[] = [];

        // Handle tool calls
        while (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
            const toolResults: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [];

            for (const toolCall of assistantMessage.tool_calls) {
                // Type assertion for function tool calls
                const funcCall = toolCall as { id: string; type: string; function: { name: string; arguments: string } };
                const toolArgs = JSON.parse(funcCall.function.arguments);
                const result = await executeTool(ctx, funcCall.function.name, toolArgs);

                toolCalls.push({
                    id: funcCall.id,
                    name: funcCall.function.name,
                    arguments: funcCall.function.arguments,
                    result,
                });

                toolResults.push({
                    role: "tool",
                    tool_call_id: funcCall.id,
                    content: result,
                });
            }

            // Continue conversation with tool results
            openaiMessages.push(assistantMessage as OpenAI.Chat.Completions.ChatCompletionMessageParam);
            openaiMessages.push(...toolResults);

            response = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: openaiMessages,
                tools,
                tool_choice: "auto",
            });

            assistantMessage = response.choices[0].message;
        }

        // Save assistant response
        const responseContent = assistantMessage.content || "";
        await ctx.runMutation(api.conversations.saveMessage, {
            conversationId,
            role: "assistant",
            content: responseContent,
            toolCalls: toolCalls.length > 0 ? toolCalls : undefined,
        });

        return {
            conversationId,
            response: responseContent,
            toolCalls,
        };
    },
});
