import { BaseService } from '@/shared/services/base.service.js';
import axios from 'axios';

class UserService extends BaseService {
    constructor() {
        super();
        this.apiUrl            = import.meta.env.VITE_API_URL;

        // Rutas específicas del micro‑frontend JSON‑server o API real
        this.resourceEndpoint  = import.meta.env.VITE_USER_ENDPOINT_PATH;      // '/users'
        this.profileEndpoint   = import.meta.env.VITE_PROFILE_ENDPOINT_PATH;   // '/profiles'
        this.accountEndpoint   = import.meta.env.VITE_ACCOUNT_ENDPOINT_PATH;   // '/api/v1/accounts'
    }

    /* ───────────────────────────────  AUTH  ─────────────────────────────── */

    /**
     * Inicia sesión: guarda user, profile y account en localStorage.
     * @param {string} username
     * @param {string} password
     * @returns {Promise<boolean>}
     */
    async login(username, password) {
        try {
            // 1) Buscar usuario
            const { data: users } = await axios.get(
                `${this.apiUrl}${this.resourceEndpoint}`,
                { params: { username, password } }
            );
            if (users.length === 0) return false;

            const user = users[0];

            // 2) Obtener perfil
            const { data: profile } = await axios.get(
                `${this.apiUrl}${this.profileEndpoint}/${user.profileId}`
            );
            if (!profile) throw new Error('Profile not found');

            // 3) Obtener cuenta (vía e‑mail)
            const { data: accountList } = await axios.get(
                `${this.apiUrl}${this.accountEndpoint}`,
                { params: { email: username } }
            );
            const account = accountList?.length ? accountList[0] : null;
            if (!account) console.warn('No se encontró cuenta para', username);

            // 4) Consolidar y persistir
            const currentUser = {
                ...user,
                profileId:   profile.profileId,
                profile,
                accountId:   account?.accountId ?? null,
                account      // objeto completo o null
            };

            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            return true;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    /* ─────────────────────────────  HELPERS  ────────────────────────────── */

    getCurrentUser() {
        const saved = localStorage.getItem('currentUser') ?? sessionStorage.getItem('currentUser');
        return saved ? JSON.parse(saved) : null;
    }

    getCurrentUserProfile() {
        return this.getCurrentUser()?.profile ?? null;
    }

    /** Nuevo: devuelve la cuenta actual o null */
    getCurrentUserAccount() {
        return this.getCurrentUser()?.account ?? null;
    }

    /* ───────────────────────────  SEARCH BY EMAIL  ──────────────────────── */

    async getProfileByEmail(email) {
        try {
            const { data: profiles } = await axios.get(`${this.apiUrl}${this.profileEndpoint}`, {
                params: { email }
            });
            return profiles.length ? profiles[0] : null;
        } catch (e) {
            console.error('Error al obtener perfil por email:', e);
            return null;
        }
    }

    async getAccountByEmail(email) {
        try {
            const { data: accounts } = await axios.get(`${this.apiUrl}${this.accountEndpoint}`, {
                params: { email }
            });
            return accounts.length ? accounts[0] : null;
        } catch (e) {
            console.error('Error al obtener cuenta por email:', e);
            return null;
        }
    }

    /* ──────────────────────────────  REGISTER  ──────────────────────────── */

    async register({ name, email, password, role }) {
        try {
            // lógica mock con JSON‑server
            const { data: newUser } = await axios.post(`${this.apiUrl}/users`, {
                username: email,
                password
            });

            const profile = {
                id: newUser.id,
                profileId: newUser.id,
                userId: newUser.id,
                name,
                email,
                role
            };

            await axios.post(`${this.apiUrl}/profiles`, profile);
            await axios.patch(`${this.apiUrl}/users/${newUser.id}`, { profileId: newUser.id });

            return newUser;
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    }
}

export default new UserService();