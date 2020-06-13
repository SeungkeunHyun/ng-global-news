import { Component, OnInit } from '@angular/core';
import { RSSLink } from 'src/app/core/models/rsslink';
import { RSSParserService } from 'src/app/core/services/rssparser.service';

@Component({
  selector: 'app-news-board',
  templateUrl: './news-board.component.html',
  styleUrls: ['./news-board.component.scss']
})
export class NewsBoardComponent implements OnInit {
  newsRSS: RSSLink[]  = [{label: 'reddit', link: 'https://www.reddit.com/r/worldnews/.rss'}, {label: 'BBC', link: 'http://feeds.bbci.co.uk/news/world/rss.xml'}
  ,{label: 'NewYork Times', link: 'https://www.nytimes.com/svc/collections/v1/publish/https://www.nytimes.com/section/world/rss.xml'}, {label: 'Al Jazeera', link: 'https://www.aljazeera.com/xml/rss/all.xml'}
  ,{label: 'Yahoo!News', link: 'https://www.yahoo.com/news/rss/world'}
];
  newsContent: Object;
  constructor(private rssparser: RSSParserService) { 
    
  }

  ngOnInit(): void {
    this.newsContent = {};
    this.newsRSS.forEach(it => {
      try {
        this.rssparser.readRSSFeed(it.link).subscribe(dat => this.newsContent[it.label] = dat);
      } catch(ex) {
        console.error(ex);
      }
    });
  }

  fetchNews(evt) {
    console.log('Test', evt);
  }

}
