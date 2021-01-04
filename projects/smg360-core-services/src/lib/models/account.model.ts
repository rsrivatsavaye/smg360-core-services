export class Account {
    public id: string;
    public name?: string;
    public nameKey?: string;
    public type: any;
    public isFavorite: boolean;
    public sources: any;

    constructor(_id: string, _name: string, _type: any) {
        this.id = _id;
        this.name = _name;
        this.type = _type;
        this.isFavorite = false;
        this.sources = {};
    }
}
