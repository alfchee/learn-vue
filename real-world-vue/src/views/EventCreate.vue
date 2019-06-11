<template>
  <div>
    <h1>Create Event</h1>

    <form @submit.prevent="createEvent">
      <label>Select a category</label>
      <select v-model="event.category">
        <option v-for="cat in categories" :key="cat">{{ cat }}</option>
      </select>

      <h3>Name & decribe your event</h3>
      <BaseInput
        label="Title"
        placeholder="Add an event title"
        type="text"
        v-model="event.title"
      />
      <BaseInput
        label="Description"
        placeholder="Add a description"
        type="text"
        v-model="event.description"
      />

      <h3>Where is your event?</h3>
      <BaseInput
        label="Location"
        placeholder="Add a location"
        type="text"
        v-model="event.location"
      />

      <h3>When is your event?</h3>
      <div class="field">
        <label>Date</label>
        <datepicker v-model="event.date" placeholder="Select a date" />
      </div>
      <div class="field">
        <label>Select a time</label>
        <select v-model="event.time">
          <option v-for="time in times" :key="time">{{ time }}</option>
        </select>
      </div>
      <input type="submit" class="button -fill-gradient" value="Submit" />
    </form>
  </div>
</template>

<script>
import Datepicker from 'vuejs-datepicker'
import NProgress from 'nprogress'

export default {
  components: {
    Datepicker
  },
  data() {
    const times = []
    for (let i = 1; i <= 24; i++) {
      times.push(i + ':00')
    }
    return {
      event: this.createFreshEvent(),
      times,
      categories: this.$store.state.categories
    }
  },
  methods: {
    createEvent() {
      // start the progress bar
      NProgress.start()
      // trigger the create event
      this.$store
        .dispatch('event/createEvent', this.event)
        .then(() => {
          // redirect to the show view
          this.$router.push({
            name: 'event-show',
            params: { id: this.event.id }
          })
          // clear the form, once all the create processing has done
          this.event = this.createFreshEvent()
        })
        .catch(error => {
          console.log('ERROR:', error)
          // end the progress bar
          NProgress.done()
        })
    },
    createFreshEvent() {
      const user = this.$store.state.user.user
      const id = Math.floor(Math.random() * 1000000000)

      return {
        id: id,
        category: '',
        organizer: user,
        title: '',
        description: '',
        location: '',
        date: '',
        time: '',
        attendees: []
      }
    }
  }
}
</script>

<style scoped>
.field {
  margin-bottom: 24px;
}
</style>
