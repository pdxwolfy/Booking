"use strict";

// eslint-disable-next-line max-lines-per-function
document.addEventListener("DOMContentLoaded", () => {
  const URL = "http://greywolf:3000";
  const ADD_STAFF_MEMBER = "/api/staff_members";
  const ERROR_MESSAGE = "An error occured!";
  const VALID_EMAIL_PATTERN = /^.+@.+$/;
  const REQUIRED_ENTRIES = {
    email: "Your email address is required.",
    name:  "Your name is required.",
  };

  const FORM = document.querySelector("form");
  const FIELDS = {
    email: FORM.querySelector("#email"),
    name:  FORM.querySelector("#name"),
  };

  const reset = function() {
    FIELDS.email.value = "";
    FIELDS.name.value  = "";
  };

  const missingData = function() {
    const entries = Object.entries(REQUIRED_ENTRIES);
    for (let index = 0; index < entries.length; index++) {
      let [ name, errorMessage ] = entries[index];
      if (FIELDS[name].value.length === 0) {
        return errorMessage;
      }
    }

    return null;
  };

  const validateEmail = function() {
    if (VALID_EMAIL_PATTERN.test(FIELDS.email.value)) {
      return null;
    }

    return "Invalid email address.";
  };

  const getFormDataAsJson = function() {
    let formData = new FormData(FORM);
    let entries  = Array.from(formData.entries());
    let data     = {};

    entries.forEach(([ key, value ]) => (data[key] = value));
    return JSON.stringify(data);
  };

  const addStaffMember = function() {
    let xhr = new XMLHttpRequest();

    xhr.addEventListener("load", (_event) => {
      if (xhr.status !== 201) {
        alert(xhr.responseText);
        return;
      }

      let email = FIELDS.email.value;
      let name  = FIELDS.name.value;
      alert(`Got it: Email: ${email} Name: ${name} Id: ${xhr.response.id}`);
      reset();
    });

    xhr.open("POST", `${URL}${ADD_STAFF_MEMBER}`);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.addEventListener("error", () => alert(ERROR_MESSAGE));
    xhr.responseType = "json";
    xhr.send(getFormDataAsJson());
  };

  FORM.addEventListener("submit", (event) => {
    event.preventDefault();

    let error = missingData() || validateEmail();
    if (error) {
      alert(error);
    } else {
      addStaffMember();
    }
  });
});
