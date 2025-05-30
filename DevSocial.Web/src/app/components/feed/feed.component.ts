import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Post } from '../../models/post.model';
import { PostComponent } from './post/post.component';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [CommonModule, PostComponent],
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
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