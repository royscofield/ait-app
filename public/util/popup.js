import { popUpMessage, popUpStatus, popUpVisible } from "public/redux/actions";

const successIcon = require("../img/successIcon.png");
const failIcon = require("../img/failIcon.png");
const hidden = "h-screen hidden w-full fixed justify-center items-center";
const show =
  "h-screen flex w-full fixed justify-center items-center bg-slate-600 bg-opacity-50";
const ShowMethod = (dispatch, message, status) => {
  dispatch(popUpMessage(message));
  dispatch(popUpStatus(status));
  dispatch(popUpVisible(show));
}
const HideMethod = (dispatch) => {
  dispatch(popUpVisible(hidden));
}
export { successIcon, failIcon, hidden, show, ShowMethod, HideMethod };
