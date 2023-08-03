import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent implements OnInit {
  enteredTitle = '';
  enteredContent = '';
  private mode = 'create';
  private postId = null;
  isLoading = false;
  form: any = null;
  imagePreview: string = '';
  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      content: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, { validators: [Validators.required] }),
    });

    this.route.paramMap.subscribe((param: ParamMap) => {
      this.isLoading = true;
      this.form.setValue({
        title: this.enteredTitle,
        content: this.enteredContent,
      });
      if (param.has('postId')) {
        this.mode = 'edit';
        // this.postId = param.get('postId');
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
    // throw new Error("Method not implemented.");
  }

  onAddPost() {
    if (this.form.invalid) {
      return;
    }
    this.postsService.addPost(
      this.form.value.title,
      this.form.value.content,
      this.form.value.image
    );
    this.form.reset();
  }

  onImagePicked(event: Event) {
    const inputElement = event.target as HTMLInputElement;

    if (inputElement.files !== null && inputElement.files.length > 0) {
      const file = inputElement.files[0];
      // Rest of your code that uses 'file'
      console.log('image file');
      console.log(file);
      this.form.patchValue({ image: file });
      this.form.get('image').updateValueAndValidity();
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };

      console.log(this.form);
      reader.readAsDataURL(file);
    } else {
      // Handle the case when 'files' is null or empty.
    }
  }
}
