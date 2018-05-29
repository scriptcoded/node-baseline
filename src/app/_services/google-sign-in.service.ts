import { Injectable } from '@angular/core';

declare const gapi: any;

@Injectable()
export class GoogleSignInService {

  public auth2: any;

  private client_id: string = "556050454772-8u704dkem05gcsb12nvqktv4u6fda25r.apps.googleusercontent.com";

  private scope = [
    "profile",
    "email"
  ].join(" ");

  constructor() {
    this.init()
  }

  public init() {
    gapi.load("auth2", function() {
      this.auth2 = gapi.auth2.init({
        client_id: this.client_id,
        scope: this.scope
      });

      this.attachSignin(document.getElementById('googleBtn'));
    });
  }

  public attachSignin(element) {
    this.auth2.attachClickHandler(element, {},
      (googleUser) => {

        let profile = googleUser.getBasicProfile();
        console.log('Token || ' + googleUser.getAuthResponse().id_token);
        console.log('ID: ' + profile.getId());
        console.log('Name: ' + profile.getName());
        console.log('Image URL: ' + profile.getImageUrl());
        console.log('Email: ' + profile.getEmail());
        //YOUR CODE HERE


      }, (error) => {
        alert(JSON.stringify(error, undefined, 2));
      });
  }

}
