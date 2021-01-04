export class UserSettings {
    timezoneOffset: number;
    language: string;
    constructor(timezoneOffset, language) {
        this.timezoneOffset = timezoneOffset;
        this.language = language;
    }
}

