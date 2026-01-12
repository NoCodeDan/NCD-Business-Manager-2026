"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import { api } from "./_generated/api";
import OpenAI from "openai";

// Tool definitions for the agent
const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
    // Context
    {
        type: "function",
        function: {
            name: "get_context",
            description: "Get an overview of the current app state including counts of SOPs, projects, todos, calendar events, content ideas, and recent activity",
            parameters: { type: "object", properties: {}, required: [] },
        },
    },

    // ==========================================
    // TODO TOOLS
    // ==========================================
    {
        type: "function",
        function: {
            name: "list_todos",
            description: "List all todos/tasks. Returns pending and completed tasks with their priorities.",
            parameters: { type: "object", properties: {}, required: [] },
        },
    },
    {
        type: "function",
        function: {
            name: "create_todo",
            description: "Create a new todo/task item",
            parameters: {
                type: "object",
                properties: {
                    title: { type: "string", description: "Title of the todo" },
                    priority: { type: "string", enum: ["low", "medium", "high"], description: "Priority level (default: medium)" },
                    dueDate: { type: "string", description: "Due date in ISO format (YYYY-MM-DD) - optional" },
                },
                required: ["title"],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "toggle_todo",
            description: "Mark a todo as complete or incomplete",
            parameters: {
                type: "object",
                properties: {
                    todoId: { type: "string", description: "ID of the todo to toggle" },
                },
                required: ["todoId"],
            },
        },
    },

    // ==========================================
    // CALENDAR TOOLS
    // ==========================================
    {
        type: "function",
        function: {
            name: "list_calendar_events",
            description: "List upcoming calendar events for the next 7 days",
            parameters: { type: "object", properties: {}, required: [] },
        },
    },
    {
        type: "function",
        function: {
            name: "get_today_events",
            description: "Get all calendar events for today",
            parameters: { type: "object", properties: {}, required: [] },
        },
    },
    {
        type: "function",
        function: {
            name: "create_calendar_event",
            description: "Create a new calendar event",
            parameters: {
                type: "object",
                properties: {
                    title: { type: "string", description: "Title of the event" },
                    startDate: { type: "string", description: "Start date/time in ISO format (e.g., 2026-01-15T14:00:00)" },
                    endDate: { type: "string", description: "End date/time in ISO format (optional)" },
                    description: { type: "string", description: "Event description (optional)" },
                    location: { type: "string", description: "Event location (optional)" },
                    allDay: { type: "boolean", description: "Whether this is an all-day event (default: false)" },
                },
                required: ["title", "startDate"],
            },
        },
    },

    // ==========================================
    // CONTENT IDEAS TOOLS
    // ==========================================
    {
        type: "function",
        function: {
            name: "list_content_ideas",
            description: "List all active content ideas (not archived or published)",
            parameters: { type: "object", properties: {}, required: [] },
        },
    },
    {
        type: "function",
        function: {
            name: "create_content_idea",
            description: "Create a new content idea for future creation",
            parameters: {
                type: "object",
                properties: {
                    title: { type: "string", description: "Title of the content idea" },
                    description: { type: "string", description: "Description or notes about the idea" },
                    type: { type: "string", enum: ["blog", "youtube", "short-form", "twitter", "linkedin", "newsletter", "other"], description: "Type of content (default: other)" },
                    priority: { type: "string", enum: ["low", "medium", "high"], description: "Priority level" },
                    tags: { type: "array", items: { type: "string" }, description: "Tags for categorization" },
                },
                required: ["title"],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "search_content_ideas",
            description: "Search content ideas by keyword, type, or status",
            parameters: {
                type: "object",
                properties: {
                    query: { type: "string", description: "Search query" },
                    type: { type: "string", enum: ["blog", "youtube", "short-form", "twitter", "linkedin", "newsletter", "other"], description: "Filter by type" },
                    status: { type: "string", enum: ["brainstorm", "researching", "outlined", "drafted", "published", "archived"], description: "Filter by status" },
                },
            },
        },
    },

    // ==========================================
    // SOP TOOLS
    // ==========================================
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
                    content: { type: "string", description: "Content/steps of the SOP in markdown format" },
                    category: { type: "string", description: "Category (Operations, Marketing, Finance, Client Management, Content, Other)" },
                    tags: { type: "array", items: { type: "string" }, description: "Tags for the SOP" },
                },
                required: ["title", "content", "category"],
            },
        },
    },

    // ==========================================
    // PROJECT TOOLS
    // ==========================================
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
                    status: { type: "string", enum: ["active", "paused", "completed", "archived"], description: "Initial status (default: active)" },
                    deadline: { type: "string", description: "Deadline in ISO format (optional)" },
                },
                required: ["name", "description"],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "add_project_task",
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

    // ==========================================
    // EXPENSE TOOLS
    // ==========================================
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
                },
            },
        },
    },

    // ==========================================
    // INITIATIVE TOOLS
    // ==========================================
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
const SYSTEM_PROMPT = `You are Dan's personal business management assistant for the NCD Business Manager app.

You have access to a comprehensive set of tools to help manage:
- **Todos**: Create tasks, mark them complete, track what needs to be done
- **Calendar**: View and create events, check today's schedule
- **Content Ideas**: Brainstorm and track content ideas for blogs, YouTube, social media
- **SOPs**: Standard Operating Procedures - find or create process documentation
- **Projects**: Track projects with tasks and progress
- **Expenses**: View and search recurring business expenses
- **Initiatives**: Business goals and KPIs

When users ask questions, use the appropriate tools to get information. Be helpful, concise, and proactive.
When creating items, confirm what you created with the details.
When searching, summarize results clearly.

For dates, use ISO format (YYYY-MM-DD or YYYY-MM-DDTHH:MM:SS).
Current date: ${new Date().toISOString().split('T')[0]}`;

// Execute a tool call
async function executeTool(
    ctx: any,
    toolName: string,
    args: Record<string, any>
): Promise<string> {
    try {
        switch (toolName) {
            // Context
            case "get_context": {
                const context = await ctx.runQuery(api.context.getContext);
                return JSON.stringify(context, null, 2);
            }

            // ==========================================
            // TODO HANDLERS
            // ==========================================
            case "list_todos": {
                const todos = await ctx.runQuery(api.todos.get);
                const pending = todos.filter((t: any) => !t.completed);
                const completed = todos.filter((t: any) => t.completed);
                return JSON.stringify({
                    summary: `${pending.length} pending, ${completed.length} completed`,
                    pending: pending.map((t: any) => ({
                        id: t._id,
                        title: t.title,
                        priority: t.priority,
                        dueDate: t.dueDate,
                    })),
                    completed: completed.slice(0, 5).map((t: any) => ({
                        id: t._id,
                        title: t.title,
                    })),
                }, null, 2);
            }
            case "create_todo": {
                const id = await ctx.runMutation(api.todos.create, {
                    title: args.title,
                    priority: args.priority,
                    dueDate: args.dueDate,
                });
                return JSON.stringify({ success: true, id, message: `Created todo: "${args.title}"` });
            }
            case "toggle_todo": {
                await ctx.runMutation(api.todos.toggle, { id: args.todoId });
                return JSON.stringify({ success: true, message: "Todo toggled" });
            }

            // ==========================================
            // CALENDAR HANDLERS
            // ==========================================
            case "list_calendar_events": {
                const events = await ctx.runQuery(api.calendarEvents.getUpcoming);
                return JSON.stringify({
                    count: events.length,
                    events: events.map((e: any) => ({
                        id: e._id,
                        title: e.title,
                        startDate: e.startDate,
                        endDate: e.endDate,
                        location: e.location,
                        allDay: e.allDay,
                    })),
                }, null, 2);
            }
            case "get_today_events": {
                const events = await ctx.runQuery(api.calendarEvents.getToday);
                return JSON.stringify({
                    count: events.length,
                    events: events.map((e: any) => ({
                        id: e._id,
                        title: e.title,
                        startDate: e.startDate,
                        endDate: e.endDate,
                        location: e.location,
                    })),
                }, null, 2);
            }
            case "create_calendar_event": {
                const id = await ctx.runMutation(api.calendarEvents.create, {
                    title: args.title,
                    startDate: args.startDate,
                    endDate: args.endDate,
                    description: args.description,
                    location: args.location,
                    allDay: args.allDay,
                });
                return JSON.stringify({
                    success: true,
                    id,
                    message: `Created event: "${args.title}" on ${args.startDate}`
                });
            }

            // ==========================================
            // CONTENT IDEAS HANDLERS
            // ==========================================
            case "list_content_ideas": {
                const ideas = await ctx.runQuery(api.contentIdeas.getActive);
                return JSON.stringify({
                    count: ideas.length,
                    ideas: ideas.map((i: any) => ({
                        id: i._id,
                        title: i.title,
                        type: i.type,
                        status: i.status,
                        priority: i.priority,
                        tags: i.tags,
                    })),
                }, null, 2);
            }
            case "create_content_idea": {
                const id = await ctx.runMutation(api.contentIdeas.create, {
                    title: args.title,
                    description: args.description,
                    type: args.type,
                    priority: args.priority,
                    tags: args.tags,
                });
                return JSON.stringify({
                    success: true,
                    id,
                    message: `Created content idea: "${args.title}"`
                });
            }
            case "search_content_ideas": {
                const ideas = await ctx.runQuery(api.contentIdeas.search, {
                    query: args.query,
                    type: args.type,
                    status: args.status,
                });
                return JSON.stringify({
                    count: ideas.length,
                    ideas: ideas.map((i: any) => ({
                        id: i._id,
                        title: i.title,
                        type: i.type,
                        status: i.status,
                    })),
                }, null, 2);
            }

            // ==========================================
            // SOP HANDLERS
            // ==========================================
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
                return JSON.stringify({ success: true, id, message: `Created SOP: "${args.title}"` });
            }

            // ==========================================
            // PROJECT HANDLERS
            // ==========================================
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
                return JSON.stringify({ success: true, id, message: `Created project: "${args.name}"` });
            }
            case "add_project_task": {
                const task = await ctx.runMutation(api.projects.addTask, {
                    projectId: args.projectId,
                    taskTitle: args.taskTitle,
                });
                return JSON.stringify({ success: true, task, message: `Added task: "${args.taskTitle}"` });
            }

            // ==========================================
            // EXPENSE HANDLERS
            // ==========================================
            case "list_expenses": {
                const expenses = await ctx.runQuery(api.expenses.get);
                const monthlyTotal = expenses.reduce((sum: number, e: any) => {
                    return sum + (e.billingCycle === "monthly" ? e.amount : e.amount / 12);
                }, 0);
                return JSON.stringify({
                    count: expenses.length,
                    monthlyTotal: Math.round(monthlyTotal * 100) / 100,
                    expenses: expenses.map((e: any) => ({
                        id: e._id,
                        name: e.name,
                        amount: e.amount,
                        billingCycle: e.billingCycle,
                        category: e.category,
                    })),
                }, null, 2);
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

            // ==========================================
            // INITIATIVE HANDLERS
            // ==========================================
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
