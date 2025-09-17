export interface Inventory {
    id?: number;
    products_id: number;
    quantity_available: number;
    batch_number: string;
    specs: string;
    location: string;
    entry_date: string;
    last_updated: string;
    status: string;
}
