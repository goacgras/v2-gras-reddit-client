export interface Post {
    identifier: string;
    title: string;
    body?: string;
    slug: string;
    subName: string;
    createdAt: string;
    updatedAt: string;
    username: string;
    url: string; //virtual
    voteScore?: number;
    commentCount?: number;
    userVote?: number;
}