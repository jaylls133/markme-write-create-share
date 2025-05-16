
import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { renderMarkdown } from "@/lib/markdown";

interface MarkdownEditorProps {
  initialContent?: string;
  onSave?: (content: string) => void;
  autoSaveKey?: string;
}

export function MarkdownEditor({ 
  initialContent = "", 
  onSave,
  autoSaveKey = "markme-current-content"
}: MarkdownEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [activeTab, setActiveTab] = useState<string>("edit");
  const { toast } = useToast();

  // Load content from localStorage if available
  useEffect(() => {
    const savedContent = localStorage.getItem(autoSaveKey);
    if (savedContent && !initialContent) {
      setContent(savedContent);
    }
  }, [autoSaveKey, initialContent]);

  // Update word and character counts
  useEffect(() => {
    if (content) {
      setCharCount(content.length);
      
      // Count words by splitting on whitespace
      const words = content.trim().split(/\s+/);
      setWordCount(content.trim() ? words.length : 0);
      
      // Auto-save content
      localStorage.setItem(autoSaveKey, content);
    } else {
      setWordCount(0);
      setCharCount(0);
    }
  }, [content, autoSaveKey]);

  const handleSave = () => {
    if (onSave) {
      onSave(content);
    }
    toast({
      title: "Document saved",
      description: `${wordCount} words saved successfully.`,
    });
  };

  const handleClear = () => {
    if (window.confirm("Are you sure you want to clear the editor? This action cannot be undone.")) {
      setContent("");
      localStorage.removeItem(autoSaveKey);
      toast({
        title: "Editor cleared",
        description: "All content has been removed.",
      });
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="border-b pb-2 flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Words: {wordCount} | Characters: {charCount}
        </div>
        <div className="flex space-x-2">
          <Button size="sm" variant="outline" onClick={handleSave}>Save</Button>
          <Button size="sm" variant="destructive" onClick={handleClear}>Clear</Button>
        </div>
      </div>

      <Tabs
        defaultValue="edit"
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col"
      >
        <TabsList className="mb-2">
          <TabsTrigger value="edit">Edit</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="split">Split View</TabsTrigger>
        </TabsList>
        <TabsContent value="edit" className="flex-1 overflow-hidden">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-full p-4 font-mono text-sm resize-none outline-none bg-background focus:ring-1 focus:ring-primary rounded-md"
            placeholder="Start writing Markdown here..."
          />
        </TabsContent>
        <TabsContent value="preview" className="flex-1 overflow-auto">
          <div 
            className="markdown-body p-4"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
          />
        </TabsContent>
        <TabsContent value="split" className="flex-1 flex overflow-hidden">
          <div className="w-1/2 h-full pr-2">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-full p-4 font-mono text-sm resize-none outline-none bg-background focus:ring-1 focus:ring-primary rounded-md"
              placeholder="Start writing Markdown here..."
            />
          </div>
          <div className="w-1/2 h-full pl-2 overflow-auto border-l">
            <div 
              className="markdown-body p-4"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
