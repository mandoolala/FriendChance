import { Controller, Get, Post, Body, Delete } from '@nestjs/common';
import { AppService } from './app.service';

interface PromissoryNote {
  amount: number;
  purpose: string;
  createdAt: string;
  contractDate: string;
  paybackDate: string;
  borrower: string;
  lender: string;
  state: 'draft' | 'requestedConfirm' | 'pendingActivation' | 'activated' | 'ended';
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  promissories: PromissoryNote[] = [{
    createdAt: '123',
    amount: 916000000,
    purpose: 'marriage예물for만두',
    contractDate: '2019-11-26T12:46:49.744Z',
    paybackDate: '2099-12-26T12:46:49.744Z',
    borrower: 'jun',
    lender: 'bank',
    state: 'draft',
  }];

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('promissories')
  getPromissories(): PromissoryNote[] {
    return this.promissories;
  }

  @Get('promissories/:id')
  getPromissoryDetail(): PromissoryNote {
    return this.promissories[0];
  }

  @Post('promissories')
  createPromissory(@Body() note: PromissoryNote): PromissoryNote {
    return note;
  }

  @Post('promissories/:id/edit')
  // tslint:disable-next-line: no-empty
  editPromissory(): void {
    // only when is draft
    // draft -> draft
  }

  @Delete('promissories/:id')
  // tslint:disable-next-line: no-empty
  deletePromissory(): void {
    // draft -> [deleted]
  }

  @Post('promissories/:id/requestConfirm')
  // tslint:disable-next-line: no-empty
  requestConfirm(): void {
    // only when is draft
    // draft -> requestedConfirm
  }

  @Post('promissories/:id/confirm')
  // tslint:disable-next-line: no-empty
  confirmPromissory(): void {
    // requestedConfirm -> pendingActivation
  }

  @Post('promissories/:id/reject')
  // tslint:disable-next-line: no-empty
  rejectPromissory(): void {
    // requestedConfirm -> draft
  }

  @Post('promissories/:id/sendMoney')
  sendMoney(): void {
    // pendingActivation -> activated
  }

  @Post('promissories/:id/cancel')
  // tslint:disable-next-line: no-empty
  cancelSendingMoney(): void {
    // pendingActivation -> draft
  }

  @Post('promissories/:id/payback')
  // tslint:disable-next-line: no-empty
  payback(): void {
    // activated -> ended
  }
}
