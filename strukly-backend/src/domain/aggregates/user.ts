export default class User {
  readonly id: number;
  readonly email: string;
  readonly name: string;
  readonly hashedPassword: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  //construct user
  constructor(props: {
    id: number;
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
}