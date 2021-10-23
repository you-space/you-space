<template>
    <q-page padding>
        <q-inner-loading :showing="loading" />
        <div ref="element" />
    </q-page>
</template>
<script lang="ts">
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { defineComponent, h, ref, shallowRef, onMounted } from 'vue';
import { findPage, findPageFile, PageFile } from './compositions';

export default defineComponent({
    props: {
        name: {
            type: String,
            required: true,
        },
    },
    setup(props) {
        const loading = ref(false);
        const quasar = useQuasar();
        const router = useRouter();

        const element = ref();

        const component = shallowRef<any>({
            render: () => h('h1', 'Loaging...'),
        });

        async function setPage() {
            const page = await findPage(props.name);

            await Promise.all(page.files.map(injectFile));
        }

        async function injectFile({ type, name }: PageFile) {
            if (type === 'main') {
                const { mount } = await import(
                    /* webpackIgnore: true */ `/api/v1/pages/${props.name}/${name}`
                );

                await mount(element.value);

                return;
            }

            if (type === 'css') {
                const css = await findPageFile(props.name, name);
                const style = document.createElement('style');

                style.innerHTML = css;

                element.value.appendChild(style);
            }
        }

        async function load() {
            loading.value = true;
            return setPage()
                .then(() => setTimeout(() => (loading.value = false), 800))
                .catch((err) => {
                    console.error(err);

                    quasar.notify({
                        color: 'negative',
                        message: 'Error mountin page',
                    });

                    return router.push('/');
                });
        }

        onMounted(load);

        // watch(() => props.name, setPage, {
        //     immediate: true,
        // });

        return {
            element,
            component,
            loading,
        };
    },
});
</script>
