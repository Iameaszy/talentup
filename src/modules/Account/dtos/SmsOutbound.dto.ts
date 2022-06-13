import { IsNotEmpty, IsOptional, Length } from 'class-validator';

export class SmsOutboundDto {
  @IsNotEmpty()
  @Length(6, 16)
  @IsOptional()
  from?: string;

  @IsNotEmpty()
  @Length(6, 16)
  to: string;

  @Length(1, 120)
  @IsOptional()
  text?: string;
}
