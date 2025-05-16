
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { MarkdownEditor } from '@/components/MarkdownEditor';
import { saveDocument, getDocument, exampleDocument } from '@/lib/storage';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const EditorPage = () => {
  const [searchParams] = useSearchParams();
  const documentId = searchParams.get('id');
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (documentId) {
      const doc = getDocument(documentId);
      if (doc) {
        setTitle(doc.title);
        setContent(doc.content);
      } else {
        toast({
          title: "Document not found",
          description: "The requested document could not be found.",
          variant: "destructive"
        });
      }
    } else {
      // New document
      const savedTitle = localStorage.getItem('markme-current-title');
      if (savedTitle) {
        setTitle(savedTitle);
      } else {
        setTitle("Untitled Document");
      }
    }
  }, [documentId, toast]);

  useEffect(() => {
    // Save the title to local storage for auto-save
    localStorage.setItem('markme-current-title', title);
  }, [title]);

  const handleSave = (newContent: string) => {
    try {
      saveDocument({
        id: documentId || undefined,
        title: title || "Untitled Document",
        content: newContent,
        tags: []
      });
      
      toast({
        title: "Document saved",
        description: "Your document has been saved successfully."
      });
    } catch (error) {
      toast({
        title: "Error saving document",
        description: "There was a problem saving your document.",
        variant: "destructive"
      });
    }
  };

  const handleExport = () => {
    try {
      const element = document.createElement("a");
      const file = new Blob([content], { type: "text/markdown" });
      element.href = URL.createObjectURL(file);
      element.download = `${title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.md`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      
      toast({
        title: "Export successful",
        description: "Your markdown file has been downloaded."
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "There was a problem exporting your document.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 py-6 flex flex-col">
        <div className="mb-4 flex items-center justify-between">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-xl font-medium max-w-md"
            placeholder="Document Title"
          />
          <Button onClick={handleExport} variant="outline" size="sm">
            Export
          </Button>
        </div>
        
        <div className="flex-1 border rounded-md overflow-hidden">
          <MarkdownEditor 
            initialContent={content || ""} 
            onSave={handleSave}
          />
        </div>
      </main>
    </div>
  );
};

export default EditorPage;
