import { Observable } from "data/observable";
import { handleOpenURL, AppURL } from "nativescript-urlhandler";
import * as Constants from "../utils/constants";
import * as http  from "http";
import { Utils } from "../utils/utils";
import { SecureStorage } from "nativescript-secure-storage";
import * as OidcUtils from "../utils/oidc-utils";

import * as dialogs from "ui/dialogs";



export class HomeViewModel extends Observable {

    keycloakUrl: string;
    callbackUrl: string;
    accessTokenBody: any;

    constructor() {
        super();

        /* 
        * Check in home page constructor (or in method onNavigatingTo of home-page) if there is a valid (not expired) access_token 
        * stored in secure storage.
        * If the access_token is valid, use it to call services. If is not valid (expired), check if there is
        * a valid refresh_token in secure storage.
        * If refresh_token is not expired, use it to get a valid access_token from keycloak. If is expired
        * a new login is needed.
        */

        let secureStorage = new SecureStorage();

        handleOpenURL((appURL: AppURL) => {

             // Read Authorization code parameter from callback url
            let code = appURL.params.get("code");
            let logout = appURL.params.get("logout");

            if (code) {
                // login
                this.callbackUrl = appURL.toString();
                this.set("testUrl", appURL.toString());
                console.log("App URL: " + this.callbackUrl);
    
                console.log(code);
    
                // Build queryString to request access token
    
                let params: any = {
                    grant_type: "authorization_code",
                    client_id: Constants.KEYCLOAK_CLIENT_ID,
                    client_secret: Constants.KEYCLOAK_CLIENT_SECRET,
                    code: code,
                    redirect_uri: Constants.KEYCLOAK_REDIRECT_URL
                }
    
                let data: string = Utils.buildQueryString(params);
    
                this.set("authCode", code);
            
                // Exchange the Authorization Code for an Access Token
                let options = {
                    method: "POST",
                    url: Constants.KEYCLOAK_ACCESS_URL,
                    headers: { "content-type": "application/x-www-form-urlencoded" }, // Keycloak needs this content type
                    content: data
                };
              
                http.request(options).then((response) => {
                    //this.set("tokenType", response.content.toJSON().token_type);
                    this.set("expiresIn", response.content.toJSON().expires_in);
                    //this.accessTokenBody = response.content.toJSON();
                    console.log(response.content.toJSON());
    
                    let responseObj = response.content.toJSON();
                    
                    // Store jwt tokens in secure storage
                    let stored = OidcUtils.saveAccessData(responseObj);
    
                    if (!stored) {
                        console.error("Error in saving access data.")
                    }
                    else {
                        console.log("Access data saved in secure storage.")
                    }
    
                }, function (e) {
                    console.log("Error occurred: " + e);
                });
            }
            else if (logout) {
                //logout
                secureStorage.removeAll();
                dialogs.alert("Logout effettuato.");
            }
            

            // Does secure storage work?
            secureStorage.get({
                key: "token_type"
            }).then(tokenType => this.set("tokenType", tokenType));

            secureStorage.get({
                key: "access_token"
            }).then(accessToken => this.set("accessToken", accessToken));

            secureStorage.get({
                key: "refresh_token"
            }).then(refreshToken => console.log("refresh_token: ", refreshToken));

        });

    }

}
