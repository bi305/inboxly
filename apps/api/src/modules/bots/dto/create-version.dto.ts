import { IsObject } from 'class-validator'

export class CreateVersionDto {
  @IsObject()
  flow!: Record<string, unknown>
}
