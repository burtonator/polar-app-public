import {LoginApp} from "./ui/login/LoginApp";

export function startApp() {
    console.log("Starting react app...");
    LoginApp.start();
    console.log("Starting react app...done");
}

document.addEventListener("DOMContentLoaded", () => {

    startApp();

});
