import { Component, OnChanges, OnInit } from '@angular/core';
import { Post } from '../models/post';
import { PostService } from '../services/post.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  posts: Post[] = [];
  title: string = '';
  content: string = '';
  commentContent: { [postId: string]: string } = {};
  likedPosts: string[] = []; // Array to store IDs of posts liked by the current user
  likedComments: { [commentId: string]: boolean } = {}; // Object to store IDs of comments liked by the current user

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.seePosts();
  }

  seePosts() {
    this.postService.getPosts().subscribe((data: Post[]) => {
      this.posts = data;
    });
  }

  addPost() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const userId = currentUser._id;
    const username = currentUser.username;

    const insertPost = {
      username: username,
      userID: userId,
      title: this.title,
      content: this.content,
      comments: [],
      likes: 0,
      likedBy: [],
      date: new Date(),
    };

    this.postService.createPost(insertPost).subscribe((data: Post) => {
      this.posts.unshift(data);
      this.title = '';
      this.content = '';
      this.seePosts();
    });
  }

  addComment(postId: string) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const userId = currentUser.id;
    const username = currentUser.username;

    const insertComment = {
      username: username,
      userID: userId,
      content: this.commentContent[postId],
      likes: 0,
      likedBy: [],
      date: new Date(),
    };

    this.postService.addComment(postId, insertComment).subscribe(
      (data: Post) => {
        const postIndex = this.posts.findIndex((post) => post._id === data._id);
        if (postIndex !== -1) {
          this.posts[postIndex] = data;
          this.commentContent[postId] = '';
          this.seePosts(); // Aggiorna i post dopo aver aggiunto il commento
        }
      },
      (error: any) => {
        console.error('Error adding comment:', error);
      }
    );
  }

  toggleLike(post: Post) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const userId = currentUser._id;

    if (post.likedBy.includes(userId)) {
      this.removeLike(post._id);
    } else {
      this.addLike(post._id);
    }
  }

  toggleCommentLike(postId: string, commentId: string) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const userId = currentUser._id;

    const post = this.posts.find((p) => p._id === postId);
    if (post) {
      const comment = post.comments.find((c) => c._id === commentId);
      if (comment) {
        if (comment.likedBy.includes(userId)) {
          this.removeCommentLike(postId, commentId);
        } else {
          this.addCommentLike(postId, commentId);
        }
      }
    }
  }

  addLike(postId: string) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const userId = currentUser._id;

    console.log(userId);

    this.postService.addLike(postId, userId).subscribe(
      (data: Post) => {
        const postIndex = this.posts.findIndex((post) => post._id === postId);
        if (postIndex !== -1) {
          this.posts[postIndex] = data;
          this.likedPosts.push(postId);
          this.seePosts();
        }
      },
      (error) => {
        console.error('Error adding like:', error);
      }
    );
  }

  removeLike(postId: string) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const userId = currentUser._id;

    console.log(userId);

    this.postService.removeLike(postId, userId).subscribe(
      (data: Post) => {
        const postIndex = this.posts.findIndex((post) => post._id === data._id);
        if (postIndex !== -1) {
          this.posts[postIndex] = data;
          this.likedPosts = this.likedPosts.filter((id) => id !== postId); // Remove postId from likedPosts array
          this.seePosts();
        }
      },
      (error) => {
        console.error('Error removing like:', error);
      }
    );
  }

  addCommentLike(postId: string, commentId: string) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const userId = currentUser._id;

    this.postService.addCommentLike(postId, commentId, userId).subscribe(
      (data: Post) => {
        const postIndex = this.posts.findIndex((post) => post._id === data._id);
        if (postIndex !== -1) {
          this.posts[postIndex] = data;
          this.likedComments[commentId] = true;
          this.seePosts();
        }
      },
      (error) => {
        console.error('Error adding comment like:', error);
      }
    );
  }

  removeCommentLike(postId: string, commentId: string) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const userId = currentUser._id;

    this.postService
      .removeCommentLike(postId, commentId, userId)
      .subscribe((data: Post) => {
        const postIndex = this.posts.findIndex((post) => post._id === data._id);
        if (postIndex !== -1) {
          this.posts[postIndex] = data;
          delete this.likedComments[commentId];
          this.seePosts();
        }
      });
  }

  deletePost(postId: string) {
    this.postService.deletePost(postId).subscribe(
      () => {
        const postIndex = this.posts.findIndex((post) => post._id === postId);
        if (postIndex !== -1) {
          this.posts.splice(postIndex, 1);
        }
      },
      (error: any) => {
        console.error('Error deleting post:', error);
      }
    );
  }

  deleteComment(postId: string, commentId: string) {
    this.postService.deleteComment(postId, commentId).subscribe(
      () => {
        const post = this.posts.find((post) => post._id === postId);
        if (post) {
          const commentIndex = post.comments.findIndex(
            (comment) => comment._id === commentId
          );
          if (commentIndex !== -1) {
            post.comments.splice(commentIndex, 1);
          }
        }
      },
      (error: any) => {
        console.error('Error deleting comment:', error);
      }
    );
  }

  getCurrentUser() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    return currentUser._id;
  }

  isLikedByCurrentUserComment(commentId: string): boolean {
    const currentUser = this.getCurrentUser();
    return this.posts.some((post) =>
      post.comments.some(
        (comment) =>
          comment._id === commentId && comment.likedBy.includes(currentUser)
      )
    );
  }

  isLikedByCurrentUserLike(post: Post): boolean {
    const likedByCurrentUser = post.likedBy.includes(this.getCurrentUser());
    return likedByCurrentUser;
  }
}
