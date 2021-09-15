<template>
  <div>
    <b-container fluid>
      <div class="b-calendar">
        <b-row>
          <b-col lg="4">
            <div class="b-calendar__information">
              <div class="selected-date">
                <div>
                  <span class="weekday">{{selectedWeekDay | capitalize}}</span>
                </div>
                <span class="day">{{selectedDayAndMonth.day}}</span>
                <span class="month">{{selectedDayAndMonth.month | capitalize}}</span>
              </div>
              <div class="b-event-container" v-if="windowWidth > 480">
                <h4>Events:</h4>
                <create-event-form v-on:create="createEvent" v-on:update="newEventForm.eventTitle = $event"></create-event-form>
                <b-button-group size="sm">
                  <b-button variant="outline-light" :class="{'active': visibility === 'all'}" @click="changeVisibility('all')">All
                  </b-button>
                  <b-button variant="outline-light" :class="{'active': visibility === 'completed'}" @click="changeVisibility('completed')">Completed
                  </b-button>
                  <b-button variant="outline-light" :class="{'active': visibility === 'active'}" @click="changeVisibility('active')">Active
                  </b-button>
                </b-button-group>
                <transition-group name="event-list" tag="ul" class="event-list" v-if="filteredEventListForSelectedDate.length > 0">
                  <li class="event" :class="{'completed': event.completed}" v-for="event in filteredEventListForSelectedDate" :key="event.id">
                    <span class="title">{{event.title}}</span>
                    <div class="buttons">
                      <b-button class="completed-event-btn" :class="{'completed': event.completed}" @click="changeCompletedEvent(event)">
                        <i class="fa" :class="event.completed ? 'fa-check-square' : 'fa-square-o'" aria-hidden="true"></i>
                      </b-button>
                      <b-button class="delete-event-btn" @click="deleteEvent(event)">
                        <i class="fa fa-trash" aria-hidden="true"></i>
                      </b-button>
                    </div>
                  </li>
                </transition-group>
                <div class="no-events text-center" v-else>
                  Event list is empty...
                </div>
              </div>
              <b-link href="#" class="go-today-link" @click="goToday" v-show="!todayInCurrentMonthAndYear || !todayIsEqualSelectDate">
                Go today
              </b-link>
            </div>
          </b-col>
          <b-col lg="8">
            <div class="b-calendar__calendar">
              <div class="b-calendar__header">
                <b-row>
                  <b-col class="year text-right" align-h="end">
                    <span>{{year}}</span>
                  </b-col>
                </b-row>
                <b-row align-v="center">
                  <b-col class="text-left" align-h="start">
                    <b-button id="goTodayBtn" class="go-today-btn" variant="outline-dark" @click="goToday" v-show="!todayInCurrentMonthAndYear || !todayIsEqualSelectDate">
                      Today
                    </b-button>
                    <b-tooltip target="goTodayBtn" v-show="!todayInCurrentMonthAndYear || !todayIsEqualSelectDate">
                      Back to today
                    </b-tooltip>
                  </b-col>
                  <b-col class="text-center" align-h="center">

                  </b-col>
                  <b-col class="month-change-container text-right d-flex flex-row-reverse align-items-center" align-h="end">
                    <b-button id="addMonthBtn" class="arrow arrow-right" variant="light" @click="addMonth">
                      <i class="fa fa-fw fa-chevron-right"></i>
                    </b-button>
                    <b-tooltip target="addMonthBtn">
                      {{nextMonthAsString | capitalize}}
                    </b-tooltip>
                    <div class="month text-center">{{month}}</div>
                    <b-button id="subtractMonthBtn" class="arrow arrow-left" variant="light" @click="subtractMonth">
                      <i class="fa fa-fw fa-chevron-left"></i>
                    </b-button>
                    <b-tooltip target="subtractMonthBtn">
                      {{previousMonthAsString | capitalize}}
                    </b-tooltip>
                  </b-col>
                </b-row>
              </div>
              <div class="b-calendar__weekdays">
                <div class="weekday" v-for="(day, index) in days" :key="index">
                  <strong>{{day}}</strong>
                </div>
              </div>
              <div class="b-calendar__dates">
                <div class="date text-right" :class="{
                                      'selected': dateIsEqualSelectDate(date),
                                      'today': date.today,
                                      'blank': date.blank,
                                      'no-border-right': date.key % 7 === 0
                                  }" v-for="date in dateList" :key="date.key" :data-date="date.date">
                  <a class="link" @click="setSelectedDate(date.moment)"></a>
                  <span class="day">{{date.dayNumber}}</span>
                  <span class="weekday">{{date.weekDay}}</span>
                  <div class="additional" v-show="date.additional">
                    <span class="year" v-show="date.additional.year">{{date.additional.year}}</span>
                    <span class="month" v-show="date.additional.month">{{date.additional.month}}</span>
                  </div>
                  <b-collapse :id="'collapseEvent' + date.key" class="b-event-container event-mobile-container" :class="{'show': !collapseEventList}" v-if="((windowWidth <= 480) && dateIsEqualSelectDate(date))">
                    <h4>Events:</h4>
                    <create-event-form v-on:create="createEvent" v-on:update="newEventForm.eventTitle = $event"></create-event-form>
                    <b-button-group size="sm">
                      <b-button variant="outline-light" :class="{'active': visibility === 'all'}" @click="changeVisibility('all')">All
                      </b-button>
                      <b-button variant="outline-light" :class="{'active': visibility === 'completed'}" @click="changeVisibility('completed')">Completed
                      </b-button>
                      <b-button variant="outline-light" :class="{'active': visibility === 'active'}" @click="changeVisibility('active')">Active
                      </b-button>
                    </b-button-group>
                    <transition-group name="event-list" tag="ul" class="event-list" v-if="filteredEventListForSelectedDate.length > 0">
                      <li class="event" :class="{'completed': event.completed}" v-for="event in filteredEventListForSelectedDate" :key="event.id">
                        <span class="title">{{event.title}}</span>
                        <div class="buttons">
                          <b-button class="completed-event-btn" :class="{'completed': event.completed}" @click="changeCompletedEvent(event)">
                            <i class="fa" :class="event.completed ? 'fa-check-square' : 'fa-square-o'" aria-hidden="true"></i>
                          </b-button>
                          <b-button class="delete-event-btn" @click="deleteEvent(event)">
                            <i class="fa fa-trash" aria-hidden="true"></i>
                          </b-button>
                        </div>
                      </li>
                    </transition-group>
                    <div class="no-events text-center" v-else>
                      Event list is empty...
                    </div>
                  </b-collapse>
                </div>
              </div>
            </div>
          </b-col>
        </b-row>
      </div>
    </b-container>
  </div>
</template>

<script>
const moment = require('moment')
const STORAGE_KEY = 'CEfSCfSM'
const VISIBILITY_FOR_DATE = 'forDate'
const VISIBILITY_ALL = 'all'
// const VISIBILITY_ACTIVE = 'active'
// const VISIBILITY_COMPLETED = 'completed'

var eventStorage = {
  fetch: function () {
    var eventList = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    eventList.forEach(function (event, index) {
      event.id = index
    })
    eventStorage.uid = eventList.length
    return eventList
  },
  save: function (eventList) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(eventList))
  }
}

var filters = {
  forDate: function (eventList, selectedDate) {
    return eventList.filter(function (event) {
      return event.date === selectedDate
    })
  },
  all: function (eventList) {
    return eventList
  },
  active: function (eventList) {
    return eventList.filter(function (event) {
      return !event.completed
    })
  },
  completed: function (eventList) {
    return eventList.filter(function (event) {
      return event.completed
    })
  }
}

export default {
  name: 'Home',
  components: {
    'create-event-form': {
      template: `<b-form class="create-event-form" @submit="onSubmit" inline>
        <input class="form-control event-title-input" type="text" autocomplete="off"
           placeholder="New event title..." v-model="eventTitle"
           @keyup.enter="createEvent" @input="updateInParent">
        </input>
        <b-button id="addEventBtn" variant="outline-light" @click="createEvent">
            <i class="fa fa-plus" aria-hidden="true"></i>
        </b-button>
        <b-tooltip target="addEventBtn">
            Add new event
        </b-tooltip>
    </b-form>`,
      data: function () {
        return {
          eventTitle: ''
        }
      },
      methods: {
        // disable form submitting
        onSubmit: function (event) {
          event.preventDefault()
        },
        createEvent: function () {
          this.$emit('create', true)
          this.eventTitle = ''
        },
        updateInParent: function () {
          this.$emit('update', this.eventTitle)
        }
      }
    }
  },
  data: function () {
    return {
      // calendar
      today: moment(),
      dateContext: moment(),
      selectedDate: moment(),
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      // events
      newEventForm: {
        eventTitle: ''
      },
      eventList: eventStorage.fetch(),
      visibility: VISIBILITY_ALL,
      windowWidth: window.outerWidth,
      collapseEventList: true
    }
  },
  watch: {
    eventList: {
      handler: function (eventList) {
        eventStorage.save(eventList)
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    // calendar
    year: function () {
      return this.dateContext.format('Y')
    },
    month: function () {
      return this.dateContext.format('MMMM')
    },
    daysInMonth: function () {
      return this.dateContext.daysInMonth()
    },
    currentDate: function () {
      return this.dateContext.get('date')
    },
    firstDayOfMonth: function () {
      let firstDay = moment(this.dateContext).subtract(
        this.currentDate,
        'days'
      )
      return firstDay.weekday()
    },
    previousMonth: function () {
      return moment(this.dateContext).subtract(1, 'month')
    },
    previousMonthAsString: function () {
      return this.previousMonth.format('MMMM')
    },
    nextMonth: function () {
      return moment(this.dateContext).add(1, 'month')
    },
    nextMonthAsString: function () {
      return this.nextMonth.format('MMMM')
    },

    daysInPreviousMonth: function () {
      return this.previousMonth.daysInMonth()
    },
    daysFromPreviousMonth: function () {
      let daysList = []
      let count = this.daysInPreviousMonth - this.firstDayOfMonth
      while (count < this.daysInPreviousMonth) {
        count++
        daysList[count] = count
      }

      return daysList.filter(function () {
        return true
      })
    },

    dateList: function () {
      let $this = this

      let dateList = []

      let previousMonth = this.previousMonth
      let nextMonth = this.nextMonth

      // dates for display
      let formattedCurrentMonth = this.dateContext.format('MM')
      let formattedCurrentYear = this.year
      let formattedPreviousMonth = previousMonth.format('MM')
      let formattedPreviousYear = previousMonth.format('Y')
      let formattedNextMonth = nextMonth.format('MM')
      let formattedNextYear = nextMonth.format('Y')

      // counters
      let countDayInCurrentMonth = 0
      let countDayInPreviousMonth = 0

      // filling in dates from the previous month
      this.daysFromPreviousMonth.forEach(function (dayFromPreviousMonth) {
        countDayInCurrentMonth++
        countDayInPreviousMonth++

        let formattedDay = $this.formattingDay(dayFromPreviousMonth)
        let previousMonth =
                    $this.daysFromPreviousMonth.length ===
                    countDayInPreviousMonth
                      ? $this.previousMonthAsString
                      : false
        let previousYear =
                    formattedCurrentYear !== formattedPreviousYear &&
                    $this.daysFromPreviousMonth.length ===
                        countDayInPreviousMonth
                      ? formattedPreviousYear
                      : false
        let additional = {
          month: previousMonth,
          year: previousYear
        }

        if (!previousMonth && !previousYear) {
          additional = false
        }

        dateList[countDayInCurrentMonth] = {
          key: countDayInCurrentMonth,
          dayNumber: formattedDay,
          date:
                        formattedDay +
                        '.' +
                        formattedPreviousMonth +
                        '.' +
                        formattedPreviousYear,
          blank: true,
          today: false,
          additional: additional,
          weekDay: false,
          moment: moment(
            formattedPreviousYear +
                            formattedPreviousMonth +
                            formattedDay
          )
        }
      })

      // filling in dates from the current month
      while (
        countDayInCurrentMonth <
                this.firstDayOfMonth + this.daysInMonth
      ) {
        countDayInCurrentMonth++

        let day = countDayInCurrentMonth - countDayInPreviousMonth
        let weekDay = this.getWeekDay(countDayInCurrentMonth)
        let formattedDay = this.formattingDay(day)

        dateList[countDayInCurrentMonth] = {
          key: countDayInCurrentMonth,
          dayNumber: formattedDay,
          date:
                        formattedDay +
                        '.' +
                        formattedCurrentMonth +
                        '.' +
                        formattedCurrentYear,
          blank: false,
          today:
                        formattedDay === this.todayDate &&
                        this.todayInCurrentMonthAndYear,
          additional: false,
          weekDay: weekDay,
          moment: moment(
            formattedCurrentYear +
                            formattedCurrentMonth +
                            formattedDay
          )
        }
      }

      let daysInNextMonth = 7 - (countDayInCurrentMonth % 7)
      let countDayInCurrentMonthSaved = countDayInCurrentMonth
      let day = 0

      // filling in dates from the next month
      if (daysInNextMonth < 7) {
        while (
          countDayInCurrentMonth <
                    countDayInCurrentMonthSaved + daysInNextMonth
        ) {
          countDayInCurrentMonth++
          day++

          let formattedDay = this.formattingDay(day)
          let nextMonth = day === 1 ? this.nextMonthAsString : false
          let nextYear =
                        formattedCurrentYear !== formattedNextYear && day === 1
                          ? formattedNextYear
                          : false
          let additional = {
            month: nextMonth,
            year: nextYear
          }

          if (!nextMonth && !nextYear) {
            additional = false
          }

          dateList[countDayInCurrentMonth] = {
            key: countDayInCurrentMonth,
            dayNumber: formattedDay,
            date:
                            formattedDay +
                            '.' +
                            formattedNextMonth +
                            '.' +
                            formattedNextYear,
            blank: true,
            today: false,
            additional: additional,
            weekDay: false,
            moment: moment(
              formattedNextYear +
                                formattedNextMonth +
                                formattedDay
            )
          }
        }
      }

      return dateList.filter(function () {
        return true
      })
    },

    todayDate: function () {
      return this.formattingDay(this.today.get('date'))
    },
    todayMonth: function () {
      return this.today.format('MMMM')
    },
    todayYear: function () {
      return this.today.format('Y')
    },

    // get selected day and month
    todayInCurrentMonthAndYear: function () {
      return (
        this.month === this.todayMonth && this.year === this.todayYear
      )
    },

    // get selected day and month
    selectedDayAndMonth: function () {
      let dayAndMonth = this.selectedDate.format('DD MMMM')
      dayAndMonth = dayAndMonth.split(' ')
      dayAndMonth = {
        day: dayAndMonth[0],
        month: dayAndMonth[1]
      }

      return dayAndMonth
    },

    // get selected weekday
    selectedWeekDay: function () {
      return this.selectedDate.format('dddd')
    },

    // comparison today with selectedDate
    todayIsEqualSelectDate: function () {
      return (
        this.selectedDate.format('YYYYMMDD') ===
                this.today.format('YYYYMMDD')
      )
    },

    // events
    /**
         *  get list events for selected in calendar date
         */
    eventListForSelectedDate: function () {
      return filters[VISIBILITY_FOR_DATE](
        this.eventList,
        this.selectedDate.format('DD.MM.YYYY')
      )
    },

    /**
         *  get filtered list events for selected in calendar date and completed filter
         */
    filteredEventListForSelectedDate: function () {
      return filters[this.visibility](this.eventListForSelectedDate)
    }
  },
  methods: {
    // calendar

    // changing date list
    addMonth: function () {
      this.dateContext = this.nextMonth
    },
    subtractMonth: function () {
      this.dateContext = this.previousMonth
    },

    // changing selected date
    setSelectedDate: function (moment) {
      if (
        this.selectedDate.format('YYYYMMDD') !==
                moment.format('YYYYMMDD')
      ) {
        this.selectedDate = moment
        this.collapseEventList = false
      } else {
        this.collapseEventList = !this.collapseEventList
      }
    },

    // set selected date as today
    goToday: function () {
      this.selectedDate = this.today
      this.dateContext = this.today
    },

    // add 0 before [1..9] numbers in day
    formattingDay: function (day) {
      return ('0' + day).slice(-2)
    },

    // get weekday from data Weekdays
    getWeekDay: function (day) {
      let index = day
      if (index > 7) {
        index %= 7
      }
      index = index === 0 ? 6 : index - 1
      return this.days[index]
    },

    // selected date compare with date
    dateIsEqualSelectDate: function (date) {
      return (
        this.selectedDate.format('YYYYMMDD') ===
                date.moment.format('YYYYMMDD')
      )
    },

    // events

    // disable form submitting
    onSubmit: function (event) {
      event.preventDefault()
    },
    // adding event
    createEvent: function () {
      let eventTitle =
                this.newEventForm.eventTitle &&
                this.newEventForm.eventTitle.trim()
      if (!eventTitle) {
        return
      }
      this.eventList.push({
        id: eventStorage.uid++,
        title: eventTitle,
        completed: false,
        date: this.selectedDate.format('DD.MM.YYYY')
      })
      this.newEventForm.eventTitle = ''
    },

    changeCompletedEvent: function (event) {
      event.completed = !event.completed
    },

    deleteEvent: function (event) {
      let index = this.eventList.indexOf(event)
      this.eventList.splice(index, 1)
    },

    changeVisibility: function (visibility) {
      if (filters[visibility]) {
        this.visibility = visibility
      } else {
        this.visibility = VISIBILITY_ALL
      }
    }
  },
  filters: {
    capitalize: function (value) {
      if (!value) return ''
      value = value.toString()
      return value.charAt(0).toUpperCase() + value.slice(1)
    }
  },
  mounted () {
    this.$nextTick(() => {
      window.addEventListener('resize', () => {
        this.windowWidth = window.innerWidth
      })
    })
  }
}
</script>

<style lang="scss">
$font-family-base: "HelveticaNeue-Light", "Helvetica Neue Light",
    "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif;
$font-weight-base: 300;
$font-size: 1.125em;
$line-height: 1.3;

body {
    font-family: $font-family-base;
    font-weight: $font-weight-base;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-size: $font-size;
    line-height: $line-height;
}

.b-calendar {
    display: flex;
    align-items: center;
    margin: 2.5em auto;
    max-width: 70rem;
    &__information {
        background-color: #535c68;
        border-radius: 1.2rem 0 0 1.2rem;
        color: #fff;
        height: 100%;
        padding-left: 0.9rem;
        padding-right: 0.9rem;
        .selected-date {
            padding-top: 3rem;
            padding-left: 2.5rem;
            position: relative;
            &:before {
                content: "";
                position: absolute;
                background-color: #f0932b;
                border-radius: 50%;
                width: 2rem;
                height: 2rem;
                top: 4.5rem;
                left: -0.25rem;
            }
            .weekday {
                font-weight: 100;
                padding-bottom: 0.5em;
            }
            .day {
                font-size: 2em;
                font-weight: 600;
                line-height: 1;
            }
            .month {
                font-size: 2em;
                font-weight: 200;
                line-height: 1;
            }
        }
        .go-today-link {
            display: none;
        }
    }
    &__calendar {
        min-height: 40rem;
        padding-right: 0.9rem;
    }
    &__header {
        margin-bottom: 2rem;
        .month {
            font-size: 1.25em;
            font-weight: 200;
            text-transform: capitalize;
            min-width: 10rem;
        }
        .year {
            font-size: 1.5em;
            font-weight: 600;
            margin-bottom: 1rem;
        }
        .arrow {
            background: transparent;
            border: 1px solid rgba(0, 0, 0, 0.1);
            border-radius: 50%;
            color: #000;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 2.5rem;
            width: 2.5rem;
            &:hover {
                cursor: pointer;
            }
            &-left {
                i {
                    transform: translateX(-10%);
                }
            }
            &-right {
                i {
                    transform: translateX(10%);
                }
            }
        }
    }
    &__weekdays {
        display: flex;
        margin-bottom: 1.25rem;
        .weekday {
            width: calc(100% / 7);
            padding: 0.25rem 0.5rem;
        }
    }
    &__dates {
        display: flex;
        flex-wrap: wrap;
        position: relative;
        &:after {
            content: "";
            position: absolute;
            bottom: 0;
            background-color: #fff;
            height: 1px;
            width: 100%;
            z-index: 1;
        }
        .date {
            border-right: 1px solid rgba(0, 0, 0, 0.05);
            border-bottom: 1px solid rgba(0, 0, 0, 0.05);
            font-weight: 200;
            min-height: 4.5rem;
            padding: 0.25rem 0.5rem;
            position: relative;
            width: calc(100% / 7);
            &.blank {
                background-color: rgba(0, 0, 0, 0.02);
                color: rgba(0, 0, 0, 0.2);
            }
            &.no-border-right {
                border-right: none;
            }
            &.today {
                background-color: #ff7979;
                color: #fff;
            }
            &.selected {
                background-color: #f0932b;
                color: #fff;
            }
            .link {
                cursor: pointer;
                position: absolute;
                top: 0.05rem;
                left: 0.05rem;
                bottom: 0.05rem;
                right: 0.05rem;
                z-index: 1;
            }
            .weekday {
                display: none;
            }
            .additional {
                font-size: 0.75em;
                position: absolute;
                bottom: 0.25rem;
                left: 0.5rem;
                .year {
                    padding-right: 0.25rem;
                    font-size: 0.75em;
                }
            }
            .event-mobile-container {
                display: none;
            }
        }
    }
}

.b-event-container {
    margin-top: 2rem;
    .create-event-form {
        margin-bottom: 1rem;
        .event-title-input {
            margin-right: 0.25rem;
            width: calc(100% - 2.7rem);
        }
    }
    .btn-group {
        width: 100%;
        display: flex;
        justify-content: center;
        margin-bottom: 1rem;
        .btn {
            width: 33.33%;
        }
    }
    .event-list {
        list-style: none;
        padding: 0;
        margin-left: -0.9rem;
        margin-right: -0.9rem;
        max-height: 20rem;
        overflow-y: auto;
        .event {
            background-color: rgba(255, 255, 255, 0.1);
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0.5rem 0.9rem;
            margin-bottom: 0.5rem;
            &.completed {
                background-color: rgba(255, 255, 255, 0.2);
                .title {
                    opacity: 0.5;
                    &:before {
                        content: "";
                        position: absolute;
                        top: 50%;
                        left: -0.5rem;
                        display: block;
                        width: 0%;
                        height: 1px;
                        background: #fff;
                        animation: strikeitem 0.3s ease-out 0s forwards;
                    }
                }
            }
            .title {
                position: relative;
                max-width: calc(100% - 4rem);
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .buttons {
                display: flex;
                .btn {
                    background: transparent;
                    border: none;
                    color: #fff;
                    font-size: 1.2em;
                    padding: 0;
                    height: 1.75rem;
                    width: 1.75rem;
                    box-shadow: none;
                }
            }
        }
    }
    .no-events {
        margin-top: 1.5rem;
    }
}

@keyframes strikeitem {
    to {
        width: calc(100% + 1rem);
    }
}

@media (max-width: 991.98px) {
    .b-calendar {
        &__calendar {
            padding: 0;
        }
        &__information {
            border-radius: 2rem 2rem 0 0;
            padding-top: 2rem;
            padding-bottom: 2rem;
            min-height: auto;
            .today {
                padding-top: 0;
            }
        }
    }
}

@media (max-width: 480px) {
    .b-calendar {
        &__weekdays {
            display: none;
        }
        &__information {
            .selected-date {
                padding-top: 2rem;
                padding-bottom: 1rem;
                padding-left: 2.5rem;
                &:before {
                    top: 3rem;
                }
            }
            .b-event-container {
                display: none;
            }
            .go-today-link {
                display: block;
                color: #fff;
            }
        }
        &__header {
            .go-today-btn {
                display: none;
            }
            .month-change-container {
                width: 100%;
                min-width: 100%;
            }
            .month {
                width: 100%;
            }
        }
        &__dates {
            .date {
                width: 100%;
                text-align: left !important;
                border: none;
                border-bottom: 1px solid rgba(0, 0, 0, 0.05);
                display: flex;
                &.blank {
                    display: none;
                }
                .weekday {
                    display: block;
                    margin-left: 0.25rem;
                }
                .event-mobile-container {
                    background: #535c68;
                    display: block;
                    position: absolute;
                    margin-top: 0;
                    top: 100%;
                    left: 0;
                    right: 0;
                    padding: 2rem 0.5rem;
                    z-index: 10;
                    &.collapse {
                        display: none !important;
                    }
                    &.show {
                        display: block !important;
                    }
                }
            }
        }
    }
}

form.create-event-form.form-inline {
    display: flex;
    flex-flow: row wrap;
    align-items: center;
}
</style>
