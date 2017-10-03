import { EventData } from "data/observable";
import { RadSideDrawer } from "nativescript-telerik-ui/sidedrawer";
import { topmost } from "ui/frame";
import { NavigatedData, Page } from "ui/page";
import * as utils from "utils/utils";

import { HomeViewModel } from "./home-view-model";
import * as OidcUtils from "../utils/oidc-utils";
import { Utils } from "../utils/utils";
import * as Constants from "../utils/constants";


let homeViewModel: HomeViewModel = new HomeViewModel();

/* ***********************************************************
* Use the "onNavigatingTo" handler to initialize the page binding context.
*************************************************************/
export function onNavigatingTo(args: NavigatedData) {
    /* ***********************************************************
    * The "onNavigatingTo" event handler lets you detect if the user navigated with a back button.
    * Skipping the re-initialization on back navigation means the user will see the
    * page in the same data state that he left it in before navigating.
    *************************************************************/
    if (args.isBackNavigation) {
        return;
    }

    homeViewModel = new HomeViewModel();

    const page = <Page>args.object;
    page.bindingContext = homeViewModel;
}

/* ***********************************************************
* According to guidelines, if you have a drawer on your page, you should always
* have a button that opens it. Get a reference to the RadSideDrawer view and
* use the showDrawer() function to open the app drawer section.
*************************************************************/
export function onDrawerButtonTap(args: EventData) {
    const sideDrawer = <RadSideDrawer>topmost().getViewById("sideDrawer");
    sideDrawer.showDrawer();
}

export function openLoginPage() {
    OidcUtils.openLoginPage();
}

export function getAccessToken() {
    OidcUtils.getAccesData().then(response => {
        let accessToken = OidcUtils.getAccessToken(response);
        console.log(accessToken);
        homeViewModel.set("accessToken", accessToken);
        homeViewModel.set("getAccessTokenOutcome", "Very good");
    }, function (e) {
        console.log(e);
        OidcUtils.openLoginPage();
    });
}

export function logout() {
    OidcUtils.openLogoutPage();
}

export function clearSecureStorage() {
    OidcUtils.clearSecureStorage();
}
