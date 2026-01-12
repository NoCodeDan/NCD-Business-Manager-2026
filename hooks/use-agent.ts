'use client';

import { useQuery, useAction, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";
import { useState, useCallback } from "react";

export function useAgent() {
    const [currentConversationId, setCurrentConversationId] = useState<Id<"conversations"> | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const conversations = useQuery(api.conversations.getConversations);
    const messages = useQuery(
        api.conversations.getMessages,
        currentConversationId ? { conversationId: currentConversationId } : "skip"
    );

    const sendMessageAction = useAction(api.agent.sendMessage);
    const deleteConversationMutation = useMutation(api.conversations.deleteConversation);

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

    return {
        // State
        currentConversationId,
        conversations: conversations ?? [],
        messages: messages ?? [],
        isLoading,
        error,

        // Actions
        sendMessage,
        selectConversation,
        startNewConversation,
        deleteConversation,
    };
}
