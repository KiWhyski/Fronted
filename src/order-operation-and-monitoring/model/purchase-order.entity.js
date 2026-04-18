import { CatalogItem } from './catalog-item.entity.js';
import {Money} from "@/shared/model/money.js";
import {DateTime} from "@/shared/model/date-time.js";
import {Profile} from "@/profile-management/model/profile.entity.js";

export const PurchaseOrder = {
    id: 0,
    date: DateTime,
    status: '',
    buyer: Profile,
    supplier: Profile,
    items: [CatalogItem],
    totalAmount: Money,
    totalItems: 0
};
