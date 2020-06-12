import { Component, OnInit } from '@angular/core';
import { RSSLink } from 'src/app/core/models/rsslink';
import { HttpClientService } from 'src/app/core/services/http-client.service';

@Component({
  selector: 'app-news-board',
  templateUrl: './news-board.component.html',
  styleUrls: ['./news-board.component.scss']
})
export class NewsBoardComponent implements OnInit {
  newsRSS: RSSLink[]  = [{label: 'reddit', link: 'https://www.reddit.com/r/worldnews/.rss'}, {label: 'BBC', link: 'http://feeds.bbci.co.uk/news/world/rss.xml'}];
  newsContent: Object;
  constructor(private httpService: HttpClientService) { 
    this.newsRSS.forEach(it => {
      console.log(it);
    });
  }

  ngOnInit(): void {
  }

  fetchNews(evt) {
    console.log(evt);
  }

}
