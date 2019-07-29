"use strict";

const qs = (element, selector) => element.querySelector(selector);

// eslint-disable-next-line max-lines-per-function
document.addEventListener("DOMContentLoaded", () => {
  const MAIN = document.querySelector("#main");

  const BOOK_SCHEDULE_FORM = qs(MAIN, "#book-schedule");
  const SCHEDULE_ID = qs(BOOK_SCHEDULE_FORM, "#schedule-id");
  const STUDENT_EMAIL = qs(BOOK_SCHEDULE_FORM, "#student-email");

  const CREATE_STUDENT_FORM = qs(MAIN, "#create-student");
  const NEW_STUDENT_EMAIL = qs(CREATE_STUDENT_FORM, "#new-student-email");
  const NEW_STUDENT_NAME = qs(CREATE_STUDENT_FORM, "#new-student-name");
  const BOOKING_SEQUENCE = qs(CREATE_STUDENT_FORM, "#booking-sequence");

  const API_BOOKINGS = "/api/bookings";
  const API_SCHEDULES = "/api/schedules";
  const API_STAFF_MEMBERS = "/api/staff_members";
  const API_STUDENTS = "/api/students";

  const ERROR_MESSAGE = "An error occured!";
  const STUDENT_DOES_NOT_EXIST =
    /^Student does not exist; booking_sequence: (\d+)\s*$/;
  const TIMEOUT_MESSAGE = "Timeout! Please try again.";
  const TIMEOUT_PERIOD = 3000;
  const URL = "http://greywolf:3000";

  const app = {
    sameListener(theListener, element, eventName, listener) {
      return theListener.element === element &&
             theListener.eventName === eventName &&
             theListener.listener === listener;
    },

    addEventListener(element, eventName, listener) {
      this.removeEventListener(element, eventName, listener);
      element.addEventListener(eventName, listener);
      this.listeners.push({ element, eventName, listener });
    },

    removeEventListener(element, eventName, listener) {
      let indexOfOldListener = this.listeners.findIndex((prevListener) => {
        return this.sameListener(prevListener, element, eventName, listener);
      });

      if (indexOfOldListener >= 0) {
        let oldListener = this.listeners[indexOfOldListener].listener;
        element.removeEventListener(eventName, oldListener);
        this.listeners.splice(indexOfOldListener, 1);
      }
    },

    removeAllEventListeners() {
      this.listeners.forEach(({ element, eventName, listener }) => {
        element.removeEventListener(eventName, listener);
      });

      this.listeners = [];
    },

    timeout() {
      alert(TIMEOUT_MESSAGE);
    },

    gotError() {
      alert(ERROR_MESSAGE);
    },

    createElement(tagName, ...options) {
      let element = document.createElement(tagName);
      return Object.assign(element, ...options);
    },

    renderSchedules() {
      Object.values(this.schedules)
            .forEach(({ id, staffName: name, date, time }) => {
              let option = this.createElement("option", { value: id });
              let optionText = [ name, date, time ].join(" | ");
              option.appendChild(document.createTextNode(optionText));
              SCHEDULE_ID.appendChild(option);
            });
    },

    hideNewStudentForm() {
      CREATE_STUDENT_FORM.classList.add("hidden");
    },

    renderNewStudentForm() {
      NEW_STUDENT_EMAIL.value = this.studentEmail;
      NEW_STUDENT_NAME.value = "";
      BOOKING_SEQUENCE.value = this.bookingSequence;
      CREATE_STUDENT_FORM.classList.remove("hidden");
    },

    xhrGet(resource, loadHandler) {
      let xhr = new XMLHttpRequest();
      xhr.addEventListener("load", loadHandler.bind(this, xhr));
      xhr.addEventListener("error", this.gotError);
      xhr.addEventListener("timeout", this.timeout);

      xhr.open("GET", `${URL}${resource}`);
      xhr.timeout = TIMEOUT_PERIOD;
      xhr.responseType = "json";
      xhr.send();
    },

    xhrPost(resource, jsonData, loadHandler) {
      let xhr = new XMLHttpRequest();
      xhr.addEventListener("load", loadHandler.bind(this, xhr));
      xhr.addEventListener("error", this.gotError);
      xhr.addEventListener("timeout", this.timeout);

      xhr.open("POST", `${URL}${resource}`);
      xhr.timeout = TIMEOUT_PERIOD;
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.send(jsonData);
    },

    handleLoadSchedules(xhr) {
      let availableSchedules = xhr.response.filter((schedule) => {
        return !schedule.student_email;
      });

      this.schedules = {};
      availableSchedules.forEach((schedule) => {
        schedule.staffName = this.staffMembers[schedule.staff_id];
        this.schedules[schedule.id] = schedule;
      });

      this.renderSchedules();
    },

    handleLoadStaff(xhr) {
      this.staffMembers = {};
      xhr.response.forEach((staffMember) => {
        this.staffMembers[staffMember.id] = staffMember.name;
      });

      this.xhrGet(API_SCHEDULES, this.handleLoadSchedules);
    },

    formDataAsObject(form) {
      let formData = new FormData(form);
      let inputs = Array.from(formData.entries());

      return inputs.reduce(
        (data, [ key, value ]) => {
          data[key] = value;
          return data;
        },
        {}
      );
    },

    bookingDataAsJson() {
      let data = this.formDataAsObject(BOOK_SCHEDULE_FORM);
      this.scheduleId = this.schedules[SCHEDULE_ID.value].id;
      this.studentEmail = data["student-email"];

      let booking = {
        id:            this.scheduleId,
        student_email: this.studentEmail, // eslint-disable-line camelcase
      };

      return JSON.stringify(booking);
    },

    studentDataAsJson() {
      let data = this.formDataAsObject(CREATE_STUDENT_FORM);
      let newStudent = {
        email:            data["new-student-email"],
        name:             data["new-student-name"],
        booking_sequence: this.bookingSequence, // eslint-disable-line camelcase
      };

      return JSON.stringify(newStudent);
    },

    handleCreateStudent(event) {
      event.preventDefault();
      this.xhrPost(API_STUDENTS, this.studentDataAsJson(), (xhr) => {
        alert(xhr.responseText);
        if (xhr.status === 201) {
          CREATE_STUDENT_FORM.removeEventListener("submit",
                                                  this.handleCreateStudent);
          BOOK_SCHEDULE_FORM.dispatchEvent(new Event("submit"));
        } else {
          this.renderNewStudentForm();
        }
      });
    },

    handleBookSchedule(event) {
      event.preventDefault();
      this.xhrPost(API_BOOKINGS, this.bookingDataAsJson(), (xhr) => {
        if (xhr.status === 204) {
          alert("Booked");
          this.reset();
        } else {
          alert(xhr.responseText);

          let matchData = xhr.responseText.match(STUDENT_DOES_NOT_EXIST);
          if (matchData) {
            this.bookingSequence = matchData[1];
            this.renderNewStudentForm();
            this.addEventListener(CREATE_STUDENT_FORM,
                                  "submit",
                                  this.handleCreateStudent);
          }
        }
      });
    },

    init() {
      this.bookingSequence = 0;
      this.listeners = [];
      this.schedules = [];
      this.staffMembers = {};
      this.studentEmail = "";
      this.studentName = "";

      this.gotError            = this.gotError.bind(this);
      this.timeout             = this.timeout.bind(this);
      this.handleLoadStaff     = this.handleLoadStaff.bind(this);
      this.handleLoadSchedules = this.handleLoadSchedules.bind(this);
      this.handleBookSchedule  = this.handleBookSchedule.bind(this);
      this.handleCreateStudent = this.handleCreateStudent.bind(this);

      this.clearBookingForm();
      this.xhrGet(API_STAFF_MEMBERS, this.handleLoadStaff);

      this.addEventListener(BOOK_SCHEDULE_FORM,
                            "submit",
                            this.handleBookSchedule);
    },

    clearBookingForm() {
      this.clearNodes(...SCHEDULE_ID.children);
      STUDENT_EMAIL.value = "";
    },

    clearNewStudentForm() {
      NEW_STUDENT_EMAIL.value = "";
      NEW_STUDENT_NAME.value = "";
      BOOKING_SEQUENCE.value = "";
    },

    reset() {
      this.removeAllEventListeners();
      this.clearBookingForm();
      this.clearNewStudentForm();
      this.hideNewStudentForm();
      this.init();
    },

    clearNodes(...nodes) {
      Array.from(nodes).forEach((node) => {
        while (node.hasChildNodes()) {
          this.clearNodes(node.firstChild);
        }
      });

      while (nodes.length > 0) {
        let node = nodes.pop();
        node.parentNode.removeChild(node);
      }
    },
};

  app.init();
});
