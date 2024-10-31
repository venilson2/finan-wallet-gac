import { v7 as uuid } from 'uuid';

export class UserEntity {
  id: string;
  name: string;
  password: string;
  email: string;

  constructor(params: Partial<{
    id: string;
    name: string;
    password: string;
    email: string;
  }>) {
    this.id = params.id || uuid();
    this.name = params.name;
    this.password = params.password;
    this.email = params.email;
  }
}
