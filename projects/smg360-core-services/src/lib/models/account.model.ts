export class Account {
    public id: string;
    public name?: string;
    public nameKey?: string;
    public type: any;
    public isActive: boolean;
    public isFavorite: boolean;
    public sources: any;
    public classification: any;

    constructor(_id: string, _name: string, _type: any, _isActive: boolean, _classification: any) {
        this.id = _id;
        this.name = _name;
        this.type = _type;
        this.isActive = _isActive;
        this.isFavorite = false;
        this.sources = {};
        this.classification = _classification;
    }
}
