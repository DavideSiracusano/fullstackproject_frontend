import { Component, OnInit } from '@angular/core';
import { PostService } from '../services/post.service';
import { Post } from '../models/post';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrl: './edit-post.component.css',
})
export class EditPostComponent implements OnInit {
  posts: Post[] = [];
  title: string = '';
  content: string = '';

  constructor(private postService: PostService, private router: Router) {}

  ngOnInit(): void {
    this.seePosts();
  }

  updatePost(postId: string, title: string, content: string) {
    this.postService
      .updatePost(postId, this.title, this.content)
      .subscribe(() => {
        alert('post updated!');
        this.title = '';
        this.content = '';
        this.seePosts();
        this.router.navigate(['/home']);
      });
  }

  seePosts() {
    this.postService.getPosts().subscribe((data: Post[]) => {
      this.posts = data;
    });
  }
}
