import { ADD_ALERT, DELETE_ALERT, type Alert } from "./types";

export const addAlertAction = (id: number, type: Alert['type'], message: string) => {
  const newAlert: Alert = {
    id,
    type,
    message
  };
  return {
    type: ADD_ALERT,
    payload: newAlert,
  };
};

export const deleteAlertAction = (id: number) => ({
  type: DELETE_ALERT,
  payload: id,
});
