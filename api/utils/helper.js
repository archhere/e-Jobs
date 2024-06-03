export const createError = (status, message) => {
    const err = new Error();
    err.status = status;
    err.message = message;
    return err;
}

// export const createResp = (message) => {
//     const resp = new Response();
//     resp.status = 200;
//     resp.message = message;
// }