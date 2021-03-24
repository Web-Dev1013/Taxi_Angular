import { ProductGroup } from './productGroup';

export class Product {
  _id: string;
  tags: string[];
  title: string;
  description: string;
  status: string;
  lockedPageContent: string;
  createdAt: Date;
  updatedAt: Date;
  slug: string;
  groupId: ProductGroup;
}
