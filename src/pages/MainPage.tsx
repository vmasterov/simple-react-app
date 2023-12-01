import { useEffect, useMemo, useState } from 'react';
import { FactType } from 'types/Fact.type';
import factsService from 'services/facts.service';

export default function MainPage() {
  const [randomFact, setRandomFact] = useState<FactType>({} as FactType);
  const [todayFact, setTodayFact] = useState<FactType>({} as FactType);

  const fact = useMemo(() => (randomFact.text ? randomFact.text : todayFact.text), [todayFact, randomFact]);

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
    <>
      <h1>The fact</h1>
      <button type="button" onClick={loadRandomFact}>
        Get new one
      </button>
      {fact && <div>{fact}</div>}
    </>
  );
}
