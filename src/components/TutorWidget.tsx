import { useState, useRef, useEffect } from 'react'
import { Bot, Send, X, Sparkles, Loader2 } from 'lucide-react'
import { askTutor, isDemoAI } from '../lib/ai'

interface Message {
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
}

interface Props {
    blockContent: string
    courseTitle: string
}

export function TutorWidget({ blockContent, courseTitle }: Props) {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content: `Hola 👋 Soy tu tutor de **${courseTitle}**. Puedes preguntarme cualquier duda sobre el contenido de este bloque.${isDemoAI ? '\n\n*(Modo demo — en producción responderé con IA real)*' : ''}`,
            timestamp: new Date(),
        },
    ])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const bottomRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (isOpen) bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, isOpen])

    const sendMessage = async () => {
        const question = input.trim()
        if (!question || loading) return

        const userMsg: Message = { role: 'user', content: question, timestamp: new Date() }
        setMessages((m) => [...m, userMsg])
        setInput('')
        setLoading(true)

        try {
            const answer = await askTutor(question, blockContent, courseTitle)
            setMessages((m) => [...m, { role: 'assistant', content: answer, timestamp: new Date() }])
        } catch {
            setMessages((m) => [...m, {
                role: 'assistant',
                content: 'Lo siento, hubo un problema al conectar con el tutor. Por favor intenta de nuevo.',
                timestamp: new Date(),
            }])
        } finally {
            setLoading(false)
        }
    }

    const handleKey = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            sendMessage()
        }
    }

    // Simple markdown bold renderer
    const renderText = (text: string) => {
        const parts = text.split(/(\*\*[^*]+\*\*)/g)
        return parts.map((part, i) =>
            part.startsWith('**') && part.endsWith('**')
                ? <strong key={i}>{part.slice(2, -2)}</strong>
                : part.includes('\n')
                    ? part.split('\n').map((line, j) => <span key={`${i}-${j}`}>{line}{j < part.split('\n').length - 1 && <br />}</span>)
                    : <span key={i}>{part}</span>
        )
    }

    return (
        <>
            {/* Floating button */}
            <div className="fixed bottom-6 right-6 z-50">
                {!isOpen && (
                    <button
                        onClick={() => setIsOpen(true)}
                        className="group flex items-center gap-2 bg-cobalt text-white px-4 py-3 rounded-2xl shadow-lg hover:bg-cobalt-light transition-all hover:scale-105 active:scale-95"
                    >
                        <Bot className="w-5 h-5" />
                        <span className="text-sm font-medium">Tutor IA</span>
                        <Sparkles className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
                    </button>
                )}
            </div>

            {/* Chat panel */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 z-50 w-[360px] max-h-[560px] flex flex-col bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-graphite/8 overflow-hidden">
                    {/* Header */}
                    <div className="bg-cobalt px-4 py-3 flex items-center justify-between flex-shrink-0">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                                <Bot className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <div className="text-white text-sm font-medium leading-none">Tutor Virtual</div>
                                <div className="text-white/50 text-xs mt-0.5 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block" />
                                    {isDemoAI ? 'Modo demo' : 'Conectado'}
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white transition-colors p-1">
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.role === 'assistant' && (
                                    <div className="w-6 h-6 bg-cobalt/10 rounded-full flex items-center justify-center mr-2 mt-1 flex-shrink-0">
                                        <Bot className="w-3.5 h-3.5 text-cobalt" />
                                    </div>
                                )}
                                <div
                                    className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                                            ? 'bg-cobalt text-white rounded-br-sm'
                                            : 'bg-cream text-graphite rounded-bl-sm'
                                        }`}
                                >
                                    {renderText(msg.content)}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-cobalt/10 rounded-full flex items-center justify-center">
                                    <Bot className="w-3.5 h-3.5 text-cobalt" />
                                </div>
                                <div className="bg-cream px-3.5 py-2.5 rounded-2xl rounded-bl-sm flex items-center gap-2">
                                    <Loader2 className="w-3.5 h-3.5 text-cobalt animate-spin" />
                                    <span className="text-xs text-graphite/40">Pensando...</span>
                                </div>
                            </div>
                        )}
                        <div ref={bottomRef} />
                    </div>

                    {/* Input */}
                    <div className="p-3 border-t border-graphite/5 flex-shrink-0">
                        <div className="flex gap-2 items-end">
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKey}
                                placeholder="Escribe tu pregunta..."
                                rows={1}
                                className="flex-1 px-3.5 py-2.5 rounded-xl bg-cream border border-graphite/10 text-sm text-graphite focus:outline-none focus:ring-2 focus:ring-cobalt/30 focus:border-cobalt transition-all resize-none placeholder:text-graphite/30"
                                style={{ maxHeight: 96 }}
                            />
                            <button
                                onClick={sendMessage}
                                disabled={!input.trim() || loading}
                                className="w-9 h-9 bg-cobalt text-white rounded-xl flex items-center justify-center hover:bg-cobalt-light transition-all disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
                            >
                                <Send className="w-3.5 h-3.5" />
                            </button>
                        </div>
                        <p className="text-[10px] text-graphite/25 text-center mt-1.5 font-mono">Enter para enviar · Shift+Enter para nueva línea</p>
                    </div>
                </div>
            )}
        </>
    )
}
