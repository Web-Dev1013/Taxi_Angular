import { Content } from './content';

export class Category {
  _id: string;
  tags: string[];
  title: string;
  description: string;
  productId: string;
  slug: string;
  status: string;
  lockedPageContent: string;
  locked: boolean;
  contents: Content[];
}
