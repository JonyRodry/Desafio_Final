import { useDispatch } from 'react-redux';
import { addAlertAction, deleteAlertAction } from '../store/Alerts/action';
import { type Alert } from '../store/Alerts/types';

export const useAlert = () => {
    
  const dispatch = useDispatch();

  const showAlert = (type: Alert['type'], message: string) => {
    const id = Date.now();
    dispatch(addAlertAction(id, type, message));
    setTimeout(() => dispatch(deleteAlertAction(id)), 3000);
  };

  return showAlert;
};
