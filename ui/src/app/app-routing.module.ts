import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WordMapComponent } from './word-map/word-map.component';

const routes: Routes = [
  { path: '', component: WordMapComponent },
  { path: '**', redirectTo: '/' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
