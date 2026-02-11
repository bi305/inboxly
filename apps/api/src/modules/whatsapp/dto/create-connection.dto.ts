import { IsOptional, IsString } from 'class-validator'

export class CreateConnectionDto {
  @IsString()
  phoneNumberId!: string

  @IsString()
  businessId!: string

  @IsString()
  accessToken!: string

  @IsOptional()
  @IsString()
  verifyToken?: string

  @IsOptional()
  @IsString()
  botId?: string
}
