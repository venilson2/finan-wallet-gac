// export class TransferResponse {
//   status: 'success' | 'failure';
//   message: string;
//   referenceCode: string;
//   data?: {
//     transferId: string;
//     senderId: string;
//     receiverId: string;
//     amount: number;
//     date: Date;
//   };

//   constructor(params: Partial<{
//     status: 'success' | 'failure';
//     message: string;
//     referenceCode: string;
//     data?: {
//       transferId: string;
//       senderId: string;
//       receiverId: string;
//       amount: number;
//       date: Date;
//     };
//   }>) {
//     this.status = params.status;
//     this.message = params.message;
//     this.referenceCode = params.referenceCode;
//     this.data = params.data;
//   }
// }

export class TransferResponseDto {
  id: string;
  senderId: string;
  receiverId: string;
  amount: number;
  status: 'completed' | 'reversed';
  originalTransferId?: string;

  constructor(params: Partial<{
    id: string;
    senderId: string;
    receiverId: string;
    amount: number;
    status: 'completed' | 'reversed';
    originalTransferId?: string;
  }>) {
    this.id = params.id;
    this.senderId = params.senderId;
    this.receiverId = params.receiverId;
    this.amount = params.amount;
    this.status = params.status;
    this.originalTransferId = params.originalTransferId;
  }
}