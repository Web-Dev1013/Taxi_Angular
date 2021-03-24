export class PostComment{
    _id: string;
    id: string;
    parentId: string;
    postId: string;
    doReply: boolean;
    commentText: string;
    children: PostComment[];
    postSlug: string;
    contentSlug: string;
    subContentSlug: string;
    subcategorySlug: string;
    depth: number;
}
