import { FactEnum } from 'enums/fact.enum';

export type FactType = {
  id: string;
  language: string;
  permalink: string;
  source: string;
  source_url: string;
  text: string;
  type: FactEnum;
};
