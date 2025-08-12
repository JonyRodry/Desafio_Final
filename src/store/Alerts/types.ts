export const ADD_ALERT = "ADD_ALERT";
export const DELETE_ALERT = "DELETE_ALERT";

export type AlertTypeActions = AddAlertType | DeleteAlertType;

export interface AlertState {
    alerts_list: Alert[];
}

export interface Alert {
    id: number;
    type: 'success' | 'error';
    message: string;
}

interface AddAlertType {
    type: typeof ADD_ALERT,
    payload: Alert,
};

interface DeleteAlertType {
    type: typeof DELETE_ALERT,
    payload: number,
};


