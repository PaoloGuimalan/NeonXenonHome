import { createStore, combineReducers } from 'redux'
import { setappfloater, setapps, setappswindow } from '../actions'

const combiner = combineReducers({
    apps: setapps,
    appfloater: setappfloater,
    appswindow: setappswindow
})

const store = createStore(combiner);

export default store;