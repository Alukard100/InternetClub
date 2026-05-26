export interface Article {
    id: string;
    title: string;
    slug: string;
    thumbnailPath: string;
    content: string;
    type: ArticleType;
    createdAt: Date;
    editedOn?: Date;
    published: boolean;
}

export interface ArticleCreateRequest {
    title: string;
    thumbnailPath: string;
    content: string;
    type: number;
    published: boolean;
}

export enum ArticleType {
    Games = 0,
    Information = 1,
    Tournament = 2 
}