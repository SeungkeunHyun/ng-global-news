import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { NgxXml2jsonService } from 'ngx-xml2json';
import { HttpClient } from '@angular/common/http';
import * as xml2js from "xml2js";
import { RSSFeed, Item } from '../models/rssfeed';

@Injectable({
  providedIn: 'root'
})
export class RSSParserService {
  private CORS_PROXY = "https://cors-anywhere.herokuapp.com/";
  private parseXML = xml2js.parseString;
  constructor(private httpClient: HttpClient, private ngxXml2jsonService: NgxXml2jsonService) { }

  readRSSFeed(uri: string): Observable<RSSFeed> {
    return this.httpClient.get(this.CORS_PROXY + uri, {responseType: 'text'}).pipe(map((feed:string) => {
      const parser = new DOMParser();
      const obj = parser.parseFromString(feed, "application/xml");
      console.log(obj);      
      return this.mapRSSFeed(obj);
    }));
  }

  getContent(node: Element, path: string): string {
    const n =  node.querySelector(path);
    if(n) 
      return n.textContent.trim();
    else {
      console.log('null element', path);
      return '';
    }
  }

  getAttribute(node: Element, path: string, attr: string): string {
    return node.querySelector(path).getAttribute(attr);
  }

  mapRSS(doc: XMLDocument, rssFeed: RSSFeed) {
    const channel = doc.querySelector('rss channel');
    rssFeed.title = this.getContent(channel,'title');
    rssFeed.description = this.getContent(channel,'description');
    rssFeed.image = this.getContent(channel,'image url');
    channel.querySelectorAll('item').forEach(it => {
      const item = new Item();
      item.title = this.getContent(it, 'title');
      item.description = this.getContent(it, 'description');
      item.link = this.getContent(it, 'link');
      item.guid = this.getContent(it, 'guid');
      rssFeed.item.push(item);
    });
  }
  
  mapFeed(doc: XMLDocument, rssFeed: RSSFeed) {
    const feed = doc.querySelector('feed');
    rssFeed.title = this.getContent(feed, 'title');
    rssFeed.description = this.getContent(feed, 'subtitle');
    rssFeed.image = this.getContent(feed, 'icon');
    feed.querySelectorAll('entry').forEach(it => {
      const item = new Item();
      item.title = this.getContent(it, 'title');
      item.description = this.getContent(it, 'content');
      item.link = this.getAttribute(it, 'link', 'href');
      item.guid = this.getContent(it, 'id');
      rssFeed.item.push(item);
    });
  }

  mapRSSFeed(doc: XMLDocument): RSSFeed {
    const rssFeed = new RSSFeed();
    rssFeed.item = [];
    switch(doc.documentElement.tagName) {
      case 'rss':
        this.mapRSS(doc, rssFeed);
        break;
      case 'feed':
        this.mapFeed(doc, rssFeed);
        break;
    }
    return rssFeed;
  }
}
