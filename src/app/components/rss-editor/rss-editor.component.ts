import { Component, OnInit, ViewChild } from '@angular/core';
import { RSSParserService } from 'src/app/core/services/rssparser.service';
import { RSSLink } from 'src/app/core/models/rsslink';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { DialogBoxComponent } from '../dialog-box/dialog-box.component';

@Component({
  selector: 'app-rss-editor',
  templateUrl: './rss-editor.component.html',
  styleUrls: ['./rss-editor.component.scss']
})
export class RSSEditorComponent implements OnInit {
  rssLinks: RSSLink[];
  columnsToDisplay: string[];
  @ViewChild('rssTable') table: MatTable<any>;

  constructor(private rssService: RSSParserService, public dialog: MatDialog) { 
    this.columnsToDisplay = [];
  }

  ngOnInit(): void {
    this.rssService.getFeeds().subscribe(feeds => {
      this.rssLinks = feeds;
      this.columnsToDisplay = Object.getOwnPropertyNames(this.rssLinks[0]).filter(fld => ['id','ttl'].indexOf(fld) == -1);
      this.columnsToDisplay.push('action');
      console.log(this.rssLinks, this.columnsToDisplay);      
    });
  }

  openDialog(action,obj) {
    obj.action = action;
    const dialogRef = this.dialog.open(DialogBoxComponent, {
      width: '250px',
      data:obj
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Add'){
        this.addRowData(result.data);
      }else if(result.event == 'Update'){
        this.updateRowData(result.data);
      }else if(result.event == 'Delete'){
        this.deleteRowData(result.data);
      }
    });
  }

  addRowData(row_obj){
    delete row_obj.action;
    this.rssService.createFeed(row_obj).subscribe(res => {
      this.rssLinks.push(row_obj);
      console.log(res, this.table);
      this.table.renderRows();
    });    
  }

  updateRowData(row_obj){
    delete row_obj.action;
    this.rssService.updateJSON(row_obj).subscribe(res => {
      this.rssLinks = this.rssLinks.filter((value,key)=>{
        if(value.id == row_obj.id){
          value.label = row_obj.label;
          value.link = row_obj.link;
        }
        return true;
      });
    });
  }
  deleteRowData(row_obj){
    this.rssService.deleteFeed(row_obj.id).subscribe(res => {
      console.log('delete result', res);
      this.rssLinks = this.rssLinks.filter((value,key)=>{
        return value.id != row_obj.id;
      });
    });
  }

}
