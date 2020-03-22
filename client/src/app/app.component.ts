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

  constructor(private apollo: Apollo) {

    this.courses = this.apollo.watchQuery<any>({
      query: gql`
        query {
          customers (limit: 1, offset:0) {
            customerNumber
            customerName
            postalCode
          }

          employees (limit: 1) {
            employeeNumber
            lastName
            firstName
            jobTitle
            customers (limit: 2) {
              customerName
            }
          }

          customer (id:103) {
            customerNumber
            customerName
            contactLastName
            # contactFirstName
            # salesRepEmployeeNumber
            creditLimit
            salesRep {
              employeeNumber
              lastName
              firstName
            }
          }

          employee (id: 1002) {
            lastName
            firstName
            jobTitle
          }
        }
      `
    })
    .valueChanges
    .pipe(
      tap(result => {
        debugger
        console.log(result)
      }),
      map(result => result.data),
    );
  }
}
