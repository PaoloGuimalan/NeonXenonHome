import { createStore, combineReducers } from 'redux'
import { setappfloater, setapps, setappswindow, setdatetimedata, setnewsdata, settaskbarapps, setweather } from '../actions'

const combiner = combineReducers({
    apps: setapps,
    appfloater: setappfloater,
    appswindow: setappswindow,
    datetimedata: setdatetimedata,
    taskbarapps: settaskbarapps,
    weather: setweather,
    newsdata: setnewsdata
})

const store = createStore(combiner);

export default store;