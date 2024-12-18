"use client";

import Logo from "../components/logo";

const Error = () => {
    return (
        <>
            <Logo size={100} type={2} />
            <p className='text-danger m-3 fs-5 fw-bold'>Error 404: Page Not Found</p>
        </>
    );
}

export default Error;