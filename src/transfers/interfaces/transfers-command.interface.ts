import { AccountEntity } from 'src/accounts/entities/account.entity';

export interface ITransfersCommand {
  configure(sourceAccount: AccountEntity, destinationAccount: AccountEntity, amount: number): void;
  execute(): void;
  undo(): void;
  validate(): void;
}
