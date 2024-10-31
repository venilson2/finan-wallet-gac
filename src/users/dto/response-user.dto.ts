export class ResponseUserDto {
  id: string;
  name: string;
  email: string;
  password: string;
  account?: {
    id: string;
    balance: number;
    created_at?: Date;
    updated_at?: Date;
  };
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;

  constructor(params: Partial<{
    id: string;
    name: string;
    email: string;
    password: string;
    account?: {
      id: string;
      balance: number;
      created_at?: Date;
      updated_at?: Date;
    };
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
  }>) {
    this.id = params.id;
    this.name = params.name;
    this.email = params.email;
    this.password = params.password;
    this.account = params.account;
    this.created_at = params.created_at;
    this.updated_at = params.updated_at;
    this.deleted_at = params.deleted_at || null;
  }
}
