import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute) { }
  routeIsActive(routePath: string) {
    return this.router.url == routePath;
  }
  ngOnInit(): void {
    console.log(this.router, this.route.snapshot);
  }

}
