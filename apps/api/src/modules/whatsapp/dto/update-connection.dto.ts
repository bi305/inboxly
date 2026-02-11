import { IsOptional, IsString } from 'class-validator'

export class UpdateConnectionDto {
  @IsOptional()
  @IsString()
  accessToken?: string

  @IsOptional()
  @IsString()
  verifyToken?: string

  @IsOptional()
  @IsString()
  botId?: string
}
