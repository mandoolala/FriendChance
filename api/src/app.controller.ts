import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';


interface PromissoryNote {
  amount: number;
  purpose: string;
  contractDate: string;
  paybackDate: string;
  borrower: string;
  lender: string;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  promissories: PromissoryNote[] = [{ amount: 916000000,
    purpose: "marriage예물for만두", 
    contractDate: "2019-11-26T12:46:49.744Z",
    paybackDate: "2099-12-26T12:46:49.744Z",
    borrower: "jun",
    lender: "금수저mom?undefined ? newmom : NULL"  }];

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('promissories')
  getPromissories(): PromissoryNote[] {
    return this.promissories;
  }

  @Post('promissories')
  createPromissory(@Body() note: PromissoryNote): PromissoryNote {
    return note;
    // return { amount: 2316000000,
    //         purpose: "marriage집for만두_트리마제60평", 
    //         contractDate: "2019-11-26T12:46:49.744Z",
    //         paybackDate: "2099-12-26T12:46:49.744Z",
    //         borrower: "jun",
    //         lender: "금수저dad?undefined"  };
  }
}
