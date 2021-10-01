<template>
    <q-page class="row justify-center items-center login-page">
        <q-card square bordered class="q-pa-lg shadow-1 login-page-card">
            <q-card-section>
                <q-form class="q-gutter-y-md" @submit="login">
                    <div class="text-h6">
                        {{ $t('login') }}
                    </div>
                    <q-input
                        v-model="emailOrUsername"
                        square
                        filled
                        clearable
                        autocomplete
                        label="username/email"
                        :rules="[$helper.rules.required]"
                    />
                    <q-input
                        v-model="password"
                        square
                        filled
                        clearable
                        autocomplete
                        :type="!showPassword ? 'password' : 'text'"
                        label="password"
                    >
                        <template #append>
                            <q-icon
                                :name="
                                    showPassword
                                        ? 'visibility_off'
                                        : 'visibility'
                                "
                                class="cursor-pointer"
                                @click="showPassword = !showPassword"
                            />
                        </template>
                    </q-input>
                    <q-btn
                        :loading="loading"
                        unelevated
                        type="submit"
                        color="primary"
                        size="lg"
                        class="full-width"
                        label="Login"
                    />
                </q-form>
            </q-card-section>
        </q-card>
    </q-page>
</template>

<script>
import { ref, defineComponent } from 'vue';
import { useStore } from 'src/store';
import { useRouter } from 'vue-router';
import { api } from 'src/boot/axios';
export default defineComponent({
    name: 'Login',
    data() {
        const store = useStore();
        const router = useRouter();

        const emailOrUsername = ref('');
        const password = ref('');
        const showPassword = ref(false);
        const loading = ref(false);

        if (store.state.auth.isAuthenticated) {
            void router.push({ name: 'home' });
        }

        const login = async () => {
            try {
                loading.value = true;

                await api.post('auth/login', {
                    emailOrUsername: emailOrUsername.value,
                    password: password.value,
                });

                await store.dispatch('auth/login');

                await router.push({ name: 'home' });

                setTimeout(() => (loading.value = false), 800);
            } catch (error) {
                loading.value = false;
                throw new Error(error);
            }
        };

        return {
            emailOrUsername,
            password,
            showPassword,
            login,
            loading,
        };
    },
});
</script>

<style lang="scss">
.login-page {
    .login-page-card {
        width: 100%;
        max-width: 350px;
    }
}
</style>
