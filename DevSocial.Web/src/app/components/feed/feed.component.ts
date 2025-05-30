import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Post {
  id: number;
  title: string;
  content: string;
  codeSnippet?: string;
  codeLanguage?: string;
  imageUrl?: string;
  authorId: string;
  authorName: string;
  authorProfilePictureUrl?: string;
  createdAt: string;
  updatedAt?: string;
  likeCount: number;
  commentCount: number;
  isLikedByCurrentUser: boolean;
  tags: string[];
}

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-2xl mx-auto space-y-6">
        <!-- Post 1 -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center mb-4">
            <img 
              [src]="posts[0].authorProfilePictureUrl || 'assets/default-avatar.png'" 
              alt="Profile" 
              class="w-10 h-10 rounded-full mr-3"
            >
            <div>
              <h3 class="font-semibold">{{ posts[0].authorName }}</h3>
              <p class="text-sm text-gray-500">{{ posts[0].createdAt | date:'medium' }}</p>
            </div>
          </div>
          
          <h2 class="text-xl font-bold mb-2">{{ posts[0].title }}</h2>
          <p class="text-gray-700 mb-4">{{ posts[0].content }}</p>
          
          <div *ngIf="posts[0].codeSnippet" class="mb-4">
            <pre class="bg-gray-100 p-4 rounded-lg overflow-x-auto">
              <code [class]="'language-' + posts[0].codeLanguage">{{ posts[0].codeSnippet }}</code>
            </pre>
          </div>
          
          <div class="flex flex-wrap gap-2 mb-4">
            <span *ngFor="let tag of posts[0].tags" 
                  class="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded">
              #{{ tag }}
            </span>
          </div>
          
          <div class="flex items-center space-x-4 text-gray-500">
            <button class="flex items-center space-x-1 hover:text-blue-600">
              <i class="fas fa-heart" [class.text-red-500]="posts[0].isLikedByCurrentUser"></i>
              <span>{{ posts[0].likeCount }}</span>
            </button>
            <button class="flex items-center space-x-1 hover:text-blue-600">
              <i class="fas fa-comment"></i>
              <span>{{ posts[0].commentCount }}</span>
            </button>
          </div>
        </div>

        <!-- Post 2 -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center mb-4">
            <img 
              [src]="posts[1].authorProfilePictureUrl || 'assets/default-avatar.png'" 
              alt="Profile" 
              class="w-10 h-10 rounded-full mr-3"
            >
            <div>
              <h3 class="font-semibold">{{ posts[1].authorName }}</h3>
              <p class="text-sm text-gray-500">{{ posts[1].createdAt | date:'medium' }}</p>
            </div>
          </div>
          
          <h2 class="text-xl font-bold mb-2">{{ posts[1].title }}</h2>
          <p class="text-gray-700 mb-4">{{ posts[1].content }}</p>
          
          <div *ngIf="posts[1].codeSnippet" class="mb-4">
            <pre class="bg-gray-100 p-4 rounded-lg overflow-x-auto">
              <code [class]="'language-' + posts[1].codeLanguage">{{ posts[1].codeSnippet }}</code>
            </pre>
          </div>
          
          <div class="flex flex-wrap gap-2 mb-4">
            <span *ngFor="let tag of posts[1].tags" 
                  class="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded">
              #{{ tag }}
            </span>
          </div>
          
          <div class="flex items-center space-x-4 text-gray-500">
            <button class="flex items-center space-x-1 hover:text-blue-600">
              <i class="fas fa-heart" [class.text-red-500]="posts[1].isLikedByCurrentUser"></i>
              <span>{{ posts[1].likeCount }}</span>
            </button>
            <button class="flex items-center space-x-1 hover:text-blue-600">
              <i class="fas fa-comment"></i>
              <span>{{ posts[1].commentCount }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      background-color: #f3f4f6;
      min-height: 100vh;
    }
  `]
})
export class FeedComponent {
  posts: Post[] = [
    {
      id: 1,
      title: "Building a Real-time Chat App with SignalR",
      content: "I've been working on a real-time chat application using SignalR and Angular. Here's how I implemented the core functionality...",
      codeSnippet: `@HubConnectionBuilder()
    .WithUrl("/chatHub")
    .Build();

await connection.StartAsync();
await connection.InvokeAsync("SendMessage", user, message);`,
      codeLanguage: "csharp",
      authorId: "1",
      authorName: "John Doe",
      authorProfilePictureUrl: "https://i.pravatar.cc/150?img=1",
      createdAt: "2024-03-15T10:30:00Z",
      likeCount: 15,
      commentCount: 3,
      isLikedByCurrentUser: true,
      tags: ["SignalR", "Angular", "Real-time", "WebSockets"]
    },
    {
      id: 2,
      title: "Optimizing Database Queries in Entity Framework Core",
      content: "Here are some tips for optimizing your Entity Framework Core queries. I've been working on a large-scale application and these practices have helped improve performance significantly.",
      codeSnippet: `var users = await _context.Users
    .Include(u => u.Posts)
    .Where(u => u.IsActive)
    .Select(u => new UserDto {
        Id = u.Id,
        Name = u.Name,
        PostCount = u.Posts.Count
    })
    .ToListAsync();`,
      codeLanguage: "csharp",
      authorId: "2",
      authorName: "Jane Smith",
      authorProfilePictureUrl: "https://i.pravatar.cc/150?img=2",
      createdAt: "2024-03-14T15:45:00Z",
      likeCount: 23,
      commentCount: 7,
      isLikedByCurrentUser: false,
      tags: ["Entity Framework", "Performance", "C#", "Database"]
    }
  ];
} 