export interface OrderItem {
    line_item_id: string;
    title: string;
    price: string;
    quantity: number;
    sku: string;
    variant_title?: string;
}

export interface Order {
    id: number;
    order_number: string;
    created_at: string;
    currency: string;
    items: OrderItem[];
}

const API_BASE_URL = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') ?? 'http://localhost:8000/api';

export async function lookupOrder(orderNumber: string, email?: string, zipCode?: string, isGift = false): Promise<Order> {
    const response = await fetch(`${API_BASE_URL}/returns/lookup/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            order_number: orderNumber,
            email: email,
            zip_code: zipCode,
            is_gift: isGift,
        }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to find order');
    }

    return response.json();
}

export async function submitReturn(
    orderId: number,
    items: string[],
    reason: string,
    resolution: 'exchange' | 'refund',
    isGift = false,
    recipientEmail?: string
): Promise<{ id: number; message: string; label_url?: string }> {
    const response = await fetch(`${API_BASE_URL}/returns/submit/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            order_id: orderId,
            items,
            reason,
            resolution,
            is_gift: isGift,
            recipient_email: recipientEmail,
        }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to submit return');
    }

    return response.json();
}
