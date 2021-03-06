// eslint-disable-next-line max-lines-per-function
document.addEventListener("DOMContentLoaded", () => {
  const ADD_MORE_SCHEDULES = "Add more schedules";
  const ERROR_MESSAGE = "An error occured!";
  const FORM = "form";
  const ID_ADD_SCHEDULE = "add-schedule";
  const SCHEDULES = "/api/schedules";
  const STAFF_MEMBERS = "/api/staff_members";
  const SUBMIT = "Submit";
  const TIMEOUT_MESSAGE = "Timeout! Please try again.";
  const TIMEOUT_PERIOD = 3000;
  const UI = "#main";
  const URL = "http://greywolf:3000";

  let app = {
    form:         null,
    schedules:    [],
    staffMembers: [],
    submit:       null,
    where:        document.querySelector(UI),

    init() {
      let xhr = new XMLHttpRequest();
      xhr.addEventListener("load", (_event) => {
        this.staffMembers = xhr.response;
        this.renderAddScheduleButton();
        this.renderForm();
        this.renderSubmitButton();
      });

      xhr.addEventListener("error", () => alert(ERROR_MESSAGE));

      xhr.open("GET", `${URL}${STAFF_MEMBERS}`);
      xhr.responseType = "json";
      xhr.send();
    },

    renderAddScheduleButton() {
      let button = this.createButton(
        ADD_MORE_SCHEDULES,
        {
          id: ID_ADD_SCHEDULE,
        },
      );

      button.addEventListener("click", this.renderSchedule.bind(this));
      this.where.appendChild(button);
      return this;
    },

    renderForm() {
      this.form = this.createElement(
        FORM,
        {
          action: "#",
          method: "post",
        }
      );

      this.where.appendChild(this.form);
      return this;
    },

    renderSubmitButton() {
      this.submit = this.createButton(SUBMIT);
      this.submit.addEventListener("click", (event) => {
        event.preventDefault();
        this.addSchedules();
      });

      this.submit.type = "submit";
      this.form.appendChild(this.submit);
      return this;
    },

    createButton(label, ...options) {
      let button = this.createElement("button", ...options);
      let text = document.createTextNode(label);
      button.appendChild(text);
      return button;
    },

    createElement(tagName, ...options) {
      let element = document.createElement(tagName);
      return Object.assign(element, ...options);
    },

    //...

    renderSchedule() {
      let schedule = this.createSchedule();
      this.schedules.push(schedule);
      this.submit.insertAdjacentElement("beforebegin", schedule);
      return this;
    },

    createSchedule() {
      let fieldset = this.createFieldSet();
      let id = this.schedules.length + 1;
      let legend = this.createLegend(`Schedule ${id}`);
      let dl = this.createInputs(id);
      fieldset.appendChild(legend);
      fieldset.appendChild(dl);
      return fieldset;
    },

    createFieldSet() {
      return this.createElement("fieldset");
    },

    createLegend(text) {
      let legend = this.createElement("legend");
      legend.appendChild(document.createTextNode(text));
      return legend;
    },

    createInputs(id) {
      let dl = this.createElement("dl");

      let widget = this.createStaffNameWidget(`staffName-${id}`);
      this.appendLabelAndWidget(dl, "Staff Name", widget);

      widget = this.createDateWidget(`date-${id}`);
      this.appendLabelAndWidget(dl, "Date", widget);

      widget = this.createTimeWidget(`time-${id}`);
      this.appendLabelAndWidget(dl, "Time", widget);

      return dl;
    },

    createLabel(label, forName) {
      let labelElement = this.createElement("label", { for: forName });
      labelElement.appendChild(document.createTextNode(`${label} :`));
      return labelElement;
    },

    createDtDd(which, element) {
      let dtdd = document.createElement(which);
      dtdd.appendChild(element);
      return dtdd;
    },

    createDt(element) {
      return this.createDtDd("dt", element);
    },

    createDd(element) {
      return this.createDtDd("dd", element);
    },

    appendLabelAndWidget(parent, label, widget) {
      let dt = this.createElement("dt");
      dt.appendChild(this.createLabel(label, widget.name));

      let dd = this.createElement("dd");
      dd.appendChild(widget);

      parent.appendChild(dt);
      parent.appendChild(dd);
      return this;
    },

    createStaffNameWidget(name) {
      let select = this.createElement("select", { name: name });
      this.staffMembers.forEach(({ id, name }) => {
        select.appendChild(this.createOption(id, name));
      });
      return select;
    },

    createOption(id, name) {
      let option = this.createElement("option", { value: id });
      option.appendChild(document.createTextNode(name));
      return option;
    },

    createDateWidget(name) {
      return this.createElement(
        "input",
        {
          name,
          type:        "text",
          placeholder: "mm-dd-yy",
        }
      );
    },

    createTimeWidget(name) {
      return this.createElement(
        "input",
        {
          name,
          type:        "text",
          placeholder: "hh:mm",
        }
      );
    },

    //...

    scheduleIds(data) {
      return Object.keys(data)
                   .filter((key) => /^staffName-/.test(key))
                   .map((key) => key.replace(/^staffName-/, ""));
    },

    formattedScheduleData(data, scheduleId) {
      let pattern = new RegExp(`-${scheduleId}$`);
      let keys = Object.keys(data).filter((key) => pattern.test(key));

      const dataFor = (fieldNamePattern) => {
        let fieldName = keys.find((key) => fieldNamePattern.test(key));
        return data[fieldName];
      };

      return {
        // eslint-disable-next-line camelcase
        staff_id: dataFor(/^staffName-/),
        date:     dataFor(/^date-/),
        time:     dataFor(/^time-/),
      };
    },

    formDataAsJson() {
      let formData = new FormData(this.form);

      let schedules = Array.from(formData.entries());
      let data = schedules.reduce(
        (object, [ key, value ]) => {
          object[key] = value;
          return object;
        },
        {}
      );

      console.log(data);
      let json = {
        schedules: this.scheduleIds(data).reduce(
          (accum, scheduleId) => {
            accum.push(this.formattedScheduleData(data, scheduleId));
            return accum;
          },
          []
        ),
      };

      return JSON.stringify(json);
    },

    addSchedules() {
      let xhr = new XMLHttpRequest();

      xhr.addEventListener("load", (_event) => {
        if (xhr.status === 201) {
          this.clearAllSchedules();
          alert("Schedule(s) added");
        } else {
          alert("Please check your inputs.");
        }
      });

      xhr.addEventListener("error", () => alert(ERROR_MESSAGE));
      xhr.addEventListener("timeout", () => {
        this.renderLine(TIMEOUT_MESSAGE);
        this.done();
      });

      xhr.open("POST", `${URL}${SCHEDULES}`);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.addEventListener("error", () => alert(ERROR_MESSAGE));
      xhr.timeout = TIMEOUT_PERIOD;
      xhr.responseType = "json";
      xhr.send(this.formDataAsJson());
    },

    clearAllSchedules() {
      this.schedules = [];
      if (this.form) {
        this.form
            .querySelectorAll("fieldset")
            .forEach((schedule) => this.form.removeChild(schedule));
      }

      return this;
    },
  };

  app.init();
});
