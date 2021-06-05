import { boot } from 'quasar/wrappers';
import JsonViewer from 'vue3-json-viewer';

export default boot(({ app }) => {
    app.use(JsonViewer);
});
