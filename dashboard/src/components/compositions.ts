import { ref } from 'vue';

export interface Pagination {
    sortBy: string;
    descending: boolean;
    page: number;
    rowsPerPage: number;
    rowsNumber: number;
}

export interface ServerResponse<T = Record<string, never>> {
    data: T[];
    meta: {
        total: number;
    };
}

interface SetDataCallback<T> {
    (response: ServerResponse<T>): void;
}

interface GetDataCallback<T> {
    (pagination: Pagination): Promise<ServerResponse<T>>;
}

export function createServerPagination<T = Record<string, never>>(
    getData: GetDataCallback<T>,
    setData: SetDataCallback<T>,
) {
    const pagination = ref({
        sortBy: 'desc',
        descending: false,
        page: 1,
        rowsPerPage: 20,
        rowsNumber: 10,
    });

    const reload = async (props: { pagination: Pagination }) => {
        const { data, meta } = await getData(props.pagination);

        pagination.value.rowsNumber = meta.total;

        pagination.value.page = props.pagination.page;
        pagination.value.rowsPerPage = props.pagination.rowsPerPage;
        pagination.value.sortBy = props.pagination.sortBy;
        pagination.value.descending = props.pagination.descending;

        setData({ data, meta });
    };

    return {
        pagination,
        reload,
    };
}
