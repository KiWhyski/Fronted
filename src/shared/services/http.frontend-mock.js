/**
 * Respuestas mock para axios (httpInstance) en modo solo-frontend.
 * @param {import('axios').InternalAxiosRequestConfig} config
 */
export function resolveFrontendMockPayload(config) {
  const raw = `${config.baseURL || ''}${config.url || ''}`;
  const url = raw.toLowerCase();
  const method = (config.method || 'get').toLowerCase();

  if (url.includes('/status')) {
    return { accountStatus: 'ACTIVE' };
  }

  if (url.includes('current-benefits-limits')) {
    return { limits: [] };
  }

  if (url.includes('current-plan')) {
    return 'plan_free';
  }

  if (url.includes('/plans')) {
    return [
      {
        planId: 'plan_free',
        planType: 'Free',
        description: 'Plan gratuito',
        price: 0,
        maxWarehouses: 1,
        minWarehouses: 0,
        maxProducts: 50,
      },
      {
        planId: 'plan_premium_monthly',
        planType: 'PremiumMonthly',
        description: 'Plan Premium',
        price: 19.9,
        maxWarehouses: 5,
        minWarehouses: 0,
        maxProducts: 500,
      },
    ];
  }

  if (url.includes('subscriptions')) {
    if (method === 'get') return { status: 'ACTIVE' };
    return { success: true };
  }

  if (url.includes('/orders')) {
    if (method === 'get') return [];
    if (method === 'post' || method === 'patch' || method === 'put') {
      return { id: '00000000-0000-0000-0000-000000000099', status: 0 };
    }
  }

  if (url.includes('warehouse') && method === 'get') {
    return [];
  }

  if (url.includes('product') && method === 'get') {
    if (/\/products\/[^/]+\/?$/i.test(raw) && !url.includes('account')) {
      return {
        id: 'mock-product',
        name: 'Demo product',
        minimumStock: 0,
        unitPriceAmount: 0,
      };
    }
    return [];
  }

  if (url.includes('authentication/sign-in') || (url.includes('sign-in') && method === 'post')) {
    let username = 'demo@local.dev';
    try {
      const raw = config.data;
      const body = typeof raw === 'string' ? JSON.parse(raw || '{}') : raw;
      if (body?.username) username = body.username;
    } catch (_) {
      /* ignore */
    }
    return {
      id: '0',
      username,
      token: 'dev-local-preview-token',
      accountId: '00000000-0000-0000-0000-000000000001',
      accountRole: 'LiquorStoreOwner',
    };
  }

  if (url.includes('sign-up') || url.includes('/accounts/sign-up')) {
    return { message: 'ok' };
  }

  if (method === 'post' || method === 'put' || method === 'patch' || method === 'delete') {
    return { success: true, id: '00000000-0000-0000-0000-000000000099' };
  }

  if (method === 'get') {
    return [];
  }

  return {};
}
