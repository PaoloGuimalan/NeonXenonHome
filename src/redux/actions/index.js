import { SET_APPS, SET_APPS_WINDOW, SET_APP_FLOATER } from "../types";

export const setapps = (state = [], action) => {
    switch(action.type){
        case SET_APPS:
            return action.apps;
        default:
            return state;
    }
}

export const appfloatestate = {appname: "", appcom: "", appbase: "", appstate: ""}

export const setappfloater = (state = appfloatestate, action) => {
    switch(action.type){
        case SET_APP_FLOATER:
            return action.appfloater;
        default:
            return state;
    }
}

export const setappswindow = (state = false, action) => {
    switch(action.type){
        case SET_APPS_WINDOW:
            return action.appswindow;
        default:
            return state;
    }
}