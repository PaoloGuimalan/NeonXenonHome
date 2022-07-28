import { createStore, combineReducers } from 'redux'
import { setappfloater, setapps, setappswindow, setdatetimedata, settaskbarapps } from '../actions'

const combiner = combineReducers({
    apps: setapps,
    appfloater: setappfloater,
    appswindow: setappswindow,
    datetimedata: setdatetimedata,
    taskbarapps: settaskbarapps
})

const store = createStore(combiner);

export default store;