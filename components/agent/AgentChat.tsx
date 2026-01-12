'use client';

import { useState } from 'react';
import { ChatButton } from './ChatButton';
import { ChatPanel } from './ChatPanel';

export function AgentChat() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <ChatButton onClick={() => setIsOpen(true)} />
            <ChatPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </>
    );
}
