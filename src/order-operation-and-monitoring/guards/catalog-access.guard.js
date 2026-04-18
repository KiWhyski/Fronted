import userService from '@/authentication/services/user.service';

export function catalogAccessGuard(to, from, next) {
    const profile = userService.getCurrentUserProfile();

    if (profile?.role === 'Liquor Store Owner') {
        next();
    } else {
        next('/unauthorized');
    }
}
