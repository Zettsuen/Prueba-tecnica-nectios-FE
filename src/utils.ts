

export function convertToHash(text: string) {
    return require('crypto').createHash('sha512').update(text, 'utf-8').digest('hex')
}

export function randomString(length = 8){
    // Declare all characters
    let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    // Pick characers randomly
    let str = '';
    for (let i = 0; i < length; i++) {
        str += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return str;

};