export default class User {
  readonly id: string;
  email: string;
  name: string;
  hashedPassword: string;
  readonly createdAt: Date;
  updatedAt: Date;

  //construct user
  constructor(props: {
    id: string;
    email: string;
    name: string;
    hashedPassword: string;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = props.id;
    this.email = props.email;
    this.name = props.name;
    this.hashedPassword = props.hashedPassword;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  public updateProfile(data: { name?: string; email?: string; password?: string}) {
    if (data.name !== undefined) {
      this.name = data.name;
    }
    if (data.email !== undefined) {
      this.email = data.email;
    }
    if (data.password !== undefined) {
      this.hashedPassword = data.password;
    }
    this.updatedAt = new Date();
  }
}

