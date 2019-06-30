const UI = "#main";
const URL = "http://greywolf:3000";
const GET_SCHEDULES = "/api/schedules";
const GET_STAFF = "/api/staff_members";
const TIMEOUT_PERIOD = 3000;
const TIMEOUT_MESSAGE = "Timeout! Please try again.";
const ALL_DONE = "All done.";
const NO_SCHEDULES = "No schedules available for booking!";
const ERROR_MESSAGE = "An error occured!";

// eslint-disable-next-line max-lines-per-function
document.addEventListener("DOMContentLoaded", () => {
  let ui = document.querySelector(UI);

  const gotError = () => alert(ERROR_MESSAGE);

  const addTextToUi = (text) => {
    let uiItem = document.createElement("p");
    uiItem.appendChild(document.createTextNode(text));
    ui.appendChild(uiItem);
  };

  const clearUi = () => {
    while (ui.lastChild) {
      ui.removeChild(ui.lastChild);
    }
  };

  const tallyResults = (schedules, staffMembers) => {
    staffMembers.forEach((staff) => {
      let staffSchedules = schedules.filter((schedule) => {
        return schedule.staff_id === staff.id;
      });

      addTextToUi(`staff ${staff.id}: ${staffSchedules.length}`);
    });
  };

  const done = () => addTextToUi(ALL_DONE);

  const timeout = () => {
    addTextToUi(TIMEOUT_MESSAGE);
    done();
  };

  const requestStaffSchedules = (schedules) => {
    if (schedules.length === 0) {
      addTextToUi(NO_SCHEDULES);
      return;
    }

    let xhr = new XMLHttpRequest();
    xhr.addEventListener("load", () => tallyResults(schedules, xhr.response));
    xhr.addEventListener("error", gotError);
    xhr.addEventListener("loadend", done);

    xhr.open("GET", `${URL}${GET_STAFF}`);
    xhr.responseType = "json";
    xhr.send();
  };

  const requestSchedules = () => {
    let xhr = new XMLHttpRequest();
    xhr.addEventListener("load", () => requestStaffSchedules(xhr.response));
    xhr.addEventListener("error", gotError);
    xhr.addEventListener("timeout", timeout);

    xhr.open("GET", `${URL}${GET_SCHEDULES}`);
    xhr.timeout = TIMEOUT_PERIOD;
    xhr.responseType = "json";
    xhr.send();
  };

  clearUi();
  requestSchedules();
});
