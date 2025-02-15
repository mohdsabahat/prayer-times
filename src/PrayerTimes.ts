//--------------------- Copyright Block ----------------------
/*

PrayTimes.js: Prayer Times Calculator (ver 2.3)
Copyright (C) 2007-2011 PrayTimes.org

Developer: Hamid Zarrabi-Zadeh
License: GNU LGPL v3.0

TERMS OF USE:
	Permission is granted to use this code, with or
	without modification, in any website or application
	provided that credit is given to the original work
	with a link back to PrayTimes.org.

This program is distributed in the hope that it will
be useful, but WITHOUT ANY WARRANTY.

PLEASE DO NOT REMOVE THIS COPYRIGHT BLOCK.

*/

import DMath from "./utils/DMath";
import { MethodParams, Methods, Setting, TimeNames, Times } from "./types";

/**
 * Class representing prayer times calculation.
 */
export default class PrayerTimes {
    private readonly timeNames: TimeNames;
    private readonly methods: Methods;
    private readonly defaultParams: { [key: string]: string };
    private calcMethod: string;
    private setting: Setting;
    private timeFormat: string;
    private readonly timeSuffixes: string[];
    private readonly invalidTime: string;
    private readonly numIterations: number;
    private offset: { [key: string]: number };
    private lat: number;
    private lng: number;
    private elv: number;
    private timeZone: number;
    private jDate: number;

    /**
     * Constructs a new instance of the PrayerTimes class.
     * 
     * @param method - The calculation method to use for prayer times. 
     *                 If the provided method is not found, the default method 'MWL' will be used.
     * 
     * Initializes the following properties:
     * - `timeNames`: An object containing the names of the prayer times.
     * - `methods`: An object containing different calculation methods and their parameters.
     * - `defaultParams`: Default parameters for maghrib and midnight.
     * - `calcMethod`: The calculation method to use, default is 'MWL'.
     * - `setting`: An object containing settings for imsak, dhuhr, asr, and high latitude adjustments.
     * - `timeFormat`: The format of the time, default is '24h'.
     * - `timeSuffixes`: An array containing time suffixes 'am' and 'pm'.
     * - `invalidTime`: A string representing an invalid time, default is '-----'.
     * - `numIterations`: The number of iterations for calculation, default is 1.
     * - `offset`: An object containing offsets for each prayer time, initialized to 0.
     * - `lat`, `lng`, `elv`, `timeZone`, `jDate`: Geographical and time-related properties, initialized to 0.
     * 
     * Sets the default parameters for each method if not already defined.
     * Initializes the settings based on the selected calculation method.
     * Initializes the time offsets for each prayer time to 0.
     */
    constructor(method: string) {
        this.timeNames = {
            imsak: 'Imsak',
            fajr: 'Fajr',
            sunrise: 'Sunrise',
            dhuhr: 'Dhuhr',
            asr: 'Asr',
            sunset: 'Sunset',
            maghrib: 'Maghrib',
            isha: 'Isha',
            midnight: 'Midnight'
        };

        this.methods = {
            MWL: {
                name: 'Muslim World League',
                params: { fajr: 18, isha: 17 }
            },
            ISNA: {
                name: 'Islamic Society of North America (ISNA)',
                params: { fajr: 15, isha: 15 }
            },
            Egypt: {
                name: 'Egyptian General Authority of Survey',
                params: { fajr: 19.5, isha: 17.5 }
            },
            Makkah: {
                name: 'Umm Al-Qura University, Makkah',
                params: { fajr: 18.5, isha: '90 min' }
            },
            Karachi: {
                name: 'University of Islamic Sciences, Karachi',
                params: { fajr: 18, isha: 18 }
            },
            Tehran: {
                name: 'Institute of Geophysics, University of Tehran',
                params: { fajr: 17.7, isha: 14, maghrib: 4.5, midnight: 'Jafari' }
            },
            Jafari: {
                name: 'Shia Ithna-Ashari, Leva Institute, Qum',
                params: { fajr: 16, isha: 14, maghrib: 4, midnight: 'Jafari' }
            }
        };

        this.defaultParams = {
            maghrib: '0 min',
            midnight: 'Standard'
        };

        this.calcMethod = 'MWL';
        this.setting = {
            imsak: '10 min',
            dhuhr: '0 min',
            asr: 'Standard',
            highLats: 'NightMiddle'
        };

        this.timeFormat = '24h';
        this.timeSuffixes = ['am', 'pm'];
        this.invalidTime = '-----';
        this.numIterations = 1;
        this.offset = {};

        this.lat = 0;
        this.lng = 0;
        this.elv = 0;
        this.timeZone = 0;
        this.jDate = 0;

        // set methods defaults
        const defParams = this.defaultParams;
        for (const i in this.methods) {
            const params: any = this.methods[i].params;
            for (const j in defParams) {
                if (typeof params[j] === 'undefined') {
                    params[j] = defParams[j];
                }
            }
        }

        // initialize settings
        this.calcMethod = this.methods[method] ? method : this.calcMethod;
        const params = this.methods[this.calcMethod].params;
        for (const id in params) {
            this.setting[id] = params[id];
        }

        // init time offsets
        for (const i in this.timeNames) {
            this.offset[i] = 0;
        }
    }

    // set calculation method
    /**
     * Sets the calculation method for prayer times.
     * 
     * @param method - The name of the calculation method to set. 
     *                 This should be a key in the `methods` object.
     * 
     * @remarks
     * If the provided method exists in the `methods` object, 
     * this function will adjust the prayer times parameters 
     * according to the specified method and update the 
     * `calcMethod` property.
     */
    setMethod(method: string): void {
        if (!this.methods[method]) {
            throw new Error(`Invalid method: ${method}. Please provide a valid calculation method.`);
        }
        this.adjust(this.methods[method].params);
        this.calcMethod = method;
    }

    // set calculating parameters
    /**
     * Adjusts the prayer time settings based on the provided parameters.
     *
     * @param params - An object containing the method parameters to adjust the settings.
     */
    adjust(params: MethodParams): void {
        for (const id in params) {
            this.setting[id] = params[id];
        }
    }

    // set time offsets
    tune(timeOffsets: { [key: string]: number }): void {
        for (const i in timeOffsets) {
            this.offset[i] = timeOffsets[i];
        }
    }

    // get current calculation method
    getMethod(): string {
        return this.calcMethod;
    }

    // get current setting
    getSetting(): Setting {
        return this.setting;
    }

    // get current time offsets
    getOffsets(): { [key: string]: number } {
        return this.offset;
    }

    // get default calc parameters
    getDefaults(): Methods {
        return this.methods;
    }

    // return prayer times for a given date
    /**
     * Calculates prayer times for a given date, coordinates, and optional timezone and daylight saving time (DST) settings.
     *
     * @param date - The date for which to calculate prayer times. Can be a Date object or an array of numbers [year, month, day].
     * @param coords - The geographical coordinates [latitude, longitude, elevation] for the location.
     * @param timezone - The timezone offset from UTC. Can be a number or 'auto' to automatically determine the timezone. Defaults to 'auto'.
     * @param dst - The daylight saving time setting. Can be a number (0 or 1) or 'auto' to automatically determine DST. Defaults to 'auto'.
     * @param format - The format for the prayer times. Defaults to the instance's timeFormat.
     * @returns An object containing the calculated prayer times.
     */
    getTimes(date: Date | number[], coords: number[], timezone?: number | 'auto', dst?: number | 'auto', format?: string): Times {
        this.lat = coords[0];
        this.lng = coords[1];
        this.elv = coords[2] ? coords[2] : 0;
        this.timeFormat = format ?? this.timeFormat;
        if (date instanceof Date) {
            date = [date.getFullYear(), date.getMonth() + 1, date.getDate()];
        }
        if (typeof timezone === 'undefined' || timezone === 'auto') {
            timezone = this.getTimeZone(date);
        }
        if (typeof dst === 'undefined' || dst === 'auto') {
            dst = this.getDst(date);
        }
        this.timeZone = timezone + (dst ? 1 : 0);
        this.jDate = this.julian(date[0], date[1], date[2]) - this.lng / (15 * 24);

        return this.computeTimes();
    }

    // convert float time to the given format (see timeFormats)
    getFormattedTime(time: number, format: string, suffixes?: string[]): string | number {
        if (isNaN(time)) {
            return this.invalidTime;
        }
        if (format === 'Float') return time;
        suffixes = suffixes || this.timeSuffixes;

        time = DMath.fixHour(time + 0.5 / 60); // add 0.5 minutes to round
        const hours = Math.floor(time);
        const minutes = Math.floor((time - hours) * 60);
        const suffixIndex = hours < 12 ? 0 : 1;
        const suffix = (format === '12h') ? suffixes[suffixIndex] : '';
        const hour = (format === '24h') ? this.twoDigitsFormat(hours) : ((hours + 12 - 1) % 12 + 1);
        return hour + ':' + this.twoDigitsFormat(minutes) + (suffix ? ' ' + suffix : '');
    }

    // compute mid-day time
    midDay(time: number): number {
        const eqt = this.sunPosition(this.jDate + time).equation;
        const noon = DMath.fixHour(12 - eqt);
        return noon;
    }

    // compute the time at which sun reaches a specific angle below horizon
    sunAngleTime(angle: number, time: number, direction?: string): number {
        const decl = this.sunPosition(this.jDate + time).declination;
        const noon = this.midDay(time);
        const t = 1 / 15 * DMath.arccos((-DMath.sin(angle) - DMath.sin(decl) * DMath.sin(this.lat)) /
            (DMath.cos(decl) * DMath.cos(this.lat)));
        return noon + (direction === 'ccw' ? -t : t);
    }

    // compute asr time
    asrTime(factor: number, time: number): number {
        const decl = this.sunPosition(this.jDate + time).declination;
        const angle = -DMath.arccot(factor + DMath.tan(Math.abs(this.lat - decl)));
        return this.sunAngleTime(angle, time);
    }

    // compute declination angle of sun and equation of time
    // Ref: http://aa.usno.navy.mil/faq/docs/SunApprox.php
    sunPosition(jd: number): { declination: number, equation: number } {
        const D = jd - 2451545.0;
        const g = DMath.fixAngle(357.529 + 0.98560028 * D);
        const q = DMath.fixAngle(280.459 + 0.98564736 * D);
        const L = DMath.fixAngle(q + 1.915 * DMath.sin(g) + 0.020 * DMath.sin(2 * g));

        const R = 1.00014 - 0.01671 * DMath.cos(g) - 0.00014 * DMath.cos(2 * g);
        const e = 23.439 - 0.00000036 * D;

        const RA = DMath.arctan2(DMath.cos(e) * DMath.sin(L), DMath.cos(L)) / 15;
        const eqt = q / 15 - DMath.fixHour(RA);
        const decl = DMath.arcsin(DMath.sin(e) * DMath.sin(L));

        return { declination: decl, equation: eqt };
    }

    // convert Gregorian date to Julian day
    // Ref: Astronomical Algorithms by Jean Meeus
    julian(year: number, month: number, day: number): number {
        if (month <= 2) {
            year -= 1;
            month += 12;
        }
        const A = Math.floor(year / 100);
        const B = 2 - A + Math.floor(A / 4);

        const JD = Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5;
        return JD;
    }

    // compute prayer times at given julian date
    computePrayerTimes(times: Times): Times {
        times = this.dayPortion(times);
        const params = this.setting;

        const imsak = this.sunAngleTime(this.eval(params.imsak), times.imsak, 'ccw');
        const fajr = this.sunAngleTime(this.eval(params.fajr), times.fajr, 'ccw');
        const sunrise = this.sunAngleTime(this.riseSetAngle(), times.sunrise, 'ccw');
        const dhuhr = this.midDay(times.dhuhr);
        const asr = this.asrTime(this.asrFactor(params.asr), times.asr);
        const sunset = this.sunAngleTime(this.riseSetAngle(), times.sunset);
        const maghrib = this.sunAngleTime(this.eval(params.maghrib), times.maghrib);
        const isha = this.sunAngleTime(this.eval(params.isha), times.isha);

        return {
            imsak: imsak, fajr: fajr, sunrise: sunrise, dhuhr: dhuhr,
            asr: asr, sunset: sunset, maghrib: maghrib, isha: isha
        };
    }

    // compute prayer times
    computeTimes(): Times {
        // default times
        let times: Times = {
            imsak: 5, fajr: 5, sunrise: 6, dhuhr: 12,
            asr: 13, sunset: 18, maghrib: 18, isha: 18
        };

        // main iterations
        for (let i = 1; i <= this.numIterations; i++) {
            times = this.computePrayerTimes(times);
        }

        times = this.adjustTimes(times);

        // add midnight time
        times.midnight = (this.setting.midnight === 'Jafari') ?
            times.sunset + this.timeDiff(times.sunset, times.fajr) / 2 :
            times.sunset + this.timeDiff(times.sunset, times.sunrise) / 2;

        times = this.tuneTimes(times);
        return this.modifyFormats(times);
    }

    // adjust times
    adjustTimes(times: Times): Times {
        const params = this.setting;
        for (const i in times) {
            times[i] += this.timeZone - this.lng / 15;
        }

        if (params.highLats !== 'None') {
            times = this.adjustHighLats(times);
        }

        if (this.isMin(params.imsak)) {
            times.imsak = times.fajr - this.eval(params.imsak) / 60;
        }
        if (this.isMin(params.maghrib)) {
            times.maghrib = times.sunset + this.eval(params.maghrib) / 60;
        }
        if (this.isMin(params.isha)) {
            times.isha = times.maghrib + this.eval(params.isha) / 60;
        }
        times.dhuhr += this.eval(params.dhuhr) / 60;

        return times;
    }

    /**
     * Adjusts the Asr calculation method.
     * 
     * @param asrParam - The Asr calculation method, either "Standard" or "Hanafi".
     * @throws Will throw an error if the asrParam is not "Standard" or "Hanafi".
     */
    adjustAsrMethod(asrParam: "Standard" | "Hanafi") {
        if (asrParam !== "Standard" && asrParam !== "Hanafi") {
            throw new Error(`Invalid asrParam value: ${asrParam}. Allowed values are "Standard" and "Hanafi".`);
        }
        this.setting.asr = asrParam;
    }

    // get asr shadow factor
    asrFactor(asrParam: string): number {
        const factor = { Standard: 1, Hanafi: 2 }[asrParam];
        return factor ?? this.eval(asrParam);
    }

    // return sun angle for sunset/sunrise
    riseSetAngle(): number {
        const angle = 0.0347 * Math.sqrt(this.elv); // an approximation
        return 0.833 + angle;
    }

    // apply offsets to the times
    tuneTimes(times: Times): Times {
        for (const i in times) {
            times[i] += this.offset[i] / 60;
        }
        return times;
    }

    // convert times to given time format
    modifyFormats(times: Times): Times {
        for (const i in times) {
            times[i] = this.getFormattedTime(times[i], this.timeFormat) as number;
        }
        return times;
    }

    // adjust times for locations in higher latitudes
    adjustHighLats(times: Times): Times {
        const params = this.setting;
        const nightTime = this.timeDiff(times.sunset, times.sunrise);

        times.imsak = this.adjustHLTime(times.imsak, times.sunrise, this.eval(params.imsak), nightTime, 'ccw');
        times.fajr = this.adjustHLTime(times.fajr, times.sunrise, this.eval(params.fajr), nightTime, 'ccw');
        times.isha = this.adjustHLTime(times.isha, times.sunset, this.eval(params.isha), nightTime);
        times.maghrib = this.adjustHLTime(times.maghrib, times.sunset, this.eval(params.maghrib), nightTime);

        return times;
    }

    // adjust a time for higher latitudes
    adjustHLTime(time: number, base: number, angle: number, night: number, direction?: string): number {
        const portion = this.nightPortion(angle, night);
        const timeDiff = (direction === 'ccw') ?
            this.timeDiff(time, base) :
            this.timeDiff(base, time);
        if (isNaN(time) || timeDiff > portion) {
            time = base + (direction === 'ccw' ? -portion : portion);
        }
        return time;
    }

    // the night portion used for adjusting times in higher latitudes
    nightPortion(angle: number, night: number): number {
        const method = this.setting.highLats;
        let portion = 1 / 2; // MidNight
        if (method === 'AngleBased') {
            portion = 1 / 60 * angle;
        }
        if (method === 'OneSeventh') {
            portion = 1 / 7;
        }
        return portion * night;
    }

    // convert hours to day portions
    dayPortion(times: Times): Times {
        for (const i in times) {
            times[i] /= 24;
        }
        return times;
    }

    // get local time zone
    getTimeZone(date: number[]): number {
        const year = date[0];
        const t1 = this.gmtOffset([year, 0, 1]);
        const t2 = this.gmtOffset([year, 6, 1]);
        return Math.min(t1, t2);
    }

    // get daylight saving for a given date
    getDst(date: number[]): number {
        return this.gmtOffset(date) !== this.getTimeZone(date) ? 1 : 0;
    }

    // GMT offset for a given date
    gmtOffset(date: number[]): number {
        const localDate: Date = new Date(date[0], date[1] - 1, date[2], 12, 0, 0, 0);
        const GMTString = localDate.toUTCString();
        const GMTDate = new Date(GMTString.substring(0, GMTString.lastIndexOf(' ') - 1));
        const hoursDiff = (localDate.getTime() - GMTDate.getTime()) / (1000 * 60 * 60);
        return hoursDiff;
    }

    // convert given string into a number
    eval(str: string | number): number {
        return parseFloat((str + '').split(/[^0-9.+-]/)[0]);
    }

    // detect if input contains 'min'
    isMin(arg: string | number): boolean {
        return (arg + '').indexOf('min') !== -1;
    }

    // compute the difference between two times
    timeDiff(time1: number, time2: number): number {
        return DMath.fixHour(time2 - time1);
    }

    // add a leading 0 if necessary
    twoDigitsFormat(num: number): string {
        return (num < 10) ? '0' + num : num.toString();
    }
}