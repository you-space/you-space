<template>
    <q-page class="row justify-center items-center login-page">
        <q-card square bordered class="q-pa-lg shadow-1 login-page-card">
            <q-card-section>
                <q-form class="q-gutter-y-md" @submit="login">
                    <q-input
                        v-model="emailOrUsername"
                        square
                        filled
                        clearable
                        label="username/email"
                        :rules="[$helper.rules.required]"
                    />
                    <q-input
                        v-model="password"
                        square
                        filled
                        clearable
                        type="password"
                        label="password"
                    />
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
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { api } from 'src/boot/axios';
export default defineComponent({
    name: 'Login',
    data() {
        const store = useStore();
        const router = useRouter();

        const emailOrUsername = ref('');
        const password = ref('');
        const loading = ref(false);

        const login = async () => {
            loading.value = true;

            const request = await api
                .post('/login', {
                    emailOrUsername: emailOrUsername.value,
                    password: password.value,
                })
                .catch(() => (loading.value = false));

            const token = request.data.token;
            setTimeout(() => {
                loading.value = false;
                store.commit('user/login', token);

                void router.push({ name: 'home' });
            }, 800);
        };

        return {
            emailOrUsername,
            password,
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
