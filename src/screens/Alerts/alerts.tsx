import { useSelector } from 'react-redux';
import { type StoreState } from '../../store';
import styles from './alerts.module.css'

const Alert = () => {
    const alerts = useSelector((state: StoreState) => state.alerts.alerts_list);
    return (
        <div className={styles.container}>
            {alerts.map(alert => (
                <div key={alert.id} className={styles.divAlert} style={{
                    backgroundColor: alert.type === 'success'
                        ? 'rgba(0, 128, 0, 0.7)' // verde com opacidade
                        : 'rgba(255, 0, 0, 0.7)' // vermelho com opacidade
                }}>
                    {alert.message}
                </div>
            ))}
        </div>
    );
};

export default Alert;