export default class Timer {
    start: number;

    constructor() {
        this.start = new Date().getTime();
    }

    getElapsed(): string {
        let ms = new Date().getTime() - this.start;

        const hour = Math.floor(ms / 3600000);
        ms -= hour * 3600000;

        const min = Math.floor((ms - hour * 3600000) / 60000);
        ms -= min * 60000;

        const sec = Math.floor((ms - min * 6000) / 1000);
        ms -= sec * 1000;

        return (
            (hour > 0 ? ` ${hour}h` : '') +
            (min > 0 ? ` ${min}m` : '') +
            (sec > 0 ? ` ${sec}s` : '') +
            (ms > 0 ? ` ${ms}ms` : '')
        ).trim();
    }
}
