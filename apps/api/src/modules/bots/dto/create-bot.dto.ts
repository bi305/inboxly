import { IsString, MinLength } from 'class-validator'

export class CreateBotDto {
  @IsString()
  @MinLength(2)
  name!: string
}
