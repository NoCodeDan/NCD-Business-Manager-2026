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
import type * as context from "../context.js";
import type * as conversations from "../conversations.js";
import type * as expenses from "../expenses.js";
import type * as export_ from "../export.js";
import type * as http from "../http.js";
import type * as initiatives from "../initiatives.js";
import type * as projects from "../projects.js";
import type * as seed from "../seed.js";
import type * as sops from "../sops.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  agent: typeof agent;
  agentLogs: typeof agentLogs;
  context: typeof context;
  conversations: typeof conversations;
  expenses: typeof expenses;
  export: typeof export_;
  http: typeof http;
  initiatives: typeof initiatives;
  projects: typeof projects;
  seed: typeof seed;
  sops: typeof sops;
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
