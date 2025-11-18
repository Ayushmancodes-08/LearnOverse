import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Send, Loader2 } from 'lucide-react';
import { useMentisStore } from '@/lib/store';
import { chatWithDocument } from '@/lib/gemini';
import { simpleRAG } from '@/lib/simple-rag';
import { useToast } from '@/hooks/use-toast';

export const ChatInterface = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const { chatMessages, addChatMessage, combinedText, ragInitialized } = useMentisStore();
  const { toast } = useToast();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleSend = async () => {
    if (!input.trim() || !combinedText) return;

    const userMessage = input.trim();
    setInput('');
    
    addChatMessage({ role: 'user', content: userMessage });
    setLoading(true);

    try {
      // Use Simple RAG to find relevant context (no API calls, instant)
      const relevantContext = ragInitialized && simpleRAG.getSize() > 0
        ? simpleRAG.getContext(userMessage, 5)
        : combinedText.substring(0, 15000);
      
      const response = await chatWithDocument(userMessage, relevantContext);
      addChatMessage({ role: 'assistant', content: response });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to get response',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!combinedText) {
    return (
      <Card className="flex items-center justify-center h-[600px] bg-secondary/30">
        <div className="text-center space-y-4 p-8">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">No Document Loaded</p>
            <p className="text-xs text-muted-foreground mt-1">Upload a document to start chatting</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="flex flex-col h-[600px]">
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {chatMessages.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm text-muted-foreground">
                Ask me anything about your documents...
              </p>
            </div>
          ) : (
            chatMessages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <Card
                  className={`max-w-[80%] p-4 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary/50'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </Card>
              </div>
            ))
          )}
          {loading && (
            <div className="flex justify-start">
              <Card className="max-w-[80%] p-4 bg-secondary/50">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <p className="text-sm text-muted-foreground">Thinking...</p>
                </div>
              </Card>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about your documents..."
            className="flex-1 px-4 py-3 bg-background/50 border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            disabled={loading}
          />
          <Button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="px-6"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
