import { useSelector } from 'react-redux';
import { type StoreState } from '../../store';
import styles from './alerts.module.css';
import { Alert as MuiAlert } from '@mui/material';

const Alerts = () => {
  const alerts = useSelector((state: StoreState) => state.alerts.alerts_list);

  return (
    <div className={styles.container}>
      {alerts.map((alert) => (
        <MuiAlert key={alert.id} severity={alert.type} style={{marginBottom: '15px'}}>
          {alert.message}
        </MuiAlert>
      ))}
    </div>
  );
};

export default Alerts;