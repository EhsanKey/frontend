import type { IItem, IItemFilterParams } from '@/models';
import type { CreateItemDto, UpdateItemDto } from './_dto';

export type CreateItemRequest = CreateItemDto;
export type UpdateItemRequest = UpdateItemDto;
export type GetItemsFilterParams = IItemFilterParams;
export type ItemResult = IItem;
