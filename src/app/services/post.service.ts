import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private apiURL = 'http://localhost:4000';

  constructor(private http: HttpClient) {}

  createPost(content: any) {
    return this.http.post<any>(`${this.apiURL}/note`, content);
  }

  getPosts() {
    return this.http.get<any>(`${this.apiURL}/notes`);
  }

  addComment(noteId: string, content: any) {
    return this.http.post<any>(
      `${this.apiURL}/note/${noteId}/comment`,
      content
    );
  }

  addLike(postId: string, userId: string) {
    const headers = new HttpHeaders({ userid: userId });
    return this.http.post<any>(
      `${this.apiURL}/like/note/${postId}`,
      {},
      { headers }
    );
  }

  addCommentLike(postId: string, commentId: string, userId: string) {
    const headers = new HttpHeaders({ userid: userId });
    return this.http.post<any>(
      `${this.apiURL}/like/note/${postId}/comment/${commentId}`,
      {},
      { headers }
    );
  }

  removeLike(postId: string, userId: string) {
    const headers = new HttpHeaders({ userid: userId });
    return this.http.delete<any>(`${this.apiURL}/like/note/${postId}`, {
      headers,
    });
  }

  removeCommentLike(postId: string, commentId: string, userId: string) {
    const headers = new HttpHeaders({ userid: userId });
    return this.http.delete<any>(
      `${this.apiURL}/like/note/${postId}/comment/${commentId}`,
      { headers }
    );
  }

  deletePost(postId: string) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const userId = currentUser._id;
    const headers = new HttpHeaders().set('userid', userId);
    return this.http.delete<void>(`${this.apiURL}/note/${postId}`, { headers });
  }

  deleteComment(noteId: string, commentId: string) {
    return this.http.delete<void>(
      `${this.apiURL}/note/${noteId}/comment/${commentId}`,
      {}
    );
  }

  updatePost(noteId: string, title: string, content: string) {
    return this.http.put<any>(`${this.apiURL}/note/${noteId}`, {
      title,
      content,
    });
  }
}
