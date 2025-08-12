import { ADD_ALERT, DELETE_ALERT, type AlertState, type AlertTypeActions} from "./types";

export const alertInitialState: AlertState = {
  alerts_list: [],
};

export const alertReducer = (state = alertInitialState, action: AlertTypeActions): AlertState => {
  switch (action.type) {
    case ADD_ALERT:
      return {
        alerts_list: [...state.alerts_list, action.payload],
      };
    case DELETE_ALERT:
      return {
        alerts_list: state.alerts_list.filter((alert) => alert.id !== action.payload),
      };
    default:
      return state;
  }
};
