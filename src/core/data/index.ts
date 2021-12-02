/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { TransportBus, TransportRoute } from '@core/api';
import busesData from './buses.json';
import routesData from './routes.json';

export const defBusesData: TransportBus[] = busesData as TransportBus[];
export const defRoutesData: TransportRoute[] = routesData as TransportRoute[];
export const defSelectedRouteIds = [189, 188, 192, 187, 190, 191];
