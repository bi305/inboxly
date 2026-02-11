import { IsEmail, IsEnum } from 'class-validator'

export class AddMemberDto {
  @IsEmail()
  email!: string

  @IsEnum(['OWNER', 'ADMIN', 'MEMBER'])
  role!: 'OWNER' | 'ADMIN' | 'MEMBER'
}
