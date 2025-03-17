import { post as axiosPost } from 'axios';
import { error as logError } from "./log";

async function postRequest(url, postData, configData, sync, callback, errorCallback) {

    postData = postData || {};

    function responseHandler(result) {
        if( callback instanceof Function ) {
            callback( result );
        }
    }

    function errorHandler(error) {
        if( errorCallback instanceof Function ) {
            errorCallback( error );
        }
    }

    if( sync ){
        await axiosPost(url, postData, configData || null).then(responseHandler).catch(errorHandler || null);
    }
    else{
        axiosPost(url, postData, configData || null).then(responseHandler).catch(errorHandler || null);
    }
};

export default postRequest;
