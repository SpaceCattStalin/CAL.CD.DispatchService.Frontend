import { createStaticStyles } from 'antd-style';

export const inputClassNames = createStaticStyles(({ css }) => ({
    root: css`
            position: relative;
            background-color: transparent;
            border: 1px solid #6a7282;
            border-radius: 4px;
            box-sizing: border-box;
            min-height: 30px;
            align-items: stretch;

            ::after {
                content: '';
                position: absolute;
                inset: -4px;
                border: 2px solid transparent;
                border-radius: 6px;
                pointer-events: none;
                transition: border-color 0.15s;
            }

            :hover,
            :focus-within,
            :focus {
                border-color: #6a7282;
            }

            :focus-within::after,
            :focus::after {
                border-color: rgb(0, 91, 168);
                box-shadow: none;
            }
        `,
    suffix: css`
            display: flex;
            align-items: center;

            > *:last-child {
                border-left: 0.5px solid #6a7282;
                padding-left: 8px;
                margin-left: 4px;
                align-self: stretch;
                cursor: pointer;
            }
        `
}));

export const numberClassNames = createStaticStyles(({ css }) => ({
    root: css`
            position: relative;
            background-color: transparent;
            border: 1px solid #6a7282;
            border-radius: 4px;
            box-sizing: border-box;
            min-height: 30px;
            align-items: stretch;

            ::after {
                content: '';
                position: absolute;
                inset: -4px;
                border: 2px solid transparent;
                border-radius: 6px;
                pointer-events: none;
                transition: border-color 0.15s;
            }

            :hover,
            :focus-within,
            :focus {
                border-color: #6a7282;
            }

            :focus-within::after,
            :focus::after {
                border-color: rgb(0, 91, 168);
                box-shadow: none;
            }

            input::placeholder {
                color: #9ca3af;
                opacity: 1;
            }
        `,
    prefix: css`
            color: #6a7282;
            margin-right: 4px;
        `
}));

export const datePickerClassNames = createStaticStyles(({ css }) => ({
    root: css`
            position: relative;
            background-color: transparent;
            border: 1px solid #6a7282;
            border-radius: 4px;
            box-sizing: border-box;
            min-height: 30px;
            align-items: stretch;

            ::after {
                content: '';
                position: absolute;
                inset: -4px;
                border: 2px solid transparent;
                border-radius: 6px;
                pointer-events: none;
                transition: border-color 0.15s;
            }

            :hover,
            :focus-within,
            :focus {
                border-color: #6a7282;
            }

            :focus-within::after,
            :focus::after {
                border-color: rgb(0, 91, 168);
                box-shadow: none;
            }

            input::placeholder {
                color: #9ca3af;
                opacity: 1;
            }
        `
}));

export const selectClassNames = createStaticStyles(({ css }) => ({
    root: css`
            position: relative;
            background-color: transparent;
            border-radius: 4px;
            box-sizing: border-box;
            min-height: 30px;

            .ant-select-selector {
                background-color: transparent !important;
                border: 1px solid #6a7282 !important;
                border-radius: 4px !important;
            }

            ::after {
                content: '';
                position: absolute;
                inset: -4px;
                border: 2px solid transparent;
                border-radius: 6px;
                pointer-events: none;
                transition: border-color 0.15s;
            }

            :hover .ant-select-selector {
                border-color: #6a7282 !important;
            }

            :focus-within::after {
                border-color: rgb(0, 91, 168);
                box-shadow: none;
            }
        `
}));

export const collapseClassNames = createStaticStyles(({ css }) => ({
    root: css`
            background-color: transparent;
            border: 0;
            border-radius: 0;
            padding-top: 8px;
            padding-bottom: 12px;
            .ant-collapse-panel {
                border-top: 0;
            }
        `,
    header: css`
            padding: 6px 20px !important;

            border-radius: 0 !important;

            :hover{
                background-color: #EBF6FF;
            }
        `,
    title: css`
            color: rgb(0, 91, 168);
            padding: 0 !important;
            font-weight: 500;
            text-align: left;
        `,
    icon: css`
            padding: 0 !important;
            color: rgb(0, 91, 168);
        `,
    body: css`
            padding: 4px 0 0px 20px !important;
        `
}));