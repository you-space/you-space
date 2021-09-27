import lodash from 'lodash';
import { upperFirst, camelCase, uniq } from 'lodash';
import { boot } from 'quasar/wrappers';

const getComponentName = (filename: string) => {
    const name = upperFirst(
        camelCase(
            filename
                .replace(/^\.\//, '')
                .replace(/\.\w+$/, '')
                .replace('index', ''),
        ),
    );
    const duplicates = name.replace(/([a-z0-9])([A-Z])/g, '$1 $2').split(' ');

    if (duplicates.length > 1) {
        return uniq(duplicates).join('');
    }

    return duplicates.join('');
};

export default boot(({ app }) => {
    const componentDirectoryContext = require.context(
        'src/components',
        true,
        /^(?!.*\.(spec|test)\.ts$).*\.(ts|vue)$/,
    );

    const fileNames = componentDirectoryContext.keys();
    const componentsLoaded: string[] = [];

    fileNames.forEach((filename) => {
        const component = componentDirectoryContext(filename);

        const componentName = lodash.get(
            component,
            'default.name',
            getComponentName(filename),
        );

        const exclude = ['YsJsonViewerDialog'];

        if (componentsLoaded.concat(exclude).includes(componentName)) {
            return;
        }

        if (componentName.charAt(0) !== 'Y') {
            return;
        }

        componentsLoaded.push(componentName);

        app.component(componentName, component.default || component);
    });
});
