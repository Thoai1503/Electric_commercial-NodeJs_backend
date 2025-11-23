export default abstract class IPaymentService {
  abstract createPayment(orderId: string, amount: number | string, options?: Record<string, unknown>): Promise<unknown>;
  abstract returnPayment(params: Record<string, unknown>): Promise<unknown>;
}







