
import React, { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { getProfile, saveProfile, getDocuments } from '@/lib/storage';
import { useToast } from '@/components/ui/use-toast';

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    name: '',
    bio: '',
    avatar: '',
  });
  
  const [stats, setStats] = useState({
    totalDocs: 0,
    totalWords: 0,
    lastUpdated: '',
  });
  
  const { toast } = useToast();
  
  useEffect(() => {
    const savedProfile = getProfile();
    if (savedProfile) {
      setProfile(savedProfile);
    }
    
    calculateStats();
  }, []);
  
  const calculateStats = () => {
    const docs = getDocuments();
    
    // Calculate total words
    let wordCount = 0;
    docs.forEach(doc => {
      const words = doc.content.trim().split(/\s+/);
      wordCount += doc.content.trim() ? words.length : 0;
    });
    
    // Find last update date
    let lastUpdated = '';
    if (docs.length > 0) {
      const sorted = [...docs].sort((a, b) => 
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
      lastUpdated = new Date(sorted[0].updatedAt).toLocaleDateString();
    }
    
    setStats({
      totalDocs: docs.length,
      totalWords: wordCount,
      lastUpdated,
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      saveProfile(profile);
      toast({
        title: "Profile updated",
        description: "Your profile has been saved successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not save your profile.",
        variant: "destructive"
      });
    }
  };
  
  const handleDownloadBio = () => {
    try {
      const bioContent = `# ${profile.name}\n\n${profile.bio}`;
      const element = document.createElement("a");
      const file = new Blob([bioContent], { type: "text/markdown" });
      element.href = URL.createObjectURL(file);
      element.download = `${profile.name.replace(/\s+/g, '-').toLowerCase()}-bio.md`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      
      toast({
        title: "Bio exported",
        description: "Your bio has been downloaded as a markdown file."
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "There was a problem exporting your bio.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                    placeholder="Your name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profile.bio}
                    onChange={(e) => setProfile({...profile, bio: e.target.value})}
                    placeholder="Write a short bio about yourself"
                    className="min-h-[120px]"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="avatar">Avatar URL (optional)</Label>
                  <Input
                    id="avatar"
                    value={profile.avatar}
                    onChange={(e) => setProfile({...profile, avatar: e.target.value})}
                    placeholder="https://example.com/your-avatar.jpg"
                  />
                </div>
                
                <div className="flex justify-between">
                  <Button type="submit">Save Profile</Button>
                  <Button type="button" onClick={handleDownloadBio} variant="outline">
                    Export Bio
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Your Stats</CardTitle>
                <CardDescription>Summary of your writing activity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-secondary rounded-md p-4 text-center">
                    <p className="text-3xl font-bold">{stats.totalDocs}</p>
                    <p className="text-sm text-muted-foreground">Documents</p>
                  </div>
                  <div className="bg-secondary rounded-md p-4 text-center">
                    <p className="text-3xl font-bold">{stats.totalWords}</p>
                    <p className="text-sm text-muted-foreground">Words</p>
                  </div>
                  <div className="bg-secondary rounded-md p-4 text-center">
                    <p className="text-sm font-bold">{stats.lastUpdated || 'N/A'}</p>
                    <p className="text-sm text-muted-foreground">Last Updated</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>How others see you</CardDescription>
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
                        {profile.name ? profile.name.charAt(0) : 'M'}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium">{profile.name || 'Your Name'}</h3>
                    <p className="text-sm text-muted-foreground">
                      {profile.bio || 'Your bio will appear here'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
