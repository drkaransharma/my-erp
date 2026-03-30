export type ProductStatus = "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";
export type POStatus = "DRAFT" | "ORDERED" | "RECEIVED" | "CANCELLED";
export type MovementType = "IN" | "OUT" | "TRANSFER";

export interface Warehouse {
  id: string;
  name: string;
  location: string | null;
  capacity: number;
  description: string | null;
  _count?: { products: number };
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  description: string | null;
  quantity: number;
  unitPrice: number;
  reorderLevel: number;
  warehouseId: string | null;
  status: ProductStatus;
  warehouse?: Warehouse;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierId: string;
  date: string;
  totalAmount: number;
  status: POStatus;
  notes: string | null;
  supplier?: { id: string; name: string };
  items?: PurchaseOrderItem[];
  _count?: { items: number };
}

export interface PurchaseOrderItem {
  id: string;
  purchaseOrderId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  product?: Product;
}

export interface StockMovement {
  id: string;
  productId: string;
  warehouseId: string | null;
  type: MovementType;
  quantity: number;
  reference: string | null;
  date: string;
  product?: Product;
  warehouse?: Warehouse;
}
