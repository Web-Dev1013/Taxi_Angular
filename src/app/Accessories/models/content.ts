import { ContentType } from './enum.content-types';
import { SubCategoryPost } from './subcategory-post';

export class Content {
  _id: string;
  categoryId: string;
  groupId: string;
  title: string;
  description: string;
  contentType: ContentType;
  slug: string;
  sortOrder: number;
  locked: boolean;
  lockedPageContent: string;
  commentDisabled: boolean;
  body: string;
  status: string;
  contents: SubCategoryPost[];
  posts: SubCategoryPost[];
  createdAt: Date;
  updatedAt: Date;
}
