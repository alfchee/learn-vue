import EventService from '@/services/EventService.js'

export const namespaced = true

export const state = {
  events: [],
  eventsTotal: 0,
  event: {},
  perPage: 3
}

export const mutations = {
  ADD_EVENT(state, event) {
    state.events.push(event)
  },
  SET_EVENTS(state, events) {
    state.events = events
  },
  SET_EVENTS_TOTAL(state, total) {
    state.eventsTotal = total
  },
  SET_EVENT(state, event) {
    state.event = event
  }
}

export const actions = {
  createEvent({ commit, dispatch }, event) {
    // create the event on backend service, and wait for completion
    return EventService.postEvent(event)
      .then(() => {
        // once stored in DB, then continue with the dispatcher
        commit('ADD_EVENT', event)

        // creating success notification
        const notification = {
          type: 'success',
          message: 'Your event has been created!'
        }
        // adding the notification to the state
        dispatch('notification/add', notification, { root: true })
      })
      .catch(err => {
        // creating a notification with the error message
        const notification = {
          type: 'error',
          message: 'There was a problem creating your event: ' + err.message
        }
        // adding the notification to the state
        dispatch('notification/add', notification, { root: true })
        throw err
      })
  },
  fetchEvents({ commit, dispatch, state }, { page }) {
    return EventService.getEvents(state.perPage, page)
      .then(response => {
        console.log(response.data)
        commit('SET_EVENTS_TOTAL', ++response.headers['x-total-count'])
        commit('SET_EVENTS', response.data)
      })
      .catch(error => {
        // creating a notification with the error message
        const notification = {
          type: 'error',
          message: 'There was a problem fetching events: ' + error.message
        }
        // adding the notification to the state
        dispatch('notification/add', notification, { root: true })
      })
  },
  fetchEvent({ commit, getters, dispatch }, id) {
    let event = getters.getEventById(id)

    if (event) {
      commit('SET_EVENT', event)
      return event
    } else {
      return EventService.getEvent(id)
        .then(response => {
          commit('SET_EVENT', response.data)
          return response.data
        })
        .catch(error => {
          // creating a notification with the error message
          const notification = {
            type: 'error',
            message: 'There was a problem fetching event: ' + error.message
          }
          // adding the notification to the state
          dispatch('notification/add', notification, { root: true })
        })
    }
  }
}

export const getters = {
  getEventById: state => id => {
    return state.events.find(event => event.id === id)
  }
}
