import { useEffect, useMemo, useState } from 'react';
import { FactType } from 'types/Fact.type';
import factsService from 'services/facts.service';
import styles from 'App.module.css';

export default function MainPage() {
  const [randomFact, setRandomFact] = useState<FactType>({} as FactType);
  const [todayFact, setTodayFact] = useState<FactType>({} as FactType);
  const fact = useMemo(() => (randomFact.text ? randomFact : todayFact), [todayFact, randomFact]);

  const loadRandomFact = async () => {
    const fact = await factsService.getRandomFact();
    setRandomFact(fact);
  };

  const loadTodayFact = async () => {
    const fact = await factsService.getTodayFact();
    setTodayFact(fact);
  };

  useEffect(() => {
    loadTodayFact();
  }, []);

  return (
    <div className={styles.FactBlockWrapper}>
      <div className={styles.FactBlock}>
        <div className={styles.Head}>
          <h1>The fact</h1>
          <button className={styles.NewFactButton} type="button" onClick={loadRandomFact}>
            New fact
          </button>
        </div>
        {fact.text && (
          <>
            <div className={styles.Body}>
              <div className={styles.Caption}>Fact:</div>
              <div className={styles.Text}>{fact.text}</div>
              <div className={styles.Caption}>Type:</div>
              <div className={styles.Text}>{fact.type}</div>
              <div className={styles.Caption}>Source:</div>
              <div className={styles.Text}>
                <a href={`https://${fact.source}`} target="_blank" rel="noreferrer">
                  {fact.source}
                </a>
              </div>
            </div>
            <div className={styles.Version}>v.1.0.1</div>
          </>
        )}
      </div>
    </div>
  );
}
