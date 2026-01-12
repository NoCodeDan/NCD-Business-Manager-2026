'use client';

import { useState, useRef, useEffect } from 'react';
import { useAgent, Message } from '@/hooks/use-agent';
import { ChatHistorySidebar } from './ChatHistorySidebar';
import { Id } from '@/convex/_generated/dataModel';

interface ChatPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ChatPanel({ isOpen, onClose }: ChatPanelProps) {
    const [input, setInput] = useState('');
    const [editingMessageId, setEditingMessageId] = useState<Id<"messages"> | null>(null);
    const [editContent, setEditContent] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const {
        messages,
        isLoading,
        error,
        sendMessage,
        startNewConversation,
        showHistory,
        toggleHistory,
        closeHistory,
        selectConversation,
        currentConversation,
        editMessage,
        deleteMessage,
    } = useAgent();

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Focus input when panel opens
    useEffect(() => {
        if (isOpen && !showHistory) {
            inputRef.current?.focus();
        }
    }, [isOpen, showHistory]);

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

    const handleEditStart = (message: Message) => {
        setEditingMessageId(message._id);
        setEditContent(message.content);
    };

    const handleEditSave = async () => {
        if (!editingMessageId || !editContent.trim()) return;

        try {
            await editMessage(editingMessageId, editContent.trim());
            setEditingMessageId(null);
            setEditContent('');
        } catch (err) {
            console.error('Failed to edit message:', err);
        }
    };

    const handleEditCancel = () => {
        setEditingMessageId(null);
        setEditContent('');
    };

    const handleDelete = async (messageId: Id<"messages">) => {
        if (confirm('Delete this message?')) {
            try {
                await deleteMessage(messageId);
            } catch (err) {
                console.error('Failed to delete message:', err);
            }
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="chat-panel-overlay" onClick={onClose}>
                <div className="chat-panel" onClick={(e) => e.stopPropagation()}>
                    {/* Header */}
                    <div className="chat-panel-header">
                        <div className="chat-panel-title">
                            <button
                                className="btn-icon history-btn"
                                onClick={toggleHistory}
                                title="Chat history"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                                    <path d="M3 3v5h5" />
                                    <path d="M12 7v5l4 2" />
                                </svg>
                            </button>
                            <span className="chat-panel-icon">🤖</span>
                            <span className="chat-title-text">
                                {currentConversation?.title || 'Assistant'}
                            </span>
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
                            messages.map((message) => (
                                <div
                                    key={message._id}
                                    className={`chat-message chat-message-${message.role} ${message.isDeleted ? 'deleted' : ''}`}
                                >
                                    {editingMessageId === message._id ? (
                                        <div className="message-edit-form">
                                            <input
                                                type="text"
                                                value={editContent}
                                                onChange={(e) => setEditContent(e.target.value)}
                                                className="edit-input"
                                                autoFocus
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') handleEditSave();
                                                    if (e.key === 'Escape') handleEditCancel();
                                                }}
                                            />
                                            <div className="edit-actions">
                                                <button className="edit-save" onClick={handleEditSave}>Save</button>
                                                <button className="edit-cancel" onClick={handleEditCancel}>Cancel</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="chat-message-content">
                                                {message.isDeleted ? (
                                                    <span className="deleted-text">[Message deleted]</span>
                                                ) : (
                                                    message.content
                                                )}
                                                {message.isEdited && !message.isDeleted && (
                                                    <span className="edited-indicator">(edited)</span>
                                                )}
                                            </div>

                                            {/* Message Actions for user messages */}
                                            {message.role === 'user' && !message.isDeleted && (
                                                <div className="message-actions">
                                                    <button
                                                        className="action-btn"
                                                        onClick={() => handleEditStart(message)}
                                                        title="Edit"
                                                    >
                                                        ✏️
                                                    </button>
                                                    <button
                                                        className="action-btn"
                                                        onClick={() => handleDelete(message._id)}
                                                        title="Delete"
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            )}

                                            {/* Tool Calls */}
                                            {message.toolCalls && message.toolCalls.length > 0 && (
                                                <div className="chat-tool-calls">
                                                    {message.toolCalls.map((tool) => (
                                                        <ToolCallBadge key={tool.id} tool={tool} />
                                                    ))}
                                                </div>
                                            )}
                                        </>
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

            {/* History Sidebar */}
            <ChatHistorySidebar
                isOpen={showHistory}
                onClose={closeHistory}
                onSelectConversation={selectConversation}
            />
        </>
    );
}

// Tool Call Badge Component
interface ToolCallBadgeProps {
    tool: {
        id: string;
        name: string;
        arguments: string;
        result?: string;
    };
}

function ToolCallBadge({ tool }: ToolCallBadgeProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const formatToolName = (name: string) => {
        return name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    return (
        <div className={`chat-tool-call ${isExpanded ? 'expanded' : ''}`}>
            <button
                className="tool-call-header"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <span className="chat-tool-icon">🔧</span>
                <span className="chat-tool-name">{formatToolName(tool.name)}</span>
                <span className="tool-expand-icon">{isExpanded ? '▼' : '▶'}</span>
            </button>

            {isExpanded && (
                <div className="tool-call-details">
                    <div className="tool-section">
                        <div className="tool-label">Arguments:</div>
                        <pre className="tool-code">{JSON.stringify(JSON.parse(tool.arguments), null, 2)}</pre>
                    </div>
                    {tool.result && (
                        <div className="tool-section">
                            <div className="tool-label">Result:</div>
                            <pre className="tool-code">{tool.result.slice(0, 500)}{tool.result.length > 500 ? '...' : ''}</pre>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

