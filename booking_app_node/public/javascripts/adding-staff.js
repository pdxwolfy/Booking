document.addEventListener("DOMContentLoaded", () => {
  const URL = "http://greywolf:3000";
  const ADD_STAFF_MEMBER = "/api/staff_members";
  const ERROR_MESSAGE = "An error occured!";

  const FORM = document.querySelector("form");
  const FIELDS = {
    email: FORM.querySelector("#email"),
    name:  FORM.querySelector("#name"),
  };

  const reset = function() {
    FIELDS.email.value = "";
    FIELDS.name.value  = "";
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

      let data  = JSON.parse(xhr.response);
      let email = FIELDS.email.value;
      let name  = FIELDS.name.value;
      alert(`Created: Email: ${email} Name: ${name} Id: ${data.id}`);
      reset();
    });

    xhr.open("POST", `${URL}${ADD_STAFF_MEMBER}`);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.addEventListener("error", () => alert(ERROR_MESSAGE));
    xhr.send(getFormDataAsJson());
  };

  FORM.addEventListener("submit", (event) => {
    event.preventDefault();
    addStaffMember();
  });
});
