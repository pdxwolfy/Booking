// eslint-disable-next-line max-lines-per-function
document.addEventListener("DOMContentLoaded", () => {
  const UI = "#main";
  const URL = "http://greywolf:3000";
  const ADD_MORE_SCHEDULES = "Add more schedules";
  const SCHEDULES = "/api/schedules";
  const SUBMIT = "Submit";
  const ERROR_MESSAGE = "An error occured!";

  // let store = {
  //   schedules: [],
  //
  //   addBooking(bookingText) {
  //     this.bookings.push(bookingText);
  //   },
  //
  //   clear() {
  //     this.bookings = [];
  //   },
  //
  //   getSchedules() {
  //     return this.bookings.slice();
  //   },
  // };

  // class Schedule {
  //   /* eslint-disable camelcase */
  //   constructor({ id, staff_id, student_email, date, time }) {
  //     this.id           = id;
  //     this.staffId      = staff_id;
  //     this.studentEmail = student_email;
  //     this.date         = date;
  //     this.time         = time;
  //   }
  //   /* eslint-enable camelcase */
  // }

  let app = {
    schedules: [],
    where:     document.querySelector(UI),

    init() {
      this.renderAddScheduleButton();
      this.renderSubmitButton();
    },

    renderAddScheduleButton() {
      let button = this.createButton(ADD_MORE_SCHEDULES);
      button.addEventListener("click", this.renderScheduleForm.bind(this));
      this.renderButton(button);
    },

    renderSubmitButton() {
      let button = this.createButton(SUBMIT);
      button.addEventListener("click", this.handleSubmit.bind(this));
      button.type = "submit";
      this.renderButton(button);
    },

    createButton(label) {
      let button = document.createElement("button");
      let text = document.createTextNode(label);
      return button.appendChild(text);
    },

    renderButton(button) {
      return this.where.appendChild(button);
    },

    createScheduleForm() {
      let form = this.createElement("form");
      let id = this.schedules.length + 1;
      form.id = `schedule-${id}`;
      form.action = "#";
      form.method = "post";
      return form;
    },

    createElement(tagName, ...options) {
      let tag = document.createElement(tagName);
      tag = { ...tag, ...options };
      return tag;
    },

    createFieldSet() {
      return this.createElement("fieldset");
    },

    createLabel(text, forName) {
      let label = this.createElement("label", { for: forName });
      return label.appendChild(document.createTextNode(`${text} :`));
    },

    createOption(id, name) {
      let option = this.createElement("option", { value: id });
      return option.appendChild(document.createTextNode(name));
    },

    createStaffNameInput(name) {
      let select = this.createElement("select", { name: name });
      select.appendChild(this.createOption(1, "First Prof"));
      select.appendChild(this.createOption(2, "Second Prof"));
      return select;
    },

    createDateInput(name) {
      return this.createElement(
        "input",
        {
          name,
          type:      "date",
          required:  true,
          placehold: "mm-dd-yyyy",
        }
      );
    },

    createTimeInput(name) {
      return this.createElement(
        "input",
        {
          name,
          type:      "date",
          required:  true,
          placehold: "hh:mm",
        }
      );
    },

    createFieldInputs() {
      let dl = this.createElement("dl");
      dl.appendChild(this.createLabel("StaffName", "staffName"));
      dl.appendChild(this.createStaffNameInput("staffName"));
      dl.appendChild(this.createLabel("Date", "date"));
      dl.appendChild(this.createDateInput("date"));
      dl.appendChild(this.createLabel("Time", "time"));
      dl.appendChild(this.createTimeInput("time"));
      return dl;
    },

    renderScheduleForm() {
      let form = this.createScheduleForm();
      let fieldset = this.createFieldSet();
      let dl = this.createFieldInputs();
    },

    handleSubmit() {
      alert("Submitting form");
    },

    gotError() {
      alert(ERROR_MESSAGE);
    },
  };

  app.init();
  // const GET_STAFF = "/api/staff_members";
  // const TIMEOUT_PERIOD = 3000;
  // const TIMEOUT_MESSAGE = "Timeout! Please try again.";
  // const ALL_DONE = "All done.";
  // const NO_SCHEDULES = "No schedules available for booking!";
  //
  // let ui = {
  //   location: document.querySelector(UI),
  //
  //   clear() {
  //     let ui = this.location;
  //     while (ui.hasChildNodes()) {
  //       this.clearNode(ui.firstChild);
  //     }
  //   },
  //
  //   clearNode(node) {
  //     while (node.hasChildNodes()) {
  //       this.clear(node.firstChild);
  //     }
  //
  //     node.parentNode.removeChild(node);
  //   },
  //
  //   done() {
  //     this.renderLine(ALL_DONE);
  //   },
  //
  //   render(schedules) {
  //     this.clear();
  //     this.renderSchedules(schedules);
  //   },
  //
  //   renderLine(line) {
  //     let item = document.createElement("p");
  //     item.appendChild(document.createTextNode(line));
  //     this.location.appendChild(item);
  //   },
  //
  //   renderSchedules(schedules) {
  //     schedules.forEach((schedule) => this.renderLine(schedule));
  //   },
  //
  //   timeout() {
  //     this.renderLine(TIMEOUT_MESSAGE);
  //     this.done();
  //   },
  // };
  //
  // let store = {
  //   bookings: [],
  //
  //   addBooking(bookingText) {
  //     this.bookings.push(bookingText);
  //   },
  //
  //   clear() {
  //     this.bookings = [];
  //   },
  //
  //   getBookings() {
  //     return this.bookings.slice();
  //   },
  // };
  //
  // const reset = () => {
  //   store.clear();
  //   ui.clear();
  // };
  //
  // const tallyResults = (schedules, staffMembers) => {
  //   staffMembers.forEach((staff) => {
  //     let staffSchedules = schedules.filter((schedule) => {
  //       return schedule.staff_id === staff.id;
  //     });
  //
  //     store.addBooking(`staff ${staff.id}: ${staffSchedules.length}`);
  //   });
  // };
  //
  // const requestStaffSchedules = (schedules) => {
  //   if (schedules.length === 0) {
  //     store.addBooking(NO_SCHEDULES);
  //     return;
  //   }
  //
  //   let xhr = new XMLHttpRequest();
  //   xhr.addEventListener("load", () => {
  //     tallyResults(schedules, xhr.response);
  //     ui.render(store.getBookings());
  //   });
  //
  //   xhr.addEventListener("error", gotError);
  //   xhr.addEventListener("loadend", ui.done.bind(ui));
  //
  //   xhr.open("GET", `${URL}${GET_STAFF}`);
  //   xhr.responseType = "json";
  //   xhr.send();
  // };
  //
  // const requestSchedules = () => {
  //   reset();
  //
  //   let xhr = new XMLHttpRequest();
  //   xhr.addEventListener("load", () => requestStaffSchedules(xhr.response));
  //   xhr.addEventListener("error", gotError);
  //   xhr.addEventListener("timeout", ui.timeout.bind(ui));
  //
  //   xhr.open("GET", `${URL}${GET_SCHEDULES}`);
  //   xhr.timeout = TIMEOUT_PERIOD;
  //   xhr.responseType = "json";
  //   xhr.send();
  // };
  //
  // requestSchedules();
});
