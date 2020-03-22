import {Component} from '@angular/core';

import {Apollo} from "apollo-angular";
import gql from 'graphql-tag';
import {map, tap} from "rxjs/operators";
import {Observable} from "rxjs";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  courses: Observable<any>;

  constructor(private apollo: Apollo) {}

  execute(query){
    this.courses = this.apollo.watchQuery({
      query: gql`query { ${query} }`
    })
    .valueChanges
    .pipe(
      tap(result => {
        console.log(result)
      }),
      map(result => result.data),
    );
  }
}
