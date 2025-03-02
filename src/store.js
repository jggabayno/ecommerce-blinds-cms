import { applyMiddleware, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import promise from 'redux-promise'
import reducers from './reducers'

const composeMiddleware = process.env.NODE_ENV.includes('production') 
? applyMiddleware(promise, thunk)
: composeWithDevTools(applyMiddleware(promise, thunk))

const store = createStore(reducers, composeMiddleware)

export default store