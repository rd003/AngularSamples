import { inject } from "@angular/core";
import { ResolveFn } from "@angular/router";
import { PostService } from "./post.service";
import { PostModel } from "./post.model";

export const userPostResolver: ResolveFn<PostModel[]> = (route, state) => {
  const postService = inject(PostService);
  const userId = Number(route.paramMap.get("id"));
  const posts$ = postService.getPosts(userId);
  return posts$;
};
