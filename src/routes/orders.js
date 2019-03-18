import security from '../lib/security';
import OrdersService from '../services/orders/orders';
import OrderAddressService from '../services/orders/orderAddress';
import OrderItemsService from '../services/orders/orderItems';
import OrdertTansactionsService from '../services/orders/orderTransactions';
import OrdertDiscountsService from '../services/orders/orderDiscounts';
import PaymentGateways from '../paymentGateways';

class OrdersRoute {
	constructor(router) {
		this.router = router;
		this.registerRoutes();
	}

	registerRoutes() {
		this.router.get(
			'/v1/orders',
			security.checkUserScope.bind(this, security.scope.READ_ORDERS),
			this.getOrders.bind(this)
		);
		this.router.post(
			'/v1/orders',
			security.checkUserScope.bind(this, security.scope.WRITE_ORDERS),
			this.addOrder.bind(this)
		);
		this.router.get(
			'/v1/orders/:id',
			security.checkUserScope.bind(this, security.scope.READ_ORDERS),
			this.getSingleOrder.bind(this)
		);
		this.router.put(
			'/v1/orders/:id',
			security.checkUserScope.bind(this, security.scope.WRITE_ORDERS),
			this.updateOrder.bind(this)
		);
		this.router.delete(
			'/v1/orders/:id',
			security.checkUserScope.bind(this, security.scope.WRITE_ORDERS),
			this.deleteOrder.bind(this)
		);

		this.router.put(
			'/v1/orders/:id/recalculate',
			security.checkUserScope.bind(this, security.scope.WRITE_ORDERS),
			this.recalculateOrder.bind(this)
		);
		this.router.put(
			'/v1/orders/:id/checkout',
			security.checkUserScope.bind(this, security.scope.WRITE_ORDERS),
			this.checkoutOrder.bind(this)
		);
		this.router.put(
			'/v1/orders/:id/cancel',
			security.checkUserScope.bind(this, security.scope.WRITE_ORDERS),
			this.cancelOrder.bind(this)
		);
		this.router.put(
			'/v1/orders/:id/close',
			security.checkUserScope.bind(this, security.scope.WRITE_ORDERS),
			this.closeOrder.bind(this)
		);

		this.router.put(
			'/v1/orders/:id/billing_address',
			security.checkUserScope.bind(this, security.scope.WRITE_ORDERS),
			this.updateBillingAddress.bind(this)
		);
		this.router.put(
			'/v1/orders/:id/shipping_address',
			security.checkUserScope.bind(this, security.scope.WRITE_ORDERS),
			this.updateShippingAddress.bind(this)
		);

		this.router.post(
			'/v1/orders/:id/items',
			security.checkUserScope.bind(this, security.scope.WRITE_ORDERS),
			this.addItem.bind(this)
		);
		this.router.put(
			'/v1/orders/:id/items/:item_id',
			security.checkUserScope.bind(this, security.scope.WRITE_ORDERS),
			this.updateItem.bind(this)
		);
		this.router.delete(
			'/v1/orders/:id/items/:item_id',
			security.checkUserScope.bind(this, security.scope.WRITE_ORDERS),
			this.deleteItem.bind(this)
		);

		this.router.post(
			'/v1/orders/:id/transactions',
			security.checkUserScope.bind(this, security.scope.WRITE_ORDERS),
			this.addTransaction.bind(this)
		);
		this.router.put(
			'/v1/orders/:id/transactions/:transaction_id',
			security.checkUserScope.bind(this, security.scope.WRITE_ORDERS),
			this.updateTransaction.bind(this)
		);
		this.router.delete(
			'/v1/orders/:id/transactions/:transaction_id',
			security.checkUserScope.bind(this, security.scope.WRITE_ORDERS),
			this.deleteTransaction.bind(this)
		);

		this.router.post(
			'/v1/orders/:id/discounts',
			security.checkUserScope.bind(this, security.scope.WRITE_ORDERS),
			this.addDiscount.bind(this)
		);
		this.router.put(
			'/v1/orders/:id/discounts/:discount_id',
			security.checkUserScope.bind(this, security.scope.WRITE_ORDERS),
			this.updateDiscount.bind(this)
		);
		this.router.delete(
			'/v1/orders/:id/discounts/:discount_id',
			security.checkUserScope.bind(this, security.scope.WRITE_ORDERS),
			this.deleteDiscount.bind(this)
		);

		this.router.get(
			'/v1/orders/:id/payment_form_settings',
			security.checkUserScope.bind(this, security.scope.READ_ORDERS),
			this.getPaymentFormSettings.bind(this)
		);

		this.router.post(
			'/v1/orders/:id/charge',
			security.checkUserScope.bind(this, security.scope.WRITE_ORDERS),
			this.chargeOrder.bind(this)
		);
	}

	async getOrders(req, res, next) {
		await OrdersService.getOrders(req.query)
			.then(data => {
				return res.send(data);
			})
			.catch(next);
	}

	async getSingleOrder(req, res, next) {
		await OrdersService.getSingleOrder(req.params.id)
			.then(data => {
				if (data) {
					return res.send(data);
				} else {
					return res.status(404).end();
				}
			})
			.catch(next);
	}

	async addOrder(req, res, next) {
		await OrdersService.addOrder(req.body)
			.then(data => {
				return res.send(data);
			})
			.catch(next);
	}

	async updateOrder(req, res, next) {
		await OrdersService.updateOrder(req.params.id, req.body)
			.then(data => {
				if (data) {
					return res.send(data);
				} else {
					return res.status(404).end();
				}
			})
			.catch(next);
	}

	async deleteOrder(req, res, next) {
		await OrdersService.deleteOrder(req.params.id)
			.then(data => {
				return res.status(data ? 200 : 404).end();
			})
			.catch(next);
	}

	async recalculateOrder(req, res, next) {
		await OrderItemsService.calculateAndUpdateAllItems(req.params.id)
			.then(data => {
				if (data) {
					return res.send(data);
				} else {
					return res.status(404).end();
				}
			})
			.catch(next);
	}

	async checkoutOrder(req, res, next) {
		await OrdersService.checkoutOrder(req.params.id)
			.then(data => {
				return res.send(data);
			})
			.catch(next);
	}

	async cancelOrder(req, res, next) {
		await OrdersService.cancelOrder(req.params.id)
			.then(data => {
				return res.send(data);
			})
			.catch(next);
	}

	async closeOrder(req, res, next) {
		await OrdersService.closeOrder(req.params.id)
			.then(data => {
				return res.send(data);
			})
			.catch(next);
	}

	async updateBillingAddress(req, res, next) {
		await OrderAddressService.updateBillingAddress(req.params.id, req.body)
			.then(data => {
				if (data) {
					return res.send(data);
				} else {
					return res.status(404).end();
				}
			})
			.catch(next);
	}

	async updateShippingAddress(req, res, next) {
		await OrderAddressService.updateShippingAddress(req.params.id, req.body)
			.then(data => {
				if (data) {
					return res.send(data);
				} else {
					return res.status(404).end();
				}
			})
			.catch(next);
	}

	async addItem(req, res, next) {
		const order_id = req.params.id;
		await OrderItemsService.addItem(order_id, req.body)
			.then(data => {
				return res.send(data);
			})
			.catch(next);
	}

	async updateItem(req, res, next) {
		const order_id = req.params.id;
		const item_id = req.params.item_id;
		await OrderItemsService.updateItem(order_id, item_id, req.body)
			.then(data => {
				if (data) {
					return res.send(data);
				} else {
					return res.status(404).end();
				}
			})
			.catch(next);
	}

	async deleteItem(req, res, next) {
		try {
			const order_id = req.params.id;
			const item_id = req.params.item_id;
			await OrderItemsService.deleteItem(order_id, item_id)
				.then(data => {
					return res.send(data);
				})
		} catch(err) {
			next(err);
		}
	}

	async addTransaction(req, res, next) {
		try {
			const order_id = req.params.id;
			await OrdertTansactionsService.addTransaction(order_id, req.body)
				.then(data => {
					return res.send(data);
				})
		} catch(err) {
			next(err);
		}
	}

	async updateTransaction(req, res, next) {
		const order_id = req.params.id;
		const transaction_id = req.params.item_id;
		await OrdertTansactionsService.updateTransaction(
			order_id,
			transaction_id,
			req.body
		)
			.then(data => {
				if (data) {
					return res.send(data);
				} else {
					return res.status(404).end();
				}
			})
			.catch(next);
	}

	async deleteTransaction(req, res, next) {
		try {
			const order_id = req.params.id;
			const transaction_id = req.params.item_id;
			let data = await OrdertTansactionsService.deleteTransaction(order_id, transaction_id)
			return res.send(data);
		} catch(err) {
			next(err);
		}
	}

	async addDiscount(req, res, next) {
		try {
			const order_id = req.params.id;
			let data = await OrdertDiscountsService.addDiscount(order_id, req.body);
			return res.send(data);
		} catch(err) {
			next(err);
		}
	}

	async updateDiscount(req, res, next) {
		try {
			const order_id = req.params.id;
			const discount_id = req.params.item_id;
			let data = await OrdertDiscountsService.updateDiscount(order_id, discount_id, req.body);
			if (data) {
				return res.send(data);
			} else {
				return res.status(404).end();
			}
		} catch(err) {
			next(err);
		}
	}

	async deleteDiscount(req, res, next) {
		try {
			const order_id = req.params.id;
			const discount_id = req.params.item_id;
			let data = await OrdertDiscountsService.deleteDiscount(order_id, discount_id);
			return res.send(data);
		} catch(err) {
			next(err);
		}
	}

	async getPaymentFormSettings(req, res, next) {
		try {
			const orderId = req.params.id;
			let data = await PaymentGateways.getPaymentFormSettings(orderId);
			return res.send(data);
		} catch(err) {
			next(err);
		}
	}

	async chargeOrder(req, res, next) {
		try {
			const orderId = req.params.id;
			const isSuccess = await OrdersService.chargeOrder(orderId);
			return res.status(isSuccess ? 200 : 500).end();
		} catch(err) {
			return next(err);
		}
	}
}

export default OrdersRoute;
