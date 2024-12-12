export interface IUser {
    id?: string
    email?: string
    mobile?: string
    first_name?: string,
    last_name?: string
}

export enum ViewType {
CHART_VIEW = 1,
TABLE_VIEW = 2
}

export const BASE_URL = 'https://iot2024.cognix.tech/api/v1/sensorapp/'