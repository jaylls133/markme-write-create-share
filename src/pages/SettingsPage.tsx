
import React, { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getSettings, saveSettings, getDocuments } from '@/lib/storage';
import { useTheme } from '@/hooks/use-theme';
import { useToast } from '@/components/ui/use-toast';

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    fontSize: 'medium',
    fontFamily: 'fira-code',
    autoSave: true,
  });
  
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  
  useEffect(() => {
    const savedSettings = getSettings();
    if (savedSettings) {
      setSettings({
        ...settings,
        fontSize: savedSettings.fontSize,
        fontFamily: savedSettings.fontFamily,
        autoSave: savedSettings.autoSave,
      });
    }
  }, []);
  
  const handleSaveSettings = () => {
    try {
      saveSettings({
        ...settings,
        theme: theme as 'light' | 'dark' | 'system',
      });
      
      toast({
        title: "Settings saved",
        description: "Your preferences have been updated."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not save your settings.",
        variant: "destructive"
      });
    }
  };
  
  const handleExportAllData = () => {
    try {
      const docs = getDocuments();
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(docs, null, 2));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", "markme-documents.json");
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      document.body.removeChild(downloadAnchorNode);
      
      toast({
        title: "Data exported",
        description: "Your documents have been exported successfully."
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "There was a problem exporting your data.",
        variant: "destructive"
      });
    }
  };
  
  const handleResetPreferences = () => {
    if (window.confirm("Are you sure you want to reset all preferences to default? This won't delete your documents.")) {
      setSettings({
        fontSize: 'medium',
        fontFamily: 'fira-code',
        autoSave: true,
      });
      setTheme('system');
      
      saveSettings({
        fontSize: 'medium',
        fontFamily: 'fira-code',
        autoSave: true,
        theme: 'system',
      });
      
      toast({
        title: "Preferences reset",
        description: "All settings have been restored to defaults."
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>
        
        <div className="grid gap-8 max-w-3xl">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize how MarkMe looks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <Select 
                  value={theme} 
                  onValueChange={(value) => setTheme(value as any)}
                >
                  <SelectTrigger id="theme" className="w-full">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="font-size">Font Size</Label>
                <Select 
                  value={settings.fontSize}
                  onValueChange={(value) => setSettings({...settings, fontSize: value})}
                >
                  <SelectTrigger id="font-size" className="w-full">
                    <SelectValue placeholder="Select font size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="font-family">Font Family</Label>
                <Select 
                  value={settings.fontFamily}
                  onValueChange={(value) => setSettings({...settings, fontFamily: value})}
                >
                  <SelectTrigger id="font-family" className="w-full">
                    <SelectValue placeholder="Select font family" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fira-code">Fira Code (Monospace)</SelectItem>
                    <SelectItem value="inter">Inter (Sans-serif)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Editor Preferences</CardTitle>
              <CardDescription>Customize your writing experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-save" className="text-base">Auto Save</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically save your work while typing
                  </p>
                </div>
                <Switch
                  id="auto-save"
                  checked={settings.autoSave}
                  onCheckedChange={(checked) => setSettings({...settings, autoSave: checked})}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>Manage your documents and data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col space-y-4">
                <Button onClick={handleExportAllData} variant="outline">
                  Export All Documents
                </Button>
                <Button onClick={handleResetPreferences} variant="destructive">
                  Reset All Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-end">
            <Button onClick={handleSaveSettings}>
              Save Settings
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;
