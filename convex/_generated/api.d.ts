/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as agent from "../agent.js";
import type * as agentLogs from "../agentLogs.js";
import type * as brandPartners from "../brandPartners.js";
import type * as calendarEvents from "../calendarEvents.js";
import type * as clients from "../clients.js";
import type * as contacts from "../contacts.js";
import type * as contentIdeas from "../contentIdeas.js";
import type * as contentPlans from "../contentPlans.js";
import type * as context from "../context.js";
import type * as conversations from "../conversations.js";
import type * as expenses from "../expenses.js";
import type * as export_ from "../export.js";
import type * as goals from "../goals.js";
import type * as http from "../http.js";
import type * as initiatives from "../initiatives.js";
import type * as linkInitiativesToGoals from "../linkInitiativesToGoals.js";
import type * as operatingRules from "../operatingRules.js";
import type * as projects from "../projects.js";
import type * as quarterlyPlans from "../quarterlyPlans.js";
import type * as seed from "../seed.js";
import type * as seed2026Content from "../seed2026Content.js";
import type * as seed2026Goals from "../seed2026Goals.js";
import type * as seed2026ICP from "../seed2026ICP.js";
import type * as seed2026Master from "../seed2026Master.js";
import type * as seed2026Quarters from "../seed2026Quarters.js";
import type * as seed2026Rules from "../seed2026Rules.js";
import type * as seedCRM from "../seedCRM.js";
import type * as seedSOPs from "../seedSOPs.js";
import type * as sops from "../sops.js";
import type * as targetICP from "../targetICP.js";
import type * as todos from "../todos.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  agent: typeof agent;
  agentLogs: typeof agentLogs;
  brandPartners: typeof brandPartners;
  calendarEvents: typeof calendarEvents;
  clients: typeof clients;
  contacts: typeof contacts;
  contentIdeas: typeof contentIdeas;
  contentPlans: typeof contentPlans;
  context: typeof context;
  conversations: typeof conversations;
  expenses: typeof expenses;
  export: typeof export_;
  goals: typeof goals;
  http: typeof http;
  initiatives: typeof initiatives;
  linkInitiativesToGoals: typeof linkInitiativesToGoals;
  operatingRules: typeof operatingRules;
  projects: typeof projects;
  quarterlyPlans: typeof quarterlyPlans;
  seed: typeof seed;
  seed2026Content: typeof seed2026Content;
  seed2026Goals: typeof seed2026Goals;
  seed2026ICP: typeof seed2026ICP;
  seed2026Master: typeof seed2026Master;
  seed2026Quarters: typeof seed2026Quarters;
  seed2026Rules: typeof seed2026Rules;
  seedCRM: typeof seedCRM;
  seedSOPs: typeof seedSOPs;
  sops: typeof sops;
  targetICP: typeof targetICP;
  todos: typeof todos;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
