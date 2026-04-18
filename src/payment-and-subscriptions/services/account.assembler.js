export class AccountAssembler {
    static toEntityFromResource(r) {
        return {
            accountId:   r.accountId,
            email:       r.email,
            businessName:r.businessName,
            accountRole: r.accountRole,
            status:      r.status,
            createdAt:   r.createdAt
        };
    }
}