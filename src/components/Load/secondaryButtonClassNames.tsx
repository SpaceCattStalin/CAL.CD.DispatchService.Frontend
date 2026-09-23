import { createStaticStyles } from 'antd-style';

export const secondaryButtonClassNames = createStaticStyles(({ css }) => ({
    root: css`
            background-color: transparent;
            border: 1px solid rgb(0, 91, 168);

            :hover {
                background-color: #EBF6FF !important;
                border-color: #2372B8 !important;
                transition: all;
            }
        `,
    content: css`
            color: rgb(0, 91, 168);
        `
}));
