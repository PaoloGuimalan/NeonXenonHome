import { SET_APPS, SET_APPS_WINDOW, SET_APP_FLOATER, SET_DATE_TIME_DATA, SET_NEWS_DATA, SET_TASKBAR_APPS, SET_WEATHER } from "../types";

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

export const settaskbarapps = (state = [], action) => {
    switch(action.type){
        case SET_TASKBAR_APPS:
            return action.taskbarapps;
        default:
            return state
    }
}

export const weatherDataState = {
    icon: "",
    status: "No Data",
    location: "No Data",
    lastupdated: "",
    temp_c: "N/A",
    temp_f: "N/A"
  }

export const setweather = (state = weatherDataState, action) => {
    switch(action.type){
        case SET_WEATHER:
            return action.weather;
        default:
            return state;
    }
}

export const newsDataState = {
    numbers: "No News",
    articles: []
}

export const setnewsdata = (state = newsDataState, action) => {
    switch(action.type){
        case SET_NEWS_DATA:
            return action.newsdata;
        default:
            return state;
    }
}