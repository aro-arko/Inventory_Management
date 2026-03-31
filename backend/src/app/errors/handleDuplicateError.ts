/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
const handleDuplicateError = (err: any) => {
    const statusCode = 400;

    return {
        statusCode,
        message: 'Email already exists. Please use a different email',
    };
};

export default handleDuplicateError;