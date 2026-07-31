'use client'
import DashboardLayout from '@/components/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MessageSquare, Send, Bot, User } from 'lucide-react'
import { useState } from 'react'
import { useSearchAIMutation } from '../../../../redux/api/aiSlice'

interface Message {
    role: 'user' | 'ai'
    content: string
    properties?: any[]
}

export default function TenantChatPage() {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'ai', content: 'Assalam o Alaikum! Main aapka AI Property Assistant hoon. Koi bhi property search karein!' }
    ])
    const [input, setInput] = useState('')
    const [searchAI, { isLoading }] = useSearchAIMutation()

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim()) return

        const userMessage = input
        setInput('')
        setMessages(prev => [...prev, { role: 'user', content: userMessage }])

        try {
            const result = await searchAI({ query: userMessage }).unwrap()
            setMessages(prev => [...prev, {
                role: 'ai',
                content: result.response,
                properties: result.properties
            }])
        } catch (err) {
            setMessages(prev => [...prev, {
                role: 'ai',
                content: 'Sorry, AI service se connect nahi ho saka!'
            }])
        }
    }

    return (
        <DashboardLayout role="tenant">
            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">AI Property Assistant</h1>
                        <p className="text-gray-500 text-sm mt-1">Ask anything about properties</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-xl">
                        <MessageSquare className="text-green-600 w-6 h-6" />
                    </div>
                </div>

                <Card className="border-0 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <Bot className="w-5 h-5 text-blue-600" />
                            AI Chat
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* Messages */}
                        <div className="space-y-4 min-h-[400px] max-h-[500px] overflow-y-auto mb-4 p-2">
                            {messages.map((msg, index) => (
                                <div key={index} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    {msg.role === 'ai' && (
                                        <div className="bg-blue-600 p-2 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                                            <Bot className="w-4 h-4 text-white" />
                                        </div>
                                    )}
                                    <div className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${msg.role === 'user'
                                        ? 'bg-blue-600 text-white rounded-tr-none'
                                        : 'bg-gray-100 text-gray-800 rounded-tl-none'
                                        }`}>
                                        <p className="whitespace-pre-line">{msg.content}</p>

                                        {/* Properties */}
                                        {msg.properties && msg.properties.length > 0 && (
                                            <div className="mt-3 space-y-2">
                                                {msg.properties.map((p: any, i: number) => (
                                                    <div key={i} className="bg-white rounded-lg p-3 border">
                                                        <p className="font-medium text-gray-900 text-xs">{p.property.title}</p>
                                                        <p className="text-xs text-gray-500">{p.property.area}, {p.property.location}</p>
                                                        <p className="text-xs text-blue-600 font-medium">Rs. {p.property.price?.toLocaleString()} / month</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    {msg.role === 'user' && (
                                        <div className="bg-gray-200 p-2 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                                            <User className="w-4 h-4 text-gray-600" />
                                        </div>
                                    )}
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex gap-3">
                                    <div className="bg-blue-600 p-2 rounded-full h-8 w-8 flex items-center justify-center">
                                        <Bot className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="bg-gray-100 px-4 py-2 rounded-2xl rounded-tl-none">
                                        <div className="flex gap-1 items-center h-5">
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSend} className="flex gap-2">
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Search property... e.g. Lahore mein 2 bedroom flat"
                                className="flex-1"
                                disabled={isLoading}
                            />
                            <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
                                <Send className="w-4 h-4" />
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    )
}