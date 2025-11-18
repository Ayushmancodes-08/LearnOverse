import { Send, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useState, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { APIClient } from '@/lib/api-client';
import { useMentisStore } from '@/lib/store';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const ChatInterfaceBackend = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { mainDocument } = useMentisStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) {
      toast({
        title: 'Empty Message',
        description: 'Please enter a question',
        variant: 'destructive',
      });
      return;
    }

    if (!mainDocument.text) {
      toast({
        title: 'No Document',
        description: 'Please upload a PDF first',
        variant: 'destructive',
      });
      return;
    }

    if (input.length > 5000) {
      toast({
        title: 'Message Too Long',
        description: 'Maximum message length is 5000 characters',
        variant: 'destructive',
      });
      return;
    }

    // Add user message
    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const response = await APIClient.chat(input, mainDocument.text, mainDocument.id);

      const assistantMessage: Message = {
        id: `msg-${Date.now()}-response`,
        role: 'assistant',
        content: response.answer,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get response';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!mainDocument.text) {
    return (
      <Card className="p-8 text-center">
        <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">Upload a PDF to start chatting</p>
      </Card>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-4 bg-muted/30 rounded-lg">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <p>Start a conversation about your document</p>
          </div>
        ) : (
          messages.map(message => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <Card
                className={`max-w-xs lg:max-w-md px-4 py-2 ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </Card>
            </div>
          ))
        )}

        {loading && (
          <div className="flex justify-start">
            <Card className="bg-muted px-4 py-2">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Thinking...</span>
              </div>
            </Card>
          </div>
        )}

        {error && (
          <div className="flex justify-start">
            <Card className="bg-red-50 border-red-200 px-4 py-2">
              <p className="text-sm text-red-900">{error}</p>
            </Card>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="flex gap-2">
        <Input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask a question about your document..."
          disabled={loading}
          maxLength={5000}
        />
        <Button type="submit" disabled={loading || !input.trim()}>
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </form>
    </div>
  );
};
