declare module 'astronomia' {
  export const julian: {
    CalendarGregorianToJD(year: number, month: number, day: number): number
  }
  export const sidereal: {
    mean(jd: number): number
  }
}
