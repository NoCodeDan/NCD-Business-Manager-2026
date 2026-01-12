'use client';

import { useState, useRef, useEffect } from 'react';
import { useAgent } from '@/hooks/use-agent';

interface ToolCall {
    id: string;
    name: string;
    arguments: string;
    result?: string;
}

interface Message {
    _id: string;
    content: string;
    role: 'user' | 'assistant' | 'system';
    toolCalls?: ToolCall[];
}

interface ChatPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ChatPanel({ isOpen, onClose }: ChatPanelProps) {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const {
        messages,
        isLoading,
        error,
        sendMessage,
        startNewConversation,
    } = useAgent();

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Focus input when panel opens
    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus();
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const message = input.trim();
        setInput('');

        try {
            await sendMessage(message);
        } catch (err) {
            console.error('Failed to send message:', err);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="chat-panel-overlay" onClick={onClose}>
            <div className="chat-panel" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="chat-panel-header">
                    <div className="chat-panel-title">
                        <span className="chat-panel-icon">🤖</span>
                        <span>Assistant</span>
                    </div>
                    <div className="chat-panel-actions">
                        <button
                            className="btn-icon"
                            onClick={startNewConversation}
                            title="New conversation"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 5v14M5 12h14" />
                            </svg>
                        </button>
                        <button className="btn-icon" onClick={onClose}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 6 6 18M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Messages */}
                <div className="chat-messages">
                    {messages.length === 0 ? (
                        <div className="chat-welcome">
                            <div className="chat-welcome-icon">🤖</div>
                            <h3>How can I help?</h3>
                            <p>I can help you manage your SOPs, projects, expenses, and initiatives.</p>
                            <div className="chat-suggestions">
                                <button onClick={() => setInput("What's my current business overview?")}>
                                    📊 Business overview
                                </button>
                                <button onClick={() => setInput("Show me my active projects")}>
                                    📁 Active projects
                                </button>
                                <button onClick={() => setInput("What expenses are due soon?")}>
                                    💰 Upcoming expenses
                                </button>
                            </div>
                        </div>
                    ) : (
                        (messages as Message[]).map((message) => (
                            <div
                                key={message._id}
                                className={`chat-message chat-message-${message.role}`}
                            >
                                <div className="chat-message-content">
                                    {message.content}
                                </div>
                                {message.toolCalls && message.toolCalls.length > 0 && (
                                    <div className="chat-tool-calls">
                                        {message.toolCalls.map((tool: ToolCall) => (
                                            <div key={tool.id} className="chat-tool-call">
                                                <span className="chat-tool-icon">🔧</span>
                                                <span className="chat-tool-name">
                                                    {tool.name.replace(/_/g, ' ')}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))
                    )}

                    {isLoading && (
                        <div className="chat-message chat-message-assistant">
                            <div className="chat-typing">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="chat-error">
                            <span>⚠️</span> {error}
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form className="chat-input-form" onSubmit={handleSubmit}>
                    <input
                        ref={inputRef}
                        type="text"
                        className="chat-input"
                        placeholder="Ask me anything..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        className="chat-send-button"
                        disabled={!input.trim() || isLoading}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m22 2-7 20-4-9-9-4Z" />
                            <path d="M22 2 11 13" />
                        </svg>
                    </button>
                </form>
            </div>
        </div>
    );
}
