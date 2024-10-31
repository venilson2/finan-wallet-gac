export class ResponseAccontDto {
  id: string;
  balance: number;
  user_id: string;
  created_at: Date;
  updated_at: Date;

  constructor(params: Partial<{
    id: string;
    balance: number;
    user_id: string;
    created_at: Date;
    updated_at: Date;
  }>) {
    this.id = params.id;
    this.balance = params.balance;
    this.user_id = params.user_id;
    this.created_at = params.created_at;
    this.updated_at = params.updated_at;
  }
}
