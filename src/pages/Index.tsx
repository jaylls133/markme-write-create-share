
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Navigation } from '@/components/Navigation';
import { renderMarkdown } from '@/lib/markdown';
import { getProfile, exampleDocument, initializeDefaultContent } from '@/lib/storage';

const Index = () => {
  const profile = getProfile();
  
  // Initialize default content if needed
  useEffect(() => {
    initializeDefaultContent();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <section className="max-w-4xl mx-auto text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold mb-4">Welcome to MarkMe</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Your minimalist markdown editor for capturing ideas, notes, and stories.
          </p>
          <Button asChild size="lg" className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
            <Link to="/editor">Start Writing</Link>
          </Button>
        </section>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>About Me</CardTitle>
              <CardDescription>Your personal profile</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                  {profile.avatar ? (
                    <img 
                      src={profile.avatar} 
                      alt={profile.name} 
                      className="w-full h-full rounded-full object-cover" 
                    />
                  ) : (
                    <span className="text-2xl font-bold text-primary">
                      {profile.name.charAt(0)}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="font-medium">{profile.name}</h3>
                  <p className="text-sm text-muted-foreground">{profile.bio}</p>
                </div>
              </div>
              <Button asChild variant="outline" className="w-full">
                <Link to="/profile">Edit Profile</Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Featured Document</CardTitle>
              <CardDescription>Sample markdown content</CardDescription>
            </CardHeader>
            <CardContent className="max-h-80 overflow-auto">
              <div 
                className="markdown-body prose prose-sm"
                dangerouslySetInnerHTML={{ 
                  __html: renderMarkdown(exampleDocument.content.substring(0, 500) + '...') 
                }}
              />
              <div className="mt-4 flex justify-end">
                <Button asChild variant="outline" size="sm">
                  <Link to="/editor">View in Editor</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} MarkMe — Smart Markdown Editor</p>
      </footer>
    </div>
  );
};

export default Index;
