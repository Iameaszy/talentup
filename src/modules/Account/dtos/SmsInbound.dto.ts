import { IsNotEmpty, IsOptional, Length } from 'class-validator';

export class SmsInboundDto {
  @IsNotEmpty()
  @Length(6, 16)
  from: string;

  @IsNotEmpty()
  @Length(6, 16)
  @IsOptional()
  to?: string;

  @Length(1, 120)
  @IsOptional()
  text: string;
}
