import httpClient from 'api/httpClient';
import { FactDTOType } from 'types/dto/FactDTO.type';

export async function getRandomFact(): Promise<FactDTOType> {
  return httpClient.get<FactDTOType>(`/random`);
}

export async function getTodayFact(): Promise<FactDTOType> {
  return httpClient.get<FactDTOType>(`/today`);
}

const simpleAppApi = {
  getRandomFact,
  getTodayFact,
};

export default simpleAppApi;
