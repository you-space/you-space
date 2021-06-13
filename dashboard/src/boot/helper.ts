import { i18n } from './i18n';
import { boot } from 'quasar/wrappers';

const rules = {
    required: (v?: string) =>
        (v && v.length > 0) || i18n.global.t('validation.rules.required'),
};
function getFileBase64(file: File) {
    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });
}

const helper = { rules, getFileBase64 };

function useHelper() {
    return helper;
}

export default boot(({ app }) => {
    app.config.globalProperties.$helper = helper;
});

export { useHelper };
