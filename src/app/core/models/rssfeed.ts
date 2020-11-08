export class RSSFeed {
    title: string;
    description: string;
    publishedAt: string;
    image: string;
    item: Item[];
}

export class Item {
    title: string;
    description: string;
    link: string;
    guid: string;
    pubDate: Date;
}

export interface IFeedMap {
    [id: number]: RSSFeed; 
}