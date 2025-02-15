export interface PrayerTimes {
    fajr: string;
    dhuhr: string;
    asr: string;
    maghrib: string;
    isha: string;
  }
  
  export interface Location {
    latitude: number;
    longitude: number;
  }

export type TimeNames = {
    [key: string]: string;
};

export type MethodParams = {
    fajr: number;
    isha: number | string;
    maghrib?: number;
    midnight?: string;
    [key: string]: any;
};

export type Methods = {
    [key: string]: {
        name: string;
        params: MethodParams;
    };
};

export type Setting = {
    imsak: string;
    dhuhr: string;
    asr: string;
    highLats: string;
    [key: string]: string | number;
};

export type Times = {
    [key: string]: number;
};