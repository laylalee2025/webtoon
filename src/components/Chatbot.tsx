'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2, Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content: '안녕하세요! 취향에 맞는 웹툰을 찾아드릴게요. 어떤 장르나 스토리를 좋아하시나요?',
        },
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMessage }),
            });

            if (!response.ok) {
                throw new Error('Failed to get response');
            }

            const data = await response.json();
            setMessages((prev) => [
                ...prev,
                { role: 'assistant', content: data.reply },
            ]);
        } catch (error) {
            console.error('Chat error:', error);
            setMessages((prev) => [
                ...prev,
                {
                    role: 'assistant',
                    content: '죄송합니다. 오류가 발생했어요. 다시 시도해주세요.',
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Floating Action Button */}
            <button
                onClick={() => setIsOpen(true)}
                className={`fixed bottom-6 right-6 p-4 rounded-full bg-primary text-white shadow-lg transition-transform duration-300 hover:scale-110 z-50 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
                    }`}
                aria-label="Open chat"
            >
                <MessageSquare size={24} />
            </button>

            {/* Chat Window */}
            <div
                className={`fixed bottom-6 right-6 w-[350px] sm:w-[400px] h-[600px] max-h-[80vh] flex flex-col z-50 transition-all duration-300 origin-bottom-right ${isOpen
                    ? 'scale-100 opacity-100 translate-y-0'
                    : 'scale-90 opacity-0 pointer-events-none translate-y-10'
                    }`}
            >
                <div className="flex-1 glass-panel rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-white/10">
                    {/* Header */}
                    <div className="p-4 bg-secondary/80 backdrop-blur border-b border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-white font-semibold">
                            <Bot className="text-primary" size={20} />
                            웹툰 추천 챗봇
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-1 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''
                                    }`}
                            >
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user'
                                        ? 'bg-primary/20 text-primary'
                                        : 'bg-white/10 text-white'
                                        }`}
                                >
                                    {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                                </div>
                                <div
                                    className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                                        ? 'bg-primary text-white rounded-tr-sm'
                                        : 'bg-white/5 text-gray-200 rounded-tl-sm border border-white/5'
                                        }`}
                                >
                                    {msg.role === 'assistant' ? (
                                        <div className="flex flex-col gap-3">
                                            {(() => {
                                                try {
                                                    // Attempt to parse AI response as JSON
                                                    const parsedData = JSON.parse(msg.content);
                                                    if (Array.isArray(parsedData)) {
                                                        return parsedData.map((item, i) => {
                                                            if (item.type === 'text') {
                                                                return <div key={i} className="prose prose-invert prose-sm"><ReactMarkdown>{item.content}</ReactMarkdown></div>;
                                                            } else if (item.type === 'webtoon') {
                                                                return (
                                                                    <a key={i} href={item.link} target="_blank" rel="noopener noreferrer" className="block bg-black/40 border border-white/10 rounded-xl overflow-hidden hover:border-primary/50 transition-colors group">
                                                                        <div className="aspect-[16/9] sm:aspect-video w-full relative bg-gray-900 overflow-hidden">
                                                                            <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                                        </div>
                                                                        <div className="p-3">
                                                                            <h4 className="font-bold text-white text-base mb-1 group-hover:text-primary transition-colors">{item.title}</h4>
                                                                            <p className="text-xs text-gray-400 mb-2">{item.author}</p>
                                                                            <p className="text-xs text-gray-300 line-clamp-3">{item.reason}</p>
                                                                        </div>
                                                                    </a>
                                                                );
                                                            }
                                                            return null;
                                                        });
                                                    }
                                                } catch (e) {
                                                    // Fallback to normal markdown if parsing fails
                                                    return (
                                                        <div className="prose prose-invert prose-sm prose-a:text-primary prose-a:font-semibold hover:prose-a:underline">
                                                            <ReactMarkdown components={{ a: ({ node, ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" /> }}>
                                                                {msg.content}
                                                            </ReactMarkdown>
                                                        </div>
                                                    );
                                                }
                                            })()}
                                        </div>
                                    ) : (
                                        msg.content
                                    )}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center shrink-0">
                                    <Bot size={16} />
                                </div>
                                <div className="bg-white/5 border border-white/5 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" />
                                    <span
                                        className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                                        style={{ animationDelay: '150ms' }}
                                    />
                                    <span
                                        className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                                        style={{ animationDelay: '300ms' }}
                                    />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-secondary/80 backdrop-blur border-t border-white/5">
                        <form onSubmit={handleSubmit} className="flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="어떤 웹툰을 찾으시나요?"
                                className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-gray-500"
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || isLoading}
                                className="p-3 bg-primary text-white rounded-full hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                            >
                                {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
