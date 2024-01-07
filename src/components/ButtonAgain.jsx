import React, { useState } from "react";
import { Button } from 'antd-mobile';

const ButtonAgain = function ButtonAgain(props) {
    /* props contains the property called by <Button> component */
    let options = { ...props };
    let { children, onClick: handle } = options;
    delete options.children;

    /* status */
    let [loading, setLoading] = useState(false);
    const clickHandle = async () => {
        setLoading(true);
        try {
            await handle();
        } catch (_) { }
        setLoading(false);
    };
    if (handle) {
        options.onClick = clickHandle;
    }

    return <Button {...options} loading={loading}>
        {children}
    </Button>;
};
export default ButtonAgain;