import { ipcRenderer } from 'electron'
import Mastodon from 'mastodon-api'

const Lists = {
  namespaced: true,
  state: {
    timeline: [],
    lazyLoading: false
  },
  mutations: {
    appendTimeline (state, update) {
      state.timeline = [update].concat(state.timeline)
    },
    updateTimeline (state, timeline) {
      state.timeline = timeline
    },
    insertTimeline (state, messages) {
      state.timeline = state.timeline.concat(messages)
    },
    updateToot (state, message) {
      state.timeline = state.timeline.map((toot) => {
        if (toot.id === message.id) {
          return message
        } else if (toot.reblog !== null && toot.reblog.id === message.id) {
          // When user reblog/favourite a reblogged toot, target message is a original toot.
          // So, a message which is received now is original toot.
          const reblog = {
            reblog: message
          }
          return Object.assign(toot, reblog)
        } else {
          return toot
        }
      })
    },
    changeLazyLoading (state, value) {
      state.lazyLoading = value
    }
  },
  actions: {
    fetchTimeline ({ state, commit, rootState }, listID) {
      return new Promise((resolve, reject) => {
        const client = new Mastodon(
          {
            access_token: rootState.TimelineSpace.account.accessToken,
            api_url: rootState.TimelineSpace.account.baseURL + '/api/v1'
          })
        client.get(`/timelines/list/${listID}`, { limit: 40 }, (err, data, res) => {
          if (err) return reject(err)
          commit('updateTimeline', data)
          resolve(res)
        })
      })
    },
    startStreaming ({ state, commit, rootState }, listID) {
      ipcRenderer.on('update-start-list-streaming', (event, update) => {
        commit('appendTimeline', update)
      })
      return new Promise((resolve, reject) => {
        ipcRenderer.send('start-list-streaming', {
          list_id: listID,
          account: rootState.TimelineSpace.account
        })
        ipcRenderer.once('error-start-list-streaming', (event, err) => {
          reject(err)
        })
      })
    },
    stopStreaming ({ commit }) {
      return new Promise((resolve, reject) => {
        ipcRenderer.removeAllListeners('error-start-list-streaming')
        ipcRenderer.removeAllListeners('update-start-list-streaming')
        ipcRenderer.send('stop-list-streaming')
        resolve()
      })
    },
    lazyFetchTimeline ({ state, commit, rootState }, obj) {
      return new Promise((resolve, reject) => {
        if (state.lazyLoading) {
          return resolve()
        }
        commit('changeLazyLoading', true)
        const client = new Mastodon(
          {
            access_token: rootState.TimelineSpace.account.accessToken,
            api_url: rootState.TimelineSpace.account.baseURL + '/api/v1'
          })
        client.get(`/timelines/list/${obj.list_id}`, { max_id: obj.last.id, limit: 40 }, (err, data, res) => {
          if (err) return reject(err)
          commit('insertTimeline', data)
          commit('changeLazyLoading', false)
        })
      })
    }
  }
}

export default Lists
