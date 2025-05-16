
export interface Document {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  expiresAt?: string; // New field for expiration
}

// Local storage keys
const DOCS_KEY = 'markme-documents';
const PROFILE_KEY = 'markme-profile';
const SETTINGS_KEY = 'markme-settings';

// Get all documents (filtering expired ones)
export function getDocuments(): Document[] {
  const docs = localStorage.getItem(DOCS_KEY);
  const allDocs = docs ? JSON.parse(docs) : [];
  
  // Filter out expired documents and clean them up
  const currentDate = new Date();
  const validDocs = allDocs.filter((doc: Document) => {
    if (doc.expiresAt) {
      const expiryDate = new Date(doc.expiresAt);
      return expiryDate > currentDate;
    }
    return true; // Keep docs without expiration
  });
  
  // If we filtered out some docs, update storage
  if (validDocs.length < allDocs.length) {
    localStorage.setItem(DOCS_KEY, JSON.stringify(validDocs));
  }
  
  return validDocs;
}

// Get a single document
export function getDocument(id: string): Document | null {
  const docs = getDocuments(); // This will filter expired docs
  return docs.find(doc => doc.id === id) || null;
}

// Save a document (create or update)
export function saveDocument(doc: Partial<Document> & { title: string; content: string }): Document {
  const docs = getDocuments();
  const now = new Date();
  const nowISO = now.toISOString();
  
  // Set expiration date - 30 days from now
  const thirtyDaysLater = new Date();
  thirtyDaysLater.setDate(now.getDate() + 30);
  const expiresAtISO = thirtyDaysLater.toISOString();
  
  // Check if document exists
  const existingIndex = docs.findIndex(d => d.id === doc.id);
  
  if (existingIndex >= 0) {
    // Update existing document
    const updated = {
      ...docs[existingIndex],
      ...doc,
      updatedAt: nowISO,
      expiresAt: expiresAtISO // Update expiration when document is updated
    };
    docs[existingIndex] = updated;
    localStorage.setItem(DOCS_KEY, JSON.stringify(docs));
    return updated;
  } else {
    // Create new document
    const newDoc: Document = {
      id: generateId(),
      title: doc.title,
      content: doc.content,
      createdAt: nowISO,
      updatedAt: nowISO,
      expiresAt: expiresAtISO, // Set expiration for new document
      tags: doc.tags || [],
      ...doc
    };
    docs.push(newDoc);
    localStorage.setItem(DOCS_KEY, JSON.stringify(docs));
    return newDoc;
  }
}

// Delete a document
export function deleteDocument(id: string): boolean {
  let docs = getDocuments();
  const initialLength = docs.length;
  docs = docs.filter(doc => doc.id !== id);
  
  if (docs.length !== initialLength) {
    localStorage.setItem(DOCS_KEY, JSON.stringify(docs));
    return true;
  }
  return false;
}

// Extend document expiration by 30 more days
export function extendDocumentExpiration(id: string): boolean {
  const docs = getDocuments();
  const docIndex = docs.findIndex(doc => doc.id === id);
  
  if (docIndex >= 0) {
    const thirtyDaysLater = new Date();
    thirtyDaysLater.setDate(new Date().getDate() + 30);
    
    docs[docIndex].expiresAt = thirtyDaysLater.toISOString();
    localStorage.setItem(DOCS_KEY, JSON.stringify(docs));
    return true;
  }
  
  return false;
}

// User profile
export interface Profile {
  name: string;
  bio: string;
  avatar?: string;
}

// Get user profile
export function getProfile(): Profile {
  const profile = localStorage.getItem(PROFILE_KEY);
  return profile ? JSON.parse(profile) : { 
    name: 'MarkMe User',
    bio: 'Write a brief description about yourself.'
  };
}

// Save user profile
export function saveProfile(profile: Profile): void {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

// Settings
export interface Settings {
  theme: 'light' | 'dark' | 'system';
  fontSize: string;
  fontFamily: string;
  autoSave: boolean;
}

// Get app settings
export function getSettings(): Settings {
  const settings = localStorage.getItem(SETTINGS_KEY);
  return settings ? JSON.parse(settings) : {
    theme: 'system',
    fontSize: 'medium',
    fontFamily: 'fira-code',
    autoSave: true
  };
}

// Save app settings
export function saveSettings(settings: Settings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

// Helper function to generate unique IDs
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

// Default example document
export const exampleDocument = {
  title: "My Journey into Web Development",
  content: `# My Journey into Web Development

## The Beginning

I first became interested in web development when I was trying to create a simple website for a personal project. What started as a curiosity soon grew into a passion.

### Learning the Basics

I began with the fundamentals:

* HTML for structure
* CSS for styling
* JavaScript for interactivity

## Growing as a Developer

> "The most powerful tool we have as developers is automation."

As I continued learning, I discovered frameworks and libraries that made development more efficient:

1. React for UI
2. TypeScript for type safety
3. Tailwind CSS for styling

\`\`\`
// My first React component
function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}
\`\`\`

## What's Next

I'm currently exploring **backend development** with Node.js and looking forward to becoming a full-stack developer.

[Check out my projects](https://github.com)

![Web Development](https://images.unsplash.com/photo-1517694712202-14dd9538aa97)
`
};

// Initialize default content if no documents exist
export function initializeDefaultContent(): void {
  const docs = getDocuments();
  if (docs.length === 0) {
    const thirtyDaysLater = new Date();
    thirtyDaysLater.setDate(new Date().getDate() + 30);
    
    saveDocument({
      ...exampleDocument,
      id: 'example',
      tags: ['sample', 'personal'],
      expiresAt: thirtyDaysLater.toISOString()
    });
  }
}

// Function to check and clean up expired documents
export function cleanupExpiredDocuments(): void {
  getDocuments(); // This will trigger the filtering logic
}
