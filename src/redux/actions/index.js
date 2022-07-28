import { SET_APPS, SET_APPS_WINDOW, SET_APP_FLOATER, SET_DATE_TIME_DATA } from "../types";

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

export const datetimedatastate = {
    day: "",
    dayname: "",
    monthname: "",
    year: ""
}

export const setdatetimedata = (state = datetimedatastate, action) => {
    switch(action.type){
        case SET_DATE_TIME_DATA:
            return action.datetimedata;
        default:
            return state;
    }
}