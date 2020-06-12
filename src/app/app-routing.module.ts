import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewsBoardComponent } from './components/news-board/news-board.component';
import { RSSEditorComponent } from './components/rss-editor/rss-editor.component';


const routes: Routes = [{path: 'news-board', component: NewsBoardComponent}
, {path: 'rss-editor', component: RSSEditorComponent}
, {path: '', redirectTo: '/news-board', pathMatch: 'full'}
, {path: '**', component: NewsBoardComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
