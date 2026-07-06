export interface DashboardAnalyticsResponse {
    totalCourier: MetricDTO;
    totalParcel: MetricDTO;
    totalDoorDelivery: MetricDTO;
    totalOrders: MetricDTO;
}

export interface MetricDTO {
    name: String;
    total: number;
    percentageChange: number;
    up: boolean;
}

export interface WeeklyOrdersData {
    previousWeek: number[];
    currentWeek: number[];
}


export interface Out_of_stock_Data {
    count: String[];
    category: number[];
    colors: string[];
    hoverColors: string[];
}


export interface SalesData {
    amount: number,
    backGroundColor: string,
    chargeType: string
}

export interface SalesDataResponse {
    analytics: SalesData[];
    totalCharges: number;
    totalOrders: number;
    totalAmount?: number;
}

export interface AnalyticsFilterModel {
    startDate?: any;
    endDate?: any;
    category?: string
    subcategory?: string[]
    availableNoOfProducts?: number
    availability?: AvailabilityEnum
}
export enum AvailabilityEnum {
    IN_STOCK, OUT_OF_STOCK, ALL, CURRENTLY_UNAVAILABLE
}

