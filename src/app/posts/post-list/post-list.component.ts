import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit, OnDestroy {
  // posts = [
  //   { title: "First Post", content: "This is the first post's content" },
  //   { title: "Second Post", content: "This is the second post's content" },
  //   { title: "Third Post", content: "This is the third post's content" }
  // ];
  posts: Post[] = [];
  private postsSub: Subscription;
  totalPosts = 10;
  postsPerPage = 2;
  pageSizeOptions = [1, 2, 5, 10];
  currentPage = 1;
  constructor(public postsService: PostsService) {
    this.postsSub = new Subscription();
  }

  ngOnInit() {
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.postsSub = this.postsService
      .getPostUpdateListener()
      .subscribe((posts: Post[]) => {
        this.posts = posts;
      });
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }

  onDelete(postId: string) {
    this.postsService.deletePost(postId);
  }
  onChangedPage(pageData: PageEvent) {
    console.log(pageData);
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, 1);
  }
}
