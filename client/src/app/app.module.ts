import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from "@angular/common/http";

import {Apollo, ApolloModule} from "apollo-angular";
import {InMemoryCache} from "apollo-cache-inmemory";
import {HttpLink, HttpLinkModule} from "apollo-angular-link-http";

import {AppComponent} from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    ApolloModule,
    BrowserModule,
    HttpLinkModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(apollo: Apollo, httpLink: HttpLink) {
    const uri = 'http://' + location.hostname + ':4000';
    console.log({uri});

    apollo.create({
      link: httpLink.create({uri}),
      cache: new InMemoryCache()
    });
  }
}
