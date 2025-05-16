
import DOMPurify from 'dompurify';

// Simple markdown renderer (could be replaced with a proper library like marked)
export function renderMarkdown(markdown: string): string {
  if (!markdown) return '';
  
  let html = markdown;
  
  // Headers
  html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');
  html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
  html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
  html = html.replace(/^#### (.*$)/gm, '<h4>$1</h4>');
  
  // Bold and italic
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  html = html.replace(/\_\_(.*?)\_\_/g, '<strong>$1</strong>');
  html = html.replace(/\_(.*?)\_/g, '<em>$1</em>');
  
  // Links
  html = html.replace(/\[([^\[]+)\]\(([^\)]+)\)/g, '<a href="$2">$1</a>');
  
  // Images
  html = html.replace(/!\[([^\[]+)\]\(([^\)]+)\)/g, '<img src="$2" alt="$1" />');
  
  // Lists
  html = html.replace(/^\* (.*$)/gm, '<ul><li>$1</li></ul>');
  html = html.replace(/^- (.*$)/gm, '<ul><li>$1</li></ul>');
  html = html.replace(/^([0-9]+)\. (.*$)/gm, '<ol><li>$2</li></ol>');
  
  // Fix lists (combine consecutive list items)
  html = html.replace(/<\/ul>\s*<ul>/g, '');
  html = html.replace(/<\/ol>\s*<ol>/g, '');
  
  // Blockquotes
  html = html.replace(/^\> (.*$)/gm, '<blockquote>$1</blockquote>');
  html = html.replace(/<\/blockquote>\s*<blockquote>/g, '<br>');
  
  // Code blocks
  html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
  
  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  // Line breaks
  html = html.replace(/\n/g, '<br>');
  
  // Fix repeated <br> tags
  html = html.replace(/<br>\s*<br>/g, '<br><br>');
  
  // Sanitize HTML to prevent XSS attacks
  return DOMPurify.sanitize(html);
}
