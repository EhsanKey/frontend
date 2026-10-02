import type { IUser } from '@/models';
import type { LoginRequestDto, LogoutResponseDto } from './_dto';

export type LoginRequest = LoginRequestDto;
export type LoginResult = IUser;
export type GetMeResponse = IUser;
export type LogoutResult = LogoutResponseDto;
