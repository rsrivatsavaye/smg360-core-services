export class Account {
  public id: string;
  public name?: string;
  public nameKey?: string;
  public type: any;
  public isActive: boolean;
  public isFavorite: boolean;
  public sources: any;
  public classification: any;

  // TODO: This constructor could be changed to use the 'public id:string' syntax.  Or this class could be changed to an interface
  // without a constructor.  
  constructor(newId: string, newName: string, newType: any, newIsActive: boolean, newClassification: any) {
    this.id = newId;
    this.name = newName;
    this.type = newType;
    this.isActive = newIsActive;
    this.isFavorite = false;
    this.sources = {};
    this.classification = newClassification;
  }
}
