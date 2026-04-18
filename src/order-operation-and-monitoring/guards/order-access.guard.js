import userService from '@/authentication/services/user.service';

export function orderAccessGuard(to, from, next) {
    const profile = userService.getCurrentUserProfile();

    if (profile?.role === 'Liquor Store Owner' || profile?.role === 'Supplier') {
        next();
    } else {
        next('/unauthorized');
    }
}
