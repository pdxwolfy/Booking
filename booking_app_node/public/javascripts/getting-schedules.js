// eslint-disable-next-line max-lines-per-function
document.addEventListener("DOMContentLoaded", () => {
  const UI = "#main";
  const URL = "http://greywolf:3000";
  const GET_SCHEDULES = "/api/schedules";
  const GET_STAFF = "/api/staff_members";
  const TIMEOUT_PERIOD = 3000;
  const TIMEOUT_MESSAGE = "Timeout! Please try again.";
  const ALL_DONE = "All done.";
  const NO_SCHEDULES = "No schedules available for booking!";
  const ERROR_MESSAGE = "An error occured!";

  let ui = {
    location: document.querySelector(UI),

    clear() {
      let ui = this.location;
      while (ui.hasChildNodes()) {
        this.clearNode(ui.firstChild);
      }
    },

    clearNode(node) {
      while (node.hasChildNodes()) {
        this.clear(node.firstChild);
      }

      node.parentNode.removeChild(node);
    },

    done() {
      this.renderLine(ALL_DONE);
    },

    render(schedules) {
      this.clear();
      this.renderSchedules(schedules);
    },

    renderLine(line) {
      let item = document.createElement("p");
      item.appendChild(document.createTextNode(line));
      this.location.appendChild(item);
    },

    renderSchedules(schedules) {
      schedules.forEach((schedule) => this.renderLine(schedule));
    },

    timeout() {
      this.renderLine(TIMEOUT_MESSAGE);
      this.done();
    },
  };

  let store = {
    bookings: [],

    addBooking(bookingText) {
      this.bookings.push(bookingText);
    },

    clear() {
      this.bookings = [];
    },

    getBookings() {
      return this.bookings.slice();
    },
  };

  const gotError = () => alert(ERROR_MESSAGE);

  const reset = () => {
    store.clear();
    ui.clear();
  };

  const tallyResults = (schedules, staffMembers) => {
    staffMembers.forEach((staff) => {
      let staffSchedules = schedules.filter((schedule) => {
        return schedule.staff_id === staff.id;
      });

      store.addBooking(`staff ${staff.id}: ${staffSchedules.length}`);
    });
  };

  const requestStaffSchedules = (schedules) => {
    if (schedules.length === 0) {
      store.addBooking(NO_SCHEDULES);
      return;
    }

    let xhr = new XMLHttpRequest();
    xhr.addEventListener("load", () => {
      tallyResults(schedules, xhr.response);
      ui.render(store.getBookings());
    });

    xhr.addEventListener("error", gotError);
    xhr.addEventListener("loadend", ui.done.bind(ui));

    xhr.open("GET", `${URL}${GET_STAFF}`);
    xhr.responseType = "json";
    xhr.send();
  };

  const requestSchedules = () => {
    reset();

    let xhr = new XMLHttpRequest();
    xhr.addEventListener("load", () => requestStaffSchedules(xhr.response));
    xhr.addEventListener("error", gotError);
    xhr.addEventListener("timeout", ui.timeout.bind(ui));

    xhr.open("GET", `${URL}${GET_SCHEDULES}`);
    xhr.timeout = TIMEOUT_PERIOD;
    xhr.responseType = "json";
    xhr.send();
  };

  requestSchedules();
});
