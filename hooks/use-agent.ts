'use client';

import { useQuery, useAction, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";
import { useState, useCallback, useMemo } from "react";

// Types for the hook
export type ConversationFilter = "all" | "pinned" | "archived" | "starred" | "active" | "resolved" | "pending";
export type ConversationStatus = "active" | "resolved" | "pending";

export interface Conversation {
    _id: Id<"conversations">;
    title?: string;
    summary?: string;
    isPinned?: boolean;
    isArchived?: boolean;
    isStarred?: boolean;
    status?: ConversationStatus;
    tags?: string[];
    lastMessageAt?: string;
    messageCount?: number;
    createdAt: string;
    updatedAt: string;
}

export interface Message {
    _id: Id<"messages">;
    conversationId: Id<"conversations">;
    role: "user" | "assistant" | "system";
    content: string;
    contentType?: "text" | "markdown" | "code" | "image" | "file";
    isEdited?: boolean;
    editedAt?: string;
    isDeleted?: boolean;
    toolCalls?: {
        id: string;
        name: string;
        arguments: string;
        result?: string;
    }[];
    attachments?: {
        id: string;
        type: "image" | "file" | "link";
        url: string;
        name?: string;
        mimeType?: string;
        size?: number;
    }[];
    createdAt: string;
}

export function useAgent() {
    // State
    const [currentConversationId, setCurrentConversationId] = useState<Id<"conversations"> | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<ConversationFilter>("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [showHistory, setShowHistory] = useState(false);

    // Queries
    const conversations = useQuery(
        api.conversations.getFilteredConversations,
        { filter }
    ) as Conversation[] | undefined;

    const searchResults = useQuery(
        api.conversations.searchConversations,
        searchQuery.trim() ? { query: searchQuery } : "skip"
    ) as Conversation[] | undefined;

    const messages = useQuery(
        api.conversations.getMessages,
        currentConversationId ? { conversationId: currentConversationId } : "skip"
    ) as Message[] | undefined;

    const currentConversation = useQuery(
        api.conversations.getConversation,
        currentConversationId ? { conversationId: currentConversationId } : "skip"
    ) as Conversation | undefined;

    // Actions & Mutations
    const sendMessageAction = useAction(api.agent.sendMessage);
    const deleteConversationMutation = useMutation(api.conversations.deleteConversation);
    const updateConversationMutation = useMutation(api.conversations.updateConversation);
    const editMessageMutation = useMutation(api.conversations.editMessage);
    const deleteMessageMutation = useMutation(api.conversations.deleteMessage);
    const archiveOldMutation = useMutation(api.conversations.archiveOldConversations);

    // Computed values
    const displayedConversations = useMemo(() => {
        if (searchQuery.trim() && searchResults) {
            return searchResults;
        }
        return conversations ?? [];
    }, [searchQuery, searchResults, conversations]);

    const pinnedConversations = useMemo(() => {
        return displayedConversations.filter(c => c.isPinned);
    }, [displayedConversations]);

    const regularConversations = useMemo(() => {
        return displayedConversations.filter(c => !c.isPinned);
    }, [displayedConversations]);

    // ==================== MESSAGING ====================

    const sendMessage = useCallback(async (message: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await sendMessageAction({
                conversationId: currentConversationId ?? undefined,
                message,
            });

            // Set the conversation ID if this is a new conversation
            if (!currentConversationId && result.conversationId) {
                setCurrentConversationId(result.conversationId as Id<"conversations">);
            }

            return result;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to send message";
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [currentConversationId, sendMessageAction]);

    const editMessage = useCallback(async (messageId: Id<"messages">, content: string) => {
        try {
            await editMessageMutation({ messageId, content });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to edit message";
            setError(errorMessage);
            throw err;
        }
    }, [editMessageMutation]);

    const deleteMessage = useCallback(async (messageId: Id<"messages">) => {
        try {
            await deleteMessageMutation({ messageId });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to delete message";
            setError(errorMessage);
            throw err;
        }
    }, [deleteMessageMutation]);

    // ==================== CONVERSATION MANAGEMENT ====================

    const selectConversation = useCallback((conversationId: Id<"conversations"> | null) => {
        setCurrentConversationId(conversationId);
        setError(null);
    }, []);

    const startNewConversation = useCallback(() => {
        setCurrentConversationId(null);
        setError(null);
    }, []);

    const deleteConversation = useCallback(async (conversationId: Id<"conversations">) => {
        await deleteConversationMutation({ conversationId });
        if (currentConversationId === conversationId) {
            setCurrentConversationId(null);
        }
    }, [currentConversationId, deleteConversationMutation]);

    const renameConversation = useCallback(async (conversationId: Id<"conversations">, title: string) => {
        await updateConversationMutation({ conversationId, title });
    }, [updateConversationMutation]);

    // ==================== PIN / ARCHIVE / STAR ====================

    const pinConversation = useCallback(async (conversationId: Id<"conversations">, isPinned: boolean) => {
        await updateConversationMutation({ conversationId, isPinned });
    }, [updateConversationMutation]);

    const archiveConversation = useCallback(async (conversationId: Id<"conversations">, isArchived: boolean = true) => {
        await updateConversationMutation({ conversationId, isArchived });
        // If archiving the current conversation, clear it
        if (isArchived && currentConversationId === conversationId) {
            setCurrentConversationId(null);
        }
    }, [currentConversationId, updateConversationMutation]);

    const starConversation = useCallback(async (conversationId: Id<"conversations">, isStarred: boolean) => {
        await updateConversationMutation({ conversationId, isStarred });
    }, [updateConversationMutation]);

    const setConversationStatus = useCallback(async (conversationId: Id<"conversations">, status: ConversationStatus) => {
        await updateConversationMutation({ conversationId, status });
    }, [updateConversationMutation]);

    const setConversationTags = useCallback(async (conversationId: Id<"conversations">, tags: string[]) => {
        await updateConversationMutation({ conversationId, tags });
    }, [updateConversationMutation]);

    // ==================== BULK OPERATIONS ====================

    const archiveOldConversations = useCallback(async (olderThanDays: number) => {
        return await archiveOldMutation({ olderThanDays });
    }, [archiveOldMutation]);

    // ==================== SEARCH & FILTER ====================

    const search = useCallback((query: string) => {
        setSearchQuery(query);
    }, []);

    const clearSearch = useCallback(() => {
        setSearchQuery("");
    }, []);

    const changeFilter = useCallback((newFilter: ConversationFilter) => {
        setFilter(newFilter);
        setSearchQuery(""); // Clear search when changing filter
    }, []);

    // ==================== HISTORY PANEL ====================

    const toggleHistory = useCallback(() => {
        setShowHistory(prev => !prev);
    }, []);

    const openHistory = useCallback(() => {
        setShowHistory(true);
    }, []);

    const closeHistory = useCallback(() => {
        setShowHistory(false);
    }, []);

    return {
        // State
        currentConversationId,
        currentConversation,
        conversations: displayedConversations,
        pinnedConversations,
        regularConversations,
        messages: messages ?? [],
        isLoading,
        error,
        filter,
        searchQuery,
        showHistory,

        // Messaging
        sendMessage,
        editMessage,
        deleteMessage,

        // Conversation Management
        selectConversation,
        startNewConversation,
        deleteConversation,
        renameConversation,

        // Organization
        pinConversation,
        archiveConversation,
        starConversation,
        setConversationStatus,
        setConversationTags,

        // Bulk Operations
        archiveOldConversations,

        // Search & Filter
        search,
        clearSearch,
        changeFilter,

        // History Panel
        toggleHistory,
        openHistory,
        closeHistory,
    };
}

