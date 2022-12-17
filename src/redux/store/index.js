import { createStore, combineReducers } from 'redux'
import { setappfloater, setapps, setappswindow, setdatetimedata, setdraggablewindow, setnewsdata, setnotificationslist, setorientationstatus, setpwalist, settaskbarapps, setweather } from '../actions'

const combiner = combineReducers({
    apps: setapps,
    appfloater: setappfloater,
    appswindow: setappswindow,
    datetimedata: setdatetimedata,
    taskbarapps: settaskbarapps,
    weather: setweather,
    newsdata: setnewsdata,
    draggablewindow: setdraggablewindow,
    pwalist: setpwalist,
    orientationstatus: setorientationstatus,
    notificationslist: setnotificationslist
})

const store = createStore(combiner);

export default store;