import { state } from '@angular/animations';
import { Component, Inject, OnInit } from '@angular/core';
import { OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth, pkce } from '@okta/okta-auth-js';
import oktaSignIn from '@okta/okta-signin-widget'
import myappConfig from 'src/app/config/myapp-config';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
 
  oktaSignin:any;

  constructor(@Inject(OKTA_AUTH) private oktaAuth:OktaAuth){
    this.oktaSignin = new oktaSignIn({
      logo:'assets/images/logo.png',
      baseUrl:myappConfig.oidc.issuer.split('/oauth2')[0],
      clientId:myappConfig.oidc.clientId,
      redirectUri:myappConfig.oidc.redirectUri,
      authParams:{
        pkce:true,
        issuer:myappConfig.oidc.issuer,
        scope:myappConfig.oidc.scope
      }
    })
  }
 
  ngOnInit(): void {
   this.oktaSignin.remove();
   this.oktaSignin.renderEl({
    el:'#okta-sign-in-widget' },
    (respone:any)=>{
      if(respone.status === 'SUCCESS'){
        this.oktaAuth.signInWithRedirect();
      }
    },
    (error:any) =>{
      throw error;
    }
  )
  }



}
