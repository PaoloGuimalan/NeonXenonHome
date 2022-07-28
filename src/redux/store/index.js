import { createStore, combineReducers } from 'redux'
import { setappfloater, setapps, setappswindow, setdatetimedata } from '../actions'

const combiner = combineReducers({
    apps: setapps,
    appfloater: setappfloater,
    appswindow: setappswindow,
    datetimedata: setdatetimedata
})

const store = createStore(combiner);

export default store;