import { memoizeWith, always } from 'ramda';
import {
  PostgresConfig,
  LoggerConfig,
  loadConfig as loadDataServiceConfig,
} from '../../loadConfig';

export type PairsConfig = PostgresConfig &
  LoggerConfig & {
    pairsUpdateInterval: number;
    pairsUpdateTimeout: number;
  };

const load = (): PairsConfig => ({
  ...loadDataServiceConfig(),
  pairsUpdateInterval: process.env.PAIRS_UPDATE_INTERVAL
    ? parseInt(process.env.PAIRS_UPDATE_INTERVAL)
    : 2500,
  pairsUpdateTimeout: process.env.PAIRS_UPDATE_TIMEOUT
    ? parseInt(process.env.PAIRS_UPDATE_TIMEOUT)
    : 20000,
});

export const loadConfig = memoizeWith(always('config'), load);
