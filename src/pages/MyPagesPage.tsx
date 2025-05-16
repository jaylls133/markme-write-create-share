
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getDocuments, deleteDocument, Document } from '@/lib/storage';
import { useToast } from '@/components/ui/use-toast';

const MyPagesPage = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    loadDocuments();
  }, []);
  
  const loadDocuments = () => {
    const docs = getDocuments();
    setDocuments(docs);
  };
  
  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this document? This action cannot be undone.")) {
      if (deleteDocument(id)) {
        loadDocuments();
        toast({
          title: "Document deleted",
          description: "The document has been deleted successfully."
        });
      } else {
        toast({
          title: "Error",
          description: "Could not delete the document.",
          variant: "destructive"
        });
      }
    }
  };
  
  const handleEdit = (id: string) => {
    navigate(`/editor?id=${id}`);
  };
  
  const filteredDocuments = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">My Pages</h1>
            <p className="text-muted-foreground">
              Manage your markdown documents
            </p>
          </div>
          
          <div className="flex gap-4">
            <Input
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-xs"
            />
            <Button asChild>
              <Link to="/editor">New Document</Link>
            </Button>
          </div>
        </div>
        
        {filteredDocuments.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">No documents found</h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm ? 'Try a different search term' : 'Start writing your first document'}
            </p>
            {!searchTerm && (
              <Button asChild>
                <Link to="/editor">Create Your First Document</Link>
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredDocuments.map((doc) => (
              <Card key={doc.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="truncate">{doc.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Updated {formatDate(doc.updatedAt)}
                  </p>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="line-clamp-3 text-sm text-muted-foreground mb-3">
                    {doc.content.substring(0, 150)}...
                  </p>
                  
                  {doc.tags && doc.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {doc.tags.map((tag, i) => (
                        <Badge key={i} variant="secondary">{tag}</Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="border-t pt-4 flex justify-between">
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={() => handleEdit(doc.id)}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDelete(doc.id)}
                  >
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyPagesPage;
