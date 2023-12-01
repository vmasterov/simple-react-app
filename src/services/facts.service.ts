import apiList from 'api/apiList';
import { FactType } from 'types/Fact.type';
import { FactEnum } from 'enums/fact.enum';

async function getRandomFact() {
  try {
    const fact = await apiList.getRandomFact();
    return fact ? { ...fact, type: FactEnum.RANDOM } : ({} as FactType);
  } catch (error) {
    console.error(error);
  }

  return {} as FactType;
}

async function getTodayFact() {
  try {
    const fact = await apiList.getTodayFact();
    return fact ? { ...fact, type: FactEnum.TODAY } : ({} as FactType);
  } catch (error) {
    console.error(error);
  }

  return {} as FactType;
}

const factsService = {
  getRandomFact,
  getTodayFact,
};

export default factsService;
