import Vue from 'vue'
import Vuex from 'vuex'
import EventService from '@/services/EventService.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: { id: 'abc123', name: 'Adam Jahr' },
    categories: [
      'sustainability',
      'nature',
      'animal welfare',
      'housing',
      'education',
      'food',
      'community'
    ],
    events: [],
    eventsTotal: 0,
    event: {}
  },
  mutations: {
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
  },
  actions: {
    createEvent({ commit }, event) {
      // create the event on backend service, and wait for completion
      return EventService.postEvent(event).then(() => {
        // once stored in DB, then continue with the dispatcher
        commit('ADD_EVENT', event)
      })
    },
    fetchEvents({ commit }, { perPage, page }) {
      console.log('Page:', page, 'perPage:', perPage)
      EventService.getEvents(perPage, page)
        .then(response => {
          console.log(response.data)
          commit('SET_EVENTS_TOTAL', ++response.headers['x-total-count'])
          commit('SET_EVENTS', response.data)
        })
        .catch(error => {
          console.log('There was error', error)
        })
    },
    fetchEvent({ commit, getters }, id) {
      let event = getters.getEventById(id)

      if (event) {
        commit('SET_EVENT', event)
      } else {
        EventService.getEvent(id)
          .then(response => {
            commit('SET_EVENT', response.data)
          })
          .catch(error => {
            console.log('ERROR:', error)
          })
      }
    }
  },
  getters: {
    getEventById: state => id => {
      return state.events.find(event => event.id === id)
    }
  }
})
