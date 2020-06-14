import { Component, OnInit } from '@angular/core';
import { RSSLink } from 'src/app/core/models/rsslink';
import { RSSParserService } from 'src/app/core/services/rssparser.service';
import { RSSFeed } from 'src/app/core/models/rssfeed';

@Component({
  selector: 'app-news-board',
  templateUrl: './news-board.component.html',
  styleUrls: ['./news-board.component.scss']
})
export class NewsBoardComponent implements OnInit {
  newsRSS: RSSLink[];
  /*
  [{label: 'reddit', link: 'https://www.reddit.com/r/worldnews/.rss'}, {label: 'BBC', link: 'http://feeds.bbci.co.uk/news/world/rss.xml'}
  ,{label: 'NewYork Times', link: 'https://www.nytimes.com/svc/collections/v1/publish/https://www.nytimes.com/section/world/rss.xml'}, {label: 'Al Jazeera', link: 'https://www.aljazeera.com/xml/rss/all.xml'}
  ,{label: 'Yahoo!News', link: 'https://www.yahoo.com/news/rss/world'}
  ];
  */

  newsContent: Object;
  constructor(private rssparser: RSSParserService) { 
    
  }

  ngOnInit(): void {
    this.rssparser.getFeeds().subscribe(feeds => {
      this.newsRSS = feeds;
      this.setNewsContent();
    });
  }

  setNewsContent() {
    this.newsContent = {};
    this.newsRSS.forEach(it => {
      try {
        this.rssparser.readRSSFeed(it).subscribe((dat: RSSFeed) => {
          this.newsContent[it.label] = dat;
        });
      } catch(ex) {
        console.error(ex);
      }
    });
  }

  fetchNews(evt) {
    console.log('Test', evt);
  }

}
