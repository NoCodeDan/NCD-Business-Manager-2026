'use client';

import { useState, useRef, useEffect } from 'react';
import { useAgent, Conversation } from '@/hooks/use-agent';
import { Id } from '@/convex/_generated/dataModel';

interface ChatHistorySidebarProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectConversation: (id: Id<"conversations">) => void;
}

export function ChatHistorySidebar({ isOpen, onClose, onSelectConversation }: ChatHistorySidebarProps) {
    const {
        pinnedConversations,
        regularConversations,
        filter,
        searchQuery,
        search,
        clearSearch,
        changeFilter,
        startNewConversation,
        currentConversationId,
    } = useAgent();

    const searchInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isOpen]);

    const handleConversationClick = (id: Id<"conversations">) => {
        onSelectConversation(id);
        onClose();
    };

    const handleNewChat = () => {
        startNewConversation();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="chat-history-overlay" onClick={onClose}>
            <div className="chat-history-sidebar" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="chat-history-header">
                    <h3>Chat History</h3>
                    <button className="btn-icon" onClick={onClose}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 6 6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Search */}
                <div className="chat-history-search">
                    <div className="search-input-wrapper">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.3-4.3" />
                        </svg>
                        <input
                            ref={searchInputRef}
                            type="text"
                            placeholder="Search conversations..."
                            value={searchQuery}
                            onChange={(e) => search(e.target.value)}
                            className="search-input"
                        />
                        {searchQuery && (
                            <button className="search-clear" onClick={clearSearch}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 6 6 18M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>

                {/* Filters */}
                <div className="chat-history-filters">
                    <button
                        className={`filter-chip ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => changeFilter('all')}
                    >
                        All
                    </button>
                    <button
                        className={`filter-chip ${filter === 'pinned' ? 'active' : ''}`}
                        onClick={() => changeFilter('pinned')}
                    >
                        📌 Pinned
                    </button>
                    <button
                        className={`filter-chip ${filter === 'starred' ? 'active' : ''}`}
                        onClick={() => changeFilter('starred')}
                    >
                        ⭐ Starred
                    </button>
                    <button
                        className={`filter-chip ${filter === 'archived' ? 'active' : ''}`}
                        onClick={() => changeFilter('archived')}
                    >
                        📦 Archived
                    </button>
                </div>

                {/* New Chat Button */}
                <button className="new-chat-button" onClick={handleNewChat}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 5v14M5 12h14" />
                    </svg>
                    New Chat
                </button>

                {/* Conversations List */}
                <div className="chat-history-list">
                    {/* Pinned Section */}
                    {pinnedConversations.length > 0 && (
                        <div className="conversation-section">
                            <div className="section-header">📌 Pinned</div>
                            {pinnedConversations.map((conv) => (
                                <ConversationItem
                                    key={conv._id}
                                    conversation={conv}
                                    isActive={currentConversationId === conv._id}
                                    onClick={() => handleConversationClick(conv._id)}
                                />
                            ))}
                        </div>
                    )}

                    {/* Recent Section */}
                    {regularConversations.length > 0 && (
                        <div className="conversation-section">
                            {pinnedConversations.length > 0 && (
                                <div className="section-header">Recent</div>
                            )}
                            {regularConversations.map((conv) => (
                                <ConversationItem
                                    key={conv._id}
                                    conversation={conv}
                                    isActive={currentConversationId === conv._id}
                                    onClick={() => handleConversationClick(conv._id)}
                                />
                            ))}
                        </div>
                    )}

                    {/* Empty State */}
                    {pinnedConversations.length === 0 && regularConversations.length === 0 && (
                        <div className="empty-state">
                            <div className="empty-icon">💬</div>
                            <p>No conversations yet</p>
                            <span>Start a new chat to get going!</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Individual Conversation Item
interface ConversationItemProps {
    conversation: Conversation;
    isActive: boolean;
    onClick: () => void;
}

function ConversationItem({ conversation, isActive, onClick }: ConversationItemProps) {
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const {
        pinConversation,
        archiveConversation,
        starConversation,
        deleteConversation,
    } = useAgent();

    // Close menu on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setShowMenu(false);
            }
        };
        if (showMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showMenu]);

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        setShowMenu(true);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    const handlePin = async (e: React.MouseEvent) => {
        e.stopPropagation();
        await pinConversation(conversation._id, !conversation.isPinned);
        setShowMenu(false);
    };

    const handleStar = async (e: React.MouseEvent) => {
        e.stopPropagation();
        await starConversation(conversation._id, !conversation.isStarred);
        setShowMenu(false);
    };

    const handleArchive = async (e: React.MouseEvent) => {
        e.stopPropagation();
        await archiveConversation(conversation._id, !conversation.isArchived);
        setShowMenu(false);
    };

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm('Delete this conversation? This cannot be undone.')) {
            await deleteConversation(conversation._id);
        }
        setShowMenu(false);
    };

    return (
        <div
            className={`conversation-item ${isActive ? 'active' : ''}`}
            onClick={onClick}
            onContextMenu={handleContextMenu}
        >
            <div className="conversation-content">
                <div className="conversation-title">
                    {conversation.isStarred && <span className="star-indicator">⭐</span>}
                    {conversation.title || 'New conversation'}
                </div>
                <div className="conversation-meta">
                    <span className="conversation-date">
                        {formatDate(conversation.lastMessageAt || conversation.updatedAt)}
                    </span>
                    {conversation.messageCount && conversation.messageCount > 0 && (
                        <span className="message-count">
                            {conversation.messageCount} messages
                        </span>
                    )}
                </div>
                {conversation.summary && (
                    <div className="conversation-summary">{conversation.summary}</div>
                )}
            </div>

            {/* Action Menu Button */}
            <button
                className="conversation-menu-btn"
                onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="1" />
                    <circle cx="12" cy="5" r="1" />
                    <circle cx="12" cy="19" r="1" />
                </svg>
            </button>

            {/* Context Menu */}
            {showMenu && (
                <div className="conversation-menu" ref={menuRef}>
                    <button onClick={handlePin}>
                        {conversation.isPinned ? '📌 Unpin' : '📌 Pin'}
                    </button>
                    <button onClick={handleStar}>
                        {conversation.isStarred ? '⭐ Unstar' : '⭐ Star'}
                    </button>
                    <button onClick={handleArchive}>
                        {conversation.isArchived ? '📦 Unarchive' : '📦 Archive'}
                    </button>
                    <div className="menu-divider" />
                    <button className="danger" onClick={handleDelete}>
                        🗑️ Delete
                    </button>
                </div>
            )}
        </div>
    );
}
