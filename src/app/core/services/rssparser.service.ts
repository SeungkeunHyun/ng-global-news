import { Injectable, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { NgxXml2jsonService } from 'ngx-xml2json';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as xml2js from "xml2js";
import { RSSFeed, Item, IFeedMap } from '../models/rssfeed';
import * as moment from 'moment';
import { ObserversModule } from '@angular/cdk/observers';
import { RSSLink } from '../models/rsslink';

@Injectable({
  providedIn: 'root'
})
export class RSSParserService implements OnInit {
  private parseXML = xml2js.parseString;
  private ta = document.createElement('textarea');
  private corsProxy = 'https://cors-anywhere.herokuapp.com/';
  private feeds: IFeedMap;
  private rssLinks: RSSLink[];
  private rssLinkEndpoint = '/php/rest-sqlite/rss_feeds.php/feeds';
  constructor(private httpClient: HttpClient, private ngxXml2jsonService: NgxXml2jsonService) {
    this.feeds = {};
   }
  ngOnInit(): void {
    
  }

  readRSSFeed(rl: RSSLink): Observable<RSSFeed> {
    if(this.feeds[rl.id] != undefined) {
      console.log(this.feeds[rl.id]);
      return new Observable(observer => observer.next(this.feeds[rl.id]));
    } else {
      return this.httpClient.get(this.corsProxy + rl.link, {responseType: 'text'}).pipe(map((feed:string) => {
        const parser = new DOMParser();
        const obj = parser.parseFromString(feed, "application/xml");
        console.log('XMLDocument', obj);
        this.feeds[rl.id] = this.mapRSSFeed(obj);
        console.log(this.feeds[rl.id]);        
        rl.lastUpdated = this.feeds[rl.id].publishedAt;
        this.updateJSON(rl).subscribe(res => console.log("Update result: ", res));
        return this.feeds[rl.id];
      }));
    }
  }

  createFeed(rl: RSSLink): Observable<any> {
    const headers = new HttpHeaders({'Content-Type':'application/json; charset=utf-8'});
    return this.httpClient.post(this.rssLinkEndpoint, rl, {headers: headers});
  }

  deleteFeed(id: number): Observable<any> {
    const headers = new HttpHeaders({'Content-Type':'application/json; charset=utf-8'});
    delete this.feeds[id];
    this.rssLinks = this.rssLinks.filter((val,key)=> val.id != id);
    return this.httpClient.delete(this.rssLinkEndpoint + '/' + id, {headers: headers});
  }

  getFeeds(): Observable<RSSLink[]> {
    if(this.rssLinks != null) 
      return new Observable(observer => observer.next(this.rssLinks));
    else 
      return this.getJSON(this.rssLinkEndpoint).pipe(map((links: RSSLink[]) => {
        this.rssLinks = links;
        return links;
      }));
  }

  getJSON(uri: string): Observable<any> {
    return this.httpClient.get(uri);
  }

  updateJSON(object: RSSLink) {
    const headers = new HttpHeaders({'Content-Type':'application/json; charset=utf-8'});
    return this.httpClient.put(this.rssLinkEndpoint + '/' + object.id, object, {headers: headers});
  }

  getContent(node: Element, path: string): string {
    const n =  node.querySelector(path);
    if(n) {
      return n.textContent.trim();
    } else {
      console.log('null element', path);
      return '';
    }
  }

  getAttribute(node: Element, path: string, attr: string): string {
    return node.querySelector(path).getAttribute(attr);
  }

  mapRSS(doc: XMLDocument, rssFeed: RSSFeed) {
    const channel = doc.querySelector('rss channel');
    rssFeed.publishedAt = moment().subtract(parseInt(this.getContent(channel, 'ttl')), 'minutes').toDate();
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
    rssFeed.publishedAt = new Date(this.getContent(feed, 'updated'));
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
    console.log(rssFeed);
    return rssFeed;
  }
}
